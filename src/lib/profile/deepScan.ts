// src/lib/profile/deepScan.ts
// Deep static analysis — downloads repository archives via codeload (the same
// mechanism the Repository Analyzer uses) and measures how the code is actually
// written: test-to-code ratio, type coverage, comment density, function length,
// cyclomatic complexity, Halstead volume & maintainability index, security smells,
// error handling ratio, and dependency manifests.

import * as ts from 'typescript';
import path from 'path';
import AdmZip from 'adm-zip';
import type { DeepMetrics, SecurityFlags, ManifestFileEntry } from './types';

export type { DeepMetrics, SecurityFlags, ManifestFileEntry };

const MAX_SOURCE_FILES = 250;
const MAX_FILE_BYTES = 512 * 1024; // skip generated/bundled single files
const MAX_MANIFEST_BYTES = 64 * 1024; // 64KB manifest size limit

const SOURCE_EXT = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx']);
const MANIFEST_FILENAMES = new Set(['package.json', 'requirements.txt', 'go.mod', 'cargo.toml']);

export interface HalsteadMetrics {
  totalTokens: number;
  uniqueVocabulary: number;
  volume: number;
  operators: number;
  operands: number;
}

export interface ErrorHandlingCounts {
  tryCatchCount: number;
  asyncCount: number;
  errorHandlingRatio: number;
}

export interface FileMetrics {
  loc: number;
  commentLines: number;
  todoMarkers: number;
  isTest: boolean;
  typedSlots: number;
  totalSlots: number;
  functionLengths: number[];
  functionCCs: number[];
  cyclomaticComplexity: number;
  highComplexityRatio: number;
  maintainabilityIndex: number;
  halstead: HalsteadMetrics;
  securityFlags: SecurityFlags;
  tryCatchCount: number;
  asyncCount: number;
  errorHandlingRatio: number;
}

export function isTestPath(relPath: string): boolean {
  const p = relPath.replace(/\\/g, '/').toLowerCase();
  return /(^|\/)(?:__tests__|test|tests|spec|specs)\//.test(p)
    || /\.(?:test|spec)\.[^/]+$/.test(p)
    || /(?:^|\/)(?:jest|vitest|playwright|cypress)\.(?:config|ini)/.test(p);
}

export function countLoc(content: string): number {
  if (!content || typeof content !== 'string') return 0;
  return content.split('\n').length;
}

export function countCommentLines(sourceFile: ts.SourceFile): number {
  const lineSet = new Set<number>();
  const text = sourceFile.getFullText();
  const regex = /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const start = sourceFile.getLineAndCharacterOfPosition(match.index).line;
    const end = sourceFile.getLineAndCharacterOfPosition(match.index + match[0].length).line;
    for (let l = start; l <= end; l++) lineSet.add(l);
  }
  return lineSet.size;
}

export function countTodoMarkers(text: string): number {
  return (text.match(/\b(?:TODO|FIXME|HACK|XXX)\b/g) || []).length;
}

interface SlotCount { typed: number; total: number }

export function countTypeSlots(sourceFile: ts.SourceFile): SlotCount {
  let typed = 0;
  let total = 0;
  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      for (const param of node.parameters) {
        total++;
        if (param.type) typed++;
      }
      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
        total++;
        if (node.type) typed++;
      } else if (node.type) {
        total++;
        typed++;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return { typed, total };
}

