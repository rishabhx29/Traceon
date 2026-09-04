import assert from 'node:assert/strict';
import AdmZip from 'adm-zip';
import {
  analyzeSource,
  calculateMaintainabilityIndex,
  computeFunctionCC,
  computeHalstead,
  isManifestPath,
  sanitizeManifestContent,
} from '../src/lib/profile/deepScan.ts';

console.log('Testing Deep Static AST Metrics & Security Smell Scanner...');

// ─── 1. Clean, Well-Structured Code ───
{
  const cleanSnippet = `
export function add(a: number, b: number): number {
  return a + b;
}
`;

  const metrics = analyzeSource(cleanSnippet, 'math.ts');
  console.log('Clean snippet metrics:', {
    cc: metrics.cyclomaticComplexity,
    highComplexityRatio: metrics.highComplexityRatio,
    mi: metrics.maintainabilityIndex,
    securityFlags: metrics.securityFlags,
  });

  // Requirements: low CC (< 3), high MI (> 70), zero security flags
  assert(metrics.cyclomaticComplexity < 3, `Expected CC < 3, got ${metrics.cyclomaticComplexity}`);
  assert.equal(metrics.highComplexityRatio, 0, 'Expected 0 high complexity functions');
  assert(metrics.maintainabilityIndex > 70, `Expected MI > 70, got ${metrics.maintainabilityIndex}`);
  assert.equal(metrics.securityFlags.hardcodedSecrets, 0);
  assert.equal(metrics.securityFlags.unsafeCalls, 0);
  assert.equal(metrics.securityFlags.insecureCrypto, 0);
  assert.equal(metrics.securityFlags.rawSqlConcatenation, 0);
  console.log('✅ Clean snippet assertions passed');
}

// ─── 2. High Complexity Code ───
{
  const complexSnippet = `
export function complexWorkflow(status: string, items: any[], discount: number, isVip: boolean) {
  let total = 0;
  if (status === 'active' && items.length > 0 && discount >= 0) {
    for (const item of items) {
      if (item.price > 100 || isVip) {
        switch (item.category) {
          case 'electronics':
            total += item.price * 0.9;
            break;
          case 'books':
            total += item.price * 0.8;
            break;
          case 'clothing':
            total += item.price * 0.85;
            break;
        }
      } else if (item.price > 50 && discount > 0.1) {
        total += item.price * (1 - discount);
      } else {
        total += item.price;
      }
    }
  } else if (status === 'pending' || status === 'review') {
    while (total < 10) {
      total++;
      if (total === 5) break;
    }
  }
  return total;
}
`;

  const metrics = analyzeSource(complexSnippet, 'workflow.ts');
  console.log('Complex snippet metrics:', {
    cc: metrics.cyclomaticComplexity,
    highComplexityRatio: metrics.highComplexityRatio,
    mi: metrics.maintainabilityIndex,
    functionCCs: metrics.functionCCs,
  });

  // Requirements: functions with multiple nested if, for, switch, &&, || verifying CC > 10
  assert(metrics.cyclomaticComplexity > 10, `Expected CC > 10, got ${metrics.cyclomaticComplexity}`);
  assert.equal(metrics.highComplexityRatio, 1, 'Expected high complexity ratio to be 1.0');
  assert(metrics.functionCCs.some(cc => cc > 10), 'Expected at least one function with CC > 10');
  console.log('✅ High complexity assertions passed');
}

// ─── 3. Insecure Code Snippet ───
{
  const insecureSnippet = `
import crypto from 'crypto';
import cp from 'child_process';

export function runInsecure(userId: string, userInput: string) {
  // Hardcoded secrets: AWS key, GitHub token, private key, bearer token, JWT
  const awsKey = "AKIAIOSFODNN7EXAMPLE";
  const ghToken = "ghp_1234567890abcdefghijklmnopqrstuvwxyz12";
  const privKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0";
  const bearerToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abcdefghijklmnopqrstuvwxyz123456";
  const jwt = "eyhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // Dangerous AST calls: eval, new Function, dangerouslySetInnerHTML, cp.exec
  eval("alert('unsafe!')");
  const dynamicFn = new Function("x", "return x * 2");
  const vdom = { dangerouslySetInnerHTML: { __html: userInput } };
  cp.exec("rm -rf " + userInput);

  // Insecure crypto: md5 and sha1
  const h1 = crypto.createHash('md5').update(userId).digest('hex');
  const h2 = crypto.createHash('sha1').update(userId).digest('hex');

  // Raw SQL concatenation: template literal and binary +
  const sqlQuery1 = \`SELECT * FROM users WHERE id = \${userId}\`;
  const sqlQuery2 = "INSERT INTO audit_log (user) VALUES ('" + userId + "')";

  return { awsKey, ghToken, privKey, bearerToken, jwt, dynamicFn, vdom, h1, h2, sqlQuery1, sqlQuery2 };
}
`;

  const metrics = analyzeSource(insecureSnippet, 'vulnerable.ts');
  console.log('Insecure snippet security flags:', metrics.securityFlags);

  // Requirements: verifying securityFlags are populated
  assert(metrics.securityFlags.hardcodedSecrets >= 5, `Expected >= 5 secrets, got ${metrics.securityFlags.hardcodedSecrets}`);
  assert(metrics.securityFlags.unsafeCalls >= 4, `Expected >= 4 unsafe calls, got ${metrics.securityFlags.unsafeCalls}`);
  assert(metrics.securityFlags.insecureCrypto >= 2, `Expected >= 2 insecure crypto, got ${metrics.securityFlags.insecureCrypto}`);
  assert(metrics.securityFlags.rawSqlConcatenation >= 2, `Expected >= 2 raw SQL concatenations, got ${metrics.securityFlags.rawSqlConcatenation}`);
  console.log('✅ Security smell assertions passed');
}