export function collectFunctionLengths(sourceFile: ts.SourceFile): number[] {
  const lengths: number[] = [];
  function visit(node: ts.Node) {
    if (
      (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isMethodDeclaration(node) || ts.isFunctionExpression(node))
      && node.body
    ) {
      const start = sourceFile.getLineAndCharacterOfPosition(node.body.getFullStart()).line;
      const end = sourceFile.getLineAndCharacterOfPosition(node.body.getEnd()).line;
      lengths.push(Math.max(0, end - start));
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return lengths;
}

export type SupportedFunctionNode =
  | ts.FunctionDeclaration
  | ts.ArrowFunction
  | ts.MethodDeclaration
  | ts.FunctionExpression;

export function isFunctionNode(node: ts.Node): node is SupportedFunctionNode {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isFunctionExpression(node)
  );
}

/**
 * Computes Cyclomatic Complexity (CC) for a single function AST node:
 * Base CC = 1.
 * Increments for branch points: if, conditional (? :), for, for..in, for..of,
 * while, do..while, case, catch, and binary logical operators (&&, ||, ??).
 * Branches in nested functions are not counted towards this function.
 */
export function computeFunctionCC(funcNode: SupportedFunctionNode): number {
  if (!funcNode.body) return 1;
  let cc = 1;

  function visit(node: ts.Node) {
    if (
      ts.isIfStatement(node) ||
      ts.isConditionalExpression(node) ||
      ts.isForStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node) ||
      ts.isCaseClause(node) ||
      ts.isCatchClause(node)
    ) {
      cc++;
    } else if (ts.isBinaryExpression(node)) {
      const op = node.operatorToken.kind;
      if (
        op === ts.SyntaxKind.AmpersandAmpersandToken ||
        op === ts.SyntaxKind.BarBarToken ||
        op === ts.SyntaxKind.QuestionQuestionToken
      ) {
        cc++;
      }
    }

    ts.forEachChild(node, child => {
      // Do not count branch points inside nested functions towards outer function
      if (!isFunctionNode(child)) {
        visit(child);
      }
    });
  }

  if (ts.isBlock(funcNode.body)) {
    ts.forEachChild(funcNode.body, child => {
      if (!isFunctionNode(child)) {
        visit(child);
      }
    });
  } else {
    visit(funcNode.body);
  }

  return cc;
}

export function collectFunctionCCs(sourceFile: ts.SourceFile): number[] {
  const ccs: number[] = [];
  function visit(node: ts.Node) {
    if (isFunctionNode(node) && node.body) {
      ccs.push(computeFunctionCC(node));
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return ccs;
}

/**
 * Computes Halstead operators, operands, and volume:
 * HV = N * log2(max(2, n))
 * where N = total tokens (operators + operands) and n = unique vocabulary.
 */
export function computeHalstead(sourceFile: ts.SourceFile): HalsteadMetrics {
  const operators: string[] = [];
  const operands: string[] = [];

  function visit(node: ts.Node) {
    // Operators
    if (ts.isBinaryExpression(node)) {
      operators.push(node.operatorToken.getText(sourceFile) || String(node.operatorToken.kind));
    } else if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) {
      operators.push(String(node.operator));
    } else if (ts.isConditionalExpression(node)) {
      operators.push('?:');
    } else if (ts.isIfStatement(node)) {
      operators.push('if');
      if (node.elseStatement) operators.push('else');
    } else if (ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node)) {
      operators.push('for');
    } else if (ts.isWhileStatement(node) || ts.isDoStatement(node)) {
      operators.push('while');
    } else if (ts.isSwitchStatement(node)) {
      operators.push('switch');
    } else if (ts.isCaseClause(node)) {
      operators.push('case');
    } else if (ts.isDefaultClause(node)) {
      operators.push('default');
    } else if (ts.isTryStatement(node)) {
      operators.push('try');
      if (node.finallyBlock) operators.push('finally');
    } else if (ts.isCatchClause(node)) {
      operators.push('catch');
    } else if (ts.isReturnStatement(node)) {
      operators.push('return');
    } else if (ts.isThrowStatement(node)) {
      operators.push('throw');
    } else if (ts.isCallExpression(node)) {
      operators.push('()');
    } else if (ts.isPropertyAccessExpression(node)) {
      operators.push('.');
    } else if (ts.isElementAccessExpression(node)) {
      operators.push('[]');
    } else if (ts.isNewExpression(node)) {
      operators.push('new');
    } else if (ts.isDeleteExpression(node)) {
      operators.push('delete');
    } else if (ts.isTypeOfExpression(node)) {
      operators.push('typeof');
    } else if (ts.isAwaitExpression(node)) {
      operators.push('await');
    } else if (ts.isYieldExpression(node)) {
      operators.push('yield');
    } else if (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
      operators.push('function');
    } else if (ts.isArrowFunction(node)) {
      operators.push('=>');
    } else if (ts.isMethodDeclaration(node)) {
      operators.push('method');
    } else if (ts.isVariableDeclaration(node) && node.initializer) {
      operators.push('=');
    }

    // Operands
    if (ts.isIdentifier(node)) {
      operands.push(node.text);
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      operands.push(node.text);
    } else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      operands.push(node.text);
    } else if (ts.isNumericLiteral(node) || ts.isBigIntLiteral(node)) {
      operands.push(node.text);
    } else if (ts.isRegularExpressionLiteral(node)) {
      operands.push(node.text);
    } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
      operands.push('true');
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
      operands.push('false');
    } else if (node.kind === ts.SyntaxKind.NullKeyword) {
      operands.push('null');
    } else if (node.kind === ts.SyntaxKind.UndefinedKeyword) {
      operands.push('undefined');
    } else if (node.kind === ts.SyntaxKind.ThisKeyword) {
      operands.push('this');
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  const N = operators.length + operands.length;
  const n = new Set(operators).size + new Set(operands).size;
  const volume = N === 0 ? 0 : N * Math.log2(Math.max(2, n));

  return {
    totalTokens: N,
    uniqueVocabulary: n,
    volume,
    operators: operators.length,
    operands: operands.length,
  };
}