// ─── 4. Error Handling Ratio Analysis ───
{
  const errorHandlingSnippet = `
export async function processPayment(orderId: string) {
  try {
    const order = await fetchOrder(orderId);
    const auth = await authorizePayment(order);
    return await capturePayment(auth);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
`;

  const metrics = analyzeSource(errorHandlingSnippet, 'service.ts');
  console.log('Error handling metrics:', {
    tryCatch: metrics.tryCatchCount,
    asyncCount: metrics.asyncCount,
    ratio: metrics.errorHandlingRatio,
  });

  assert.equal(metrics.tryCatchCount, 1);
  assert(metrics.asyncCount >= 3, `Expected >= 3 async expressions, got ${metrics.asyncCount}`);
  assert.equal(metrics.errorHandlingRatio, Math.round((1 / metrics.asyncCount) * 100) / 100);
  console.log('✅ Error handling ratio assertions passed');
}

// ─── 5. Manifest File Extraction ───
{
  const zip = new AdmZip();
  // Valid manifests
  zip.addFile('project-main/package.json', Buffer.from('{"name": "test-pkg", "version": "1.0.0"}'));
  zip.addFile('project-main/requirements.txt', Buffer.from('flask>=2.0\nrequests==2.31.0'));
  zip.addFile('project-main/backend/go.mod', Buffer.from('module github.com/test/backend\n\ngo 1.22\n'));
  zip.addFile('project-main/core/Cargo.toml', Buffer.from('[package]\nname = "core"\nversion = "0.1.0"\n'));

  // Should be ignored
  zip.addFile('project-main/node_modules/dep/package.json', Buffer.from('{"name": "ignored"}'));
  zip.addFile('project-main/vendor/lib/go.mod', Buffer.from('module ignored'));
  zip.addFile('project-main/README.md', Buffer.from('# Documentation'));

  // Large manifest: 70KB -> should truncate at 64KB
  const largeContent = 'A'.repeat(70 * 1024);
  zip.addFile('project-main/sub/package.json', Buffer.from(largeContent));

  const manifestFiles: Array<{ filename: string; content: string }> = [];
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue;
    const entryPath = entry.entryName.replace(/\\/g, '/');
    const relative = entryPath.split('/').slice(1).join('/');
    if (!relative) continue;

    if (isManifestPath(relative)) {
      manifestFiles.push({
        filename: relative,
        content: sanitizeManifestContent(entry.getData().toString('utf8')),
      });
    }
  }

  console.log('Extracted manifest files:', manifestFiles.map(m => m.filename));

  const filenames = manifestFiles.map(m => m.filename);
  assert(filenames.includes('package.json'));
  assert(filenames.includes('requirements.txt'));
  assert(filenames.includes('backend/go.mod'));
  assert(filenames.includes('core/Cargo.toml'));
  assert(filenames.includes('sub/package.json'));
  assert(!filenames.some(f => f.includes('node_modules')));
  assert(!filenames.some(f => f.includes('vendor')));
  assert(!filenames.includes('README.md'));

  const largeEntry = manifestFiles.find(m => m.filename === 'sub/package.json');
  assert(largeEntry, 'Expected large manifest to be captured');
  assert.equal(Buffer.byteLength(largeEntry.content, 'utf8'), 64 * 1024, 'Expected manifest content to be truncated at 64KB');
  console.log('✅ Manifest extraction assertions passed');
}

// ─── 6. Halstead & Maintainability Index Numerical Bounds ───
{
  const mi1 = calculateMaintainabilityIndex(10, 1, 3);
  const mi2 = calculateMaintainabilityIndex(10000, 20, 500);
  assert(mi1 >= 0 && mi1 <= 100, `Expected MI in [0, 100], got ${mi1}`);
  assert(mi2 >= 0 && mi2 <= 100, `Expected MI in [0, 100], got ${mi2}`);
  assert(mi1 > mi2, `Expected cleaner code to have higher MI (${mi1} vs ${mi2})`);
  console.log('✅ Halstead & MI boundary assertions passed');
}

console.log('\n🎉 ALL DEEP SCAN AST METRICS & SECURITY TESTS PASSED!');