/**
 * Calculates Maintainability Index (0-100 scale):
 * MI = max(0, min(100, (171 - 5.2 * ln(max(1, HV)) - 0.23 * CC - 16.2 * ln(max(1, LOC))) * (100 / 171)))
 * Rounded to 1 decimal place.
 */
export function calculateMaintainabilityIndex(hv: number, cc: number, loc: number): number {
  const safeHv = Math.max(1, hv);
  const safeLoc = Math.max(1, loc);
  const safeCc = Math.max(1, cc);
  const rawMI = (171 - 5.2 * Math.log(safeHv) - 0.23 * safeCc - 16.2 * Math.log(safeLoc)) * (100 / 171);
  const clampedMI = Math.max(0, Math.min(100, rawMI));
  return Math.round(clampedMI * 10) / 10;
}

const SECRET_PATTERNS = [
  /AKIA[0-9A-Z]{16}/g,
  /ghp_[a-zA-Z0-9]{36}/g,
  /-----BEGIN (?:RSA )?PRIVATE KEY-----/g,
  /Bearer\s+[a-zA-Z0-9_\-\.]{25,}/g,
  /ey[A-Za-z0-9_-]{10,}\.ey[A-Za-z0-9_-]{10,}/g,
];

const SQL_KEYWORDS = /\b(SELECT\s|INSERT\s+INTO\s|UPDATE\s|DELETE\s+FROM\s)/i;

function hasSqlStringLiteral(node: ts.Node): boolean {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return SQL_KEYWORDS.test(node.text);
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return hasSqlStringLiteral(node.left) || hasSqlStringLiteral(node.right);
  }
  return false;
}

function hasDynamicOperand(node: ts.Node): boolean {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node)) {
    return false;
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return hasDynamicOperand(node.left) || hasDynamicOperand(node.right);
  }
  return true;
}

/**
 * Analyzes code for security smells:
 * - Hardcoded secrets (AWS keys, GitHub tokens, private keys, bearer tokens, JWTs)
 * - Dangerous AST calls (eval, new Function, dangerouslySetInnerHTML, child_process.exec)
 * - Insecure crypto (md5, sha1)
 * - Raw SQL concatenation (unparameterized template strings or binary + with SQL keywords)
 */
export function analyzeSecuritySmells(sourceFile: ts.SourceFile, content: string): SecurityFlags {
  let hardcodedSecrets = 0;
  for (const pattern of SECRET_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      hardcodedSecrets += matches.length;
    }
  }

  let unsafeCalls = 0;
  let insecureCrypto = 0;
  let rawSqlConcatenation = 0;

  function visit(node: ts.Node) {
    // Dangerous function calls
    if (ts.isCallExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === 'eval') {
        unsafeCalls++;
      } else if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'eval') {
        unsafeCalls++;
      } else if (ts.isIdentifier(node.expression) && node.expression.text === 'exec') {
        unsafeCalls++;
      } else if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'exec') {
        const callerText = node.expression.expression.getText(sourceFile).toLowerCase();
        if (callerText.includes('child') || callerText === 'cp' || callerText.includes('process')) {
          unsafeCalls++;
        }
      }

      // Insecure crypto: createHash('md5'), createHash('sha1')
      let funcName = '';
      if (ts.isPropertyAccessExpression(node.expression)) {
        funcName = node.expression.name.text;
      } else if (ts.isIdentifier(node.expression)) {
        funcName = node.expression.text;
      }

      if (funcName === 'createHash' || funcName === 'createHmac') {
        if (node.arguments.length > 0) {
          const firstArg = node.arguments[0];
          if (ts.isStringLiteral(firstArg) || ts.isNoSubstitutionTemplateLiteral(firstArg)) {
            const algo = firstArg.text.toLowerCase();
            if (algo === 'md5' || algo === 'sha1') {
              insecureCrypto++;
            }
          }
        }
      } else if (funcName === 'md5' || funcName === 'sha1') {
        insecureCrypto++;
      }
    }

    // new Function(...)
    if (ts.isNewExpression(node)) {
      if (ts.isIdentifier(node.expression) && node.expression.text === 'Function') {
        unsafeCalls++;
      }
    }

    // dangerouslySetInnerHTML
    if (ts.isJsxAttribute(node) && node.name.getText(sourceFile) === 'dangerouslySetInnerHTML') {
      unsafeCalls++;
    } else if (
      ts.isPropertyAssignment(node) &&
      (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) &&
      node.name.text === 'dangerouslySetInnerHTML'
    ) {
      unsafeCalls++;
    } else if (ts.isPropertyAccessExpression(node) && node.name.text === 'dangerouslySetInnerHTML') {
      unsafeCalls++;
    }

    // Raw SQL concatenation: untagged template literal
    if (ts.isTemplateExpression(node) && !ts.isTaggedTemplateExpression(node.parent)) {
      const templateText = node.head.text + node.templateSpans.map(s => s.literal.text).join('');
      if (SQL_KEYWORDS.test(templateText) && node.templateSpans.length > 0) {
        rawSqlConcatenation++;
      }
    }

    // Raw SQL concatenation: binary +
    if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const isRootPlus = !ts.isBinaryExpression(node.parent) || node.parent.operatorToken.kind !== ts.SyntaxKind.PlusToken;
      if (isRootPlus) {
        const hasSql = hasSqlStringLiteral(node.left) || hasSqlStringLiteral(node.right);
        const hasDynamic = hasDynamicOperand(node.left) || hasDynamicOperand(node.right);
        if (hasSql && hasDynamic) {
          rawSqlConcatenation++;
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    hardcodedSecrets,
    unsafeCalls,
    insecureCrypto,
    rawSqlConcatenation,
  };
}

/**
 * Computes ratio of try-catch blocks to async/await/Promise/.then() expressions.
 */
export function computeErrorHandling(sourceFile: ts.SourceFile): ErrorHandlingCounts {
  let tryCatchCount = 0;
  let asyncCount = 0;

  function visit(node: ts.Node) {
    if (ts.isTryStatement(node)) {
      tryCatchCount++;
    }

    if (ts.isAwaitExpression(node)) {
      asyncCount++;
    } else if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'then'
    ) {
      asyncCount++;
    } else if (ts.isIdentifier(node) && node.text === 'Promise') {
      asyncCount++;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    tryCatchCount,
    asyncCount,
    errorHandlingRatio: round2(tryCatchCount / Math.max(1, asyncCount)),
  };
}

export function isManifestPath(relPath: string): boolean {
  const normalized = relPath.replace(/\\/g, '/');
  if (/(^|\/)(?:node_modules|vendor)\//i.test(normalized)) return false;
  const base = path.posix.basename(normalized).toLowerCase();
  return MANIFEST_FILENAMES.has(base);
}

export function sanitizeManifestContent(content: string): string {
  if (Buffer.byteLength(content, 'utf8') > MAX_MANIFEST_BYTES) {
    return Buffer.from(content, 'utf8').subarray(0, MAX_MANIFEST_BYTES).toString('utf8');
  }
  return content;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Analyzes a single source file string and returns detailed static metrics.
 */
export function analyzeSource(content: string, relPath: string): FileMetrics {
  const isTest = isTestPath(relPath);
  const sourceFile = ts.createSourceFile(relPath, content, ts.ScriptTarget.Latest, true);
  const commentLines = countCommentLines(sourceFile);
  const loc = countLoc(content);
  const { typed, total } = countTypeSlots(sourceFile);
  const functionLengths = isTest ? [] : collectFunctionLengths(sourceFile);

  const functionCCs = collectFunctionCCs(sourceFile);
  const avgCC = functionCCs.length > 0
    ? round2(functionCCs.reduce((sum, c) => sum + c, 0) / functionCCs.length)
    : 1;
  const highCCCount = functionCCs.filter(c => c > 10).length;
  const highComplexityRatio = functionCCs.length > 0
    ? round2(highCCCount / functionCCs.length)
    : 0;

  const halstead = computeHalstead(sourceFile);
  const nonBlankLoc = content.split('\n').filter(l => l.trim().length > 0).length;
  const maintainabilityIndex = calculateMaintainabilityIndex(
    halstead.volume,
    avgCC,
    Math.max(1, nonBlankLoc),
  );

  const securityFlags = analyzeSecuritySmells(sourceFile, content);
  const errorHandling = computeErrorHandling(sourceFile);

  return {
    loc,
    commentLines,
    todoMarkers: countTodoMarkers(content),
    isTest,
    typedSlots: typed,
    totalSlots: total,
    functionLengths,
    functionCCs,
    cyclomaticComplexity: avgCC,
    highComplexityRatio,
    maintainabilityIndex,
    halstead,
    securityFlags,
    tryCatchCount: errorHandling.tryCatchCount,
    asyncCount: errorHandling.asyncCount,
    errorHandlingRatio: errorHandling.errorHandlingRatio,
  };
}

/**
 * Download and analyze one repository archive. Returns undefined when the
 * download or extraction fails — the profile pipeline treats that as
 * "no deep evidence" rather than a failure.
 */
export async function deepScanRepo(
  owner: string,
  repoName: string,
  ref: string,
): Promise<DeepMetrics | undefined> {
  try {
    const zipUrl = `https://codeload.github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/zip/${encodeURIComponent(ref)}`;
    const response = await fetch(zipUrl, {
      headers: { 'User-Agent': 'Traceon-Analyzer' },
      signal: AbortSignal.timeout(60_000),
    });
    if (!response.ok) return undefined;
    const buffer = Buffer.from(await response.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    let sourceLoc = 0;
    let testLoc = 0;
    let commentLines = 0;
    let todoMarkers = 0;
    let typedSlots = 0;
    let totalSlots = 0;
    const functionLengths: number[] = [];
    const allFunctionCCs: number[] = [];
    const sourceMIs: number[] = [];
    let totalTryCatch = 0;
    let totalAsync = 0;
    const totalSecurityFlags: SecurityFlags = {
      hardcodedSecrets: 0,
      unsafeCalls: 0,
      insecureCrypto: 0,
      rawSqlConcatenation: 0,
    };
    const manifestFiles: ManifestFileEntry[] = [];
    let parsedFiles = 0;

    for (const entry of entries) {
      if (entry.isDirectory) continue;
      const entryPath = entry.entryName.replace(/\\/g, '/');
      const relative = entryPath.split('/').slice(1).join('/'); // strip {repo}-{branch}/ root
      if (!relative) continue;

      // Manifest capture
      if (isManifestPath(relative)) {
        try {
          const rawText = entry.getData().toString('utf8');
          manifestFiles.push({
            filename: relative,
            content: sanitizeManifestContent(rawText),
          });
        } catch {
          // ignore unreadable manifest entries
        }
      }

      const ext = path.extname(relative).toLowerCase();
      if (!SOURCE_EXT.has(ext)) continue;
      if (parsedFiles >= MAX_SOURCE_FILES) continue;
      if (
        /node_modules\//.test(relative) ||
        /(^|\/)dist\//.test(relative) ||
        /(^|\/)build\//.test(relative) ||
        /(^|\/)\.next\//.test(relative) ||
        /coverage\//.test(relative) ||
        /\.(?:min|bundle|chunk)\.[^/]+$/i.test(relative)
      ) {
        continue;
      }
      if (entry.header.size > MAX_FILE_BYTES) continue;

      const content = entry.getData().toString('utf8');
      const metrics = analyzeSource(content, relative);
      parsedFiles++;

      if (metrics.isTest) {
        testLoc += metrics.loc;
      } else {
        sourceLoc += metrics.loc;
        allFunctionCCs.push(...metrics.functionCCs);
        sourceMIs.push(metrics.maintainabilityIndex);
        totalTryCatch += metrics.tryCatchCount;
        totalAsync += metrics.asyncCount;
        totalSecurityFlags.hardcodedSecrets += metrics.securityFlags.hardcodedSecrets;
        totalSecurityFlags.unsafeCalls += metrics.securityFlags.unsafeCalls;
        totalSecurityFlags.insecureCrypto += metrics.securityFlags.insecureCrypto;
        totalSecurityFlags.rawSqlConcatenation += metrics.securityFlags.rawSqlConcatenation;
      }

      commentLines += metrics.commentLines;
      todoMarkers += metrics.todoMarkers;
      typedSlots += metrics.typedSlots;
      totalSlots += metrics.totalSlots;
      functionLengths.push(...metrics.functionLengths);
    }

    if (parsedFiles === 0 || sourceLoc === 0) return undefined;

    const avgCC = allFunctionCCs.length > 0
      ? round2(allFunctionCCs.reduce((sum, c) => sum + c, 0) / allFunctionCCs.length)
      : 1;
    const highCCRatio = allFunctionCCs.length > 0
      ? round2(allFunctionCCs.filter(c => c > 10).length / allFunctionCCs.length)
      : 0;
    const avgMI = sourceMIs.length > 0
      ? round1(sourceMIs.reduce((sum, mi) => sum + mi, 0) / sourceMIs.length)
      : 100;

    return {
      repoName,
      deepAnalysis: true,
      testToCodeRatio: round2(testLoc / sourceLoc),
      typeCoverage: totalSlots > 0 ? round2(typedSlots / totalSlots) : 0,
      commentDensity: round2(commentLines / Math.max(1, sourceLoc)),
      meanFunctionLength: functionLengths.length
        ? round2(functionLengths.reduce((sum, len) => sum + len, 0) / functionLengths.length)
        : undefined,
      hasHighTodoDensity: todoMarkers / Math.max(1, sourceLoc) > 1 / 200,
      cyclomaticComplexity: avgCC,
      highComplexityRatio: highCCRatio,
      maintainabilityIndex: avgMI,
      securityFlags: totalSecurityFlags,
      errorHandlingRatio: round2(totalTryCatch / Math.max(1, totalAsync)),
      manifestFiles: manifestFiles.length > 0 ? manifestFiles : undefined,
    };
  } catch {
    return undefined;
  }
}