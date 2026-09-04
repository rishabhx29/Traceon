// scripts/test-dna-synthesizer.mts
import assert from 'node:assert/strict';
import { analyzeProfileQualitative } from '../src/lib/profile/analyzer.ts';
import type {
  EnrichedProfileData,
  CURISMScores,
  ACIDBreakdown,
  MasterScoreData,
  RepoQualitySignal,
} from '../src/lib/profile/types.ts';

console.log('Testing Evidence-Driven Engineering DNA Synthesizer...');

// ─── Helper Builders ───

function createSignal(overrides: Partial<RepoQualitySignal> = {}): RepoQualitySignal {
  return {
    repoName: 'primary-repo',
    qualityObserved: true,
    treeTruncated: false,
    hasTests: true,
    hasCI: true,
    hasDockerfile: true,
    hasContributing: true,
    hasLicense: true,
    hasChangelog: false,
    hasPrettierOrLint: true,
    hasGitignore: true,
    hasEnvExample: true,
    hasEnvCommitted: false,
    hasDependencyManifest: true,
    hasLockfile: true,
    hasSecurityPolicy: true,
    openIssueCount: 2,
    dependencyCount: 15,
    lastCommitDate: '2026-03-01',
    isArchived: false,
    readmeWordCount: 450,
    readmeHasInstallInstructions: true,
    readmeHasUsageExamples: true,
    readmeHasScreenshots: true,
    hasApiDocs: true,
    hasWiki: false,
    totalLOC: 4500,
    fileCount: 45,
    directoryDepth: 4,
    hasModularStructure: true,
    languages: { TypeScript: 4500 },
    ...overrides,
  };
}

function createScores(overrides: Partial<CURISMScores> = {}): CURISMScores {
  return {
    reliability: 9.0,
    security: 9.5,
    maintainability: 8.8,
    influence: 7.5,
    contribution: 8.2,
    uniqueness: 8.5,
    ...overrides,
  };
}

function createAcid(overrides: Partial<ACIDBreakdown> = {}): ACIDBreakdown {
  return {
    architecture: 8.8,
    crossDomain: 8.2,
    innovation: 8.0,
    documentation: 9.0,
    ...overrides,
  };
}

function createMaster(overrides: Partial<MasterScoreData> = {}): MasterScoreData {
  return {
    finalScore: 8.6,
    grade: 'S',
    gradeTitle: 'Lead Architect',
    hardSkills: 9.1,
    softSkills: 7.85,
    builderSkills: 8.5,
    assessmentAvailable: true,
    ...overrides,
  };
}

function createProfileData(overrides: Partial<EnrichedProfileData> = {}): EnrichedProfileData {
  return {
    user: {
      login: 'lead-dev',
      avatar_url: 'https://github.com/lead-dev.png',
      name: 'Lead Developer',
      bio: 'Building high-scale distributed applications',
      public_repos: 12,
      followers: 45,
      following: 20,
      created_at: '2022-01-01T00:00:00Z',
    },
    filteredRepos: [
      {
        name: 'web-platform',
        owner: 'lead-dev',
        description: 'Fullstack web application platform',
        language: 'TypeScript',
        stargazers_count: 55,
        forks_count: 12,
        topics: ['nextjs', 'fastapi', 'docker', 'kubernetes'],
        created_at: '2024-01-01',
        updated_at: '2026-03-01',
        pushed_at: '2026-03-01',
        size: 500,
        fork: false,
        archived: false,
        html_url: 'https://github.com/lead-dev/web-platform',
        open_issues_count: 2,
        has_wiki: false,
        default_branch: 'main',
        recencyWeight: 1,
        complexityWeight: 1,
        qualityBoost: 1,
        combinedWeight: 1,
      },
    ],
    allRepos: [],
    languageBytes: { TypeScript: 85000, Python: 35000 },
    recentCommits: [
      { repoName: 'web-platform', message: 'feat(api): implement streaming responses', date: '2026-03-01' },
      { repoName: 'web-platform', message: 'fix(auth): correct token expiration check', date: '2026-02-28' },
      { repoName: 'web-platform', message: 'docs(readme): add installation walkthrough', date: '2026-02-25' },
      { repoName: 'web-platform', message: 'refactor(core): extract reusable validation middleware', date: '2026-02-20' },
    ],
    readmeSnippets: { 'web-platform': '# Web Platform\nSetup instructions and API documentation.' },
    commitFrequency: { last30Days: 45, last90Days: 120, last365Days: 450, activeDaysLastYear: 140 },
    pullRequestActivity: { totalPRsOpened: 18, totalPRsMerged: 15, externalPRsMerged: 4, prReviewsDone: 8 },
    issueActivity: { totalOpened: 6, externalIssues: 2 },
    repoQualitySignals: [createSignal()],
    accountAge: { years: 4, months: 2 },
    totalStarsReceived: 55,
    totalForksReceived: 12,
    orgsCount: 2,
    detectedManifests: [
      {
        filename: 'package.json',
        content: JSON.stringify({
          dependencies: {
            next: '^14.1.0',
            react: '^18.2.0',
            '@prisma/client': '^5.10.0',
            tailwindcss: '^3.4.0',
          },
          devDependencies: {
            jest: '^29.7.0',
            typescript: '^5.3.0',
          },
        }),
      },
      {
        filename: 'requirements.txt',
        content: 'fastapi>=0.100.0\nuvicorn>=0.23.0\npydantic>=2.5.0',
      },
    ],
    ...overrides,
  };
}

// ─── Test 1: Full Profile with Deep Scan, Manifests, and Tests ───
{
  console.log('\n--- Test 1: Full Profile with Deep Scan & Manifests ---');
  const signal = createSignal({
    deepAnalysis: true,
    cyclomaticComplexity: 4.2, // low CC <= 6
    highComplexityRatio: 0.05,
    maintainabilityIndex: 82, // high MI > 75
    testToCodeRatio: 0.35, // >= 0.2
    typeCoverage: 0.88, // > 0.6
    commentDensity: 0.14,
    meanFunctionLength: 18,
    hasHighTodoDensity: false,
    securityFlags: {
      hardcodedSecrets: 0,
      unsafeCalls: 0,
      insecureCrypto: 0,
      rawSqlConcatenation: 0,
    },
  });

  const fullProfile = createProfileData({
    repoQualitySignals: [signal],
  });

  const scores = createScores();
  const acid = createAcid();
  const master = createMaster();

  const result = analyzeProfileQualitative(fullProfile, scores, acid, master);

  // 1. Archetype Assertion
  console.log('Archetype:', result.archetype);
  assert.equal(
    result.archetype,
    'Fullstack Systems Architect × Open Source Contributor',
    'Expected Fullstack Systems Architect × Open Source Contributor for profile with frontend + backend and merged PRs >= 5'
  );

  // 2. All CURISM descriptions present and well-formed
  const dims = ['reliability', 'security', 'maintainability', 'influence', 'contribution', 'uniqueness'] as const;
  for (const dim of dims) {
    const desc = result.curismDescriptions[dim];
    assert(typeof desc === 'string' && desc.length > 50, `Expected non-empty description for ${dim}`);
    // Check that descriptions contain multiple sentences (2-3 sentences)
    const sentences = desc.split(/\.\s+/).filter(s => s.trim().length > 0);
    assert(sentences.length >= 2, `Expected at least 2 sentences in curismDescriptions.${dim}, got ${sentences.length}`);
  }

  // 3. Underlying evidence reflected in descriptions
  assert(result.curismDescriptions.reliability.includes('1/1 fully observed repositories'));
  assert(result.curismDescriptions.reliability.includes('test-to-source ratio of 35%'));
  assert(result.curismDescriptions.reliability.includes('cyclomatic complexity of 4.2'));
  assert(result.curismDescriptions.security.includes('Zero committed environment secret leaks'));
  assert(result.curismDescriptions.security.includes('zero high-risk security smells'));
  assert(result.curismDescriptions.maintainability.includes('Maintainability Index of 82/100'));
  assert(result.curismDescriptions.influence.includes('55 stars'));
  assert(result.curismDescriptions.contribution.includes('15 merged pull requests'));
  assert(result.curismDescriptions.contribution.includes('8 peer pull request reviews'));
  assert(result.curismDescriptions.uniqueness.includes(`Architecture ${acid.architecture}/10`));

  // 4. Engineering DNA Triad
  console.log('Engineering DNA Triad:', result.engineeringDNA);
  assert(typeof result.engineeringDNA.problemSolving === 'string' && result.engineeringDNA.problemSolving.length > 40);
  assert(typeof result.engineeringDNA.architectureMaturity === 'string' && result.engineeringDNA.architectureMaturity.length > 40);
  assert(typeof result.engineeringDNA.documentation === 'string' && result.engineeringDNA.documentation.length > 40);

  // problemSolving cites average CC
  assert(result.engineeringDNA.problemSolving.includes('average cyclomatic complexity of 4.2'));
  // architectureMaturity evaluates modular structure & Maintainability Index
  assert(result.engineeringDNA.architectureMaturity.includes('1/1 repositories feature modular separation of concerns'));
  assert(result.engineeringDNA.architectureMaturity.includes('Maintainability Index of 82/100'));
  // documentation evaluates README and commits
  assert(result.engineeringDNA.documentation.includes('1/1 repositories'));
  assert(result.engineeringDNA.documentation.includes('installation') && result.engineeringDNA.documentation.includes('usage'));

  // 5. Actionable Traits (Strengths & Weaknesses)
  console.log('Traits Strengths:', result.traits.strengths);
  console.log('Traits Weaknesses:', result.traits.weaknesses);
  assert(result.traits.strengths.length >= 4 && result.traits.strengths.length <= 6, `Strengths count should be 4-6, got ${result.traits.strengths.length}`);
  assert(result.traits.weaknesses.length >= 4 && result.traits.weaknesses.length <= 6, `Weaknesses count should be 4-6, got ${result.traits.weaknesses.length}`);
  assert.equal(new Set(result.traits.strengths).size, result.traits.strengths.length, 'Strengths must not contain duplicates');
  assert.equal(new Set(result.traits.weaknesses).size, result.traits.weaknesses.length, 'Weaknesses must not contain duplicates');

  // Fact-based strengths present
  assert(result.traits.strengths.some(s => s.includes('test-to-source code ratio')));
  assert(result.traits.strengths.some(s => s.includes('Strong type coverage')));
  assert(result.traits.strengths.some(s => s.includes('Maintainability Index')));
  assert(result.traits.strengths.some(s => s.includes('cyclomatic complexity')));
  assert(result.traits.strengths.some(s => s.includes('Zero detected security smells')));
  assert(result.traits.strengths.some(s => s.includes('Active CI/CD automation')));

  // 6. Skills by Domain populated from manifests and topics
  console.log('Skills by Domain:', result.skillsByDomain);
  assert(Array.isArray(result.skillsByDomain));
  assert(result.skillsByDomain.length > 0);

  const getSkills = (domain: string) => result.skillsByDomain.find(d => d.domain === domain)?.skills ?? [];

  assert(getSkills('Frontend & UI').includes('Next.js'));
  assert(getSkills('Frontend & UI').includes('React'));
  assert(getSkills('Frontend & UI').includes('Tailwind CSS'));
  assert(getSkills('Backend & APIs').includes('FastAPI'));
  assert(getSkills('Databases & Storage').includes('Prisma'));
  assert(getSkills('Testing & Quality').includes('Jest'));
  assert(getSkills('DevOps & Cloud').includes('Docker'));
  assert(getSkills('DevOps & Cloud').includes('Kubernetes'));
  assert(getSkills('Languages').includes('TypeScript'));
  assert(getSkills('Languages').includes('Python'));

  console.log('✅ Full profile assertions passed successfully!');
}

// ─── Test 2: Minimal / Empty Profile (Graceful Degradation when total === 0) ───
{
  console.log('\n--- Test 2: Minimal / Empty Profile (total === 0) ---');
  const emptyProfile: EnrichedProfileData = {
    user: {
      login: 'new-user',
      avatar_url: 'https://github.com/new-user.png',
      name: null,
      bio: null,
      public_repos: 0,
      followers: 0,
      following: 0,
      created_at: '2026-01-01T00:00:00Z',
    },
    filteredRepos: [],
    allRepos: [],
    languageBytes: {},
    recentCommits: [],
    readmeSnippets: {},
    commitFrequency: { last30Days: 0, last90Days: 0, last365Days: 0, activeDaysLastYear: 0 },
    pullRequestActivity: { totalPRsOpened: 0, totalPRsMerged: 0, externalPRsMerged: 0, prReviewsDone: 0 },
    issueActivity: { totalOpened: 0, externalIssues: 0 },
    repoQualitySignals: [],
    accountAge: { years: 0, months: 2 },
    totalStarsReceived: 0,
    totalForksReceived: 0,
    orgsCount: 0,
    detectedManifests: [],
  };

  const scores = createScores({
    reliability: 0,
    security: 3,
    maintainability: 1,
    influence: 0,
    contribution: 0,
    uniqueness: 2,
  });
  const acid = createAcid({ architecture: 0, crossDomain: 0, innovation: 0, documentation: 0 });
  const master = createMaster({ finalScore: 1.0, grade: 'C', gradeTitle: 'Junior Developer' });

  const result = analyzeProfileQualitative(emptyProfile, scores, acid, master);

  console.log('Minimal Profile Archetype:', result.archetype);
  assert.equal(result.archetype, 'Software Engineer × Independent Builder');

  // Assert all fields are present, non-empty, and well-formed
  const dims = ['reliability', 'security', 'maintainability', 'influence', 'contribution', 'uniqueness'] as const;
  for (const dim of dims) {
    const desc = result.curismDescriptions[dim];
    assert(typeof desc === 'string' && desc.length > 20, `Expected non-empty string for curismDescriptions.${dim}`);
  }

  assert(typeof result.engineeringDNA.problemSolving === 'string' && result.engineeringDNA.problemSolving.length > 20);
  assert(typeof result.engineeringDNA.architectureMaturity === 'string' && result.engineeringDNA.architectureMaturity.length > 20);
  assert(typeof result.engineeringDNA.documentation === 'string' && result.engineeringDNA.documentation.length > 20);

  // Traits must have 4-6 valid items even on empty profile
  assert(result.traits.strengths.length >= 4 && result.traits.strengths.length <= 6, `Expected 4-6 strengths on empty profile, got ${result.traits.strengths.length}`);
  assert(result.traits.weaknesses.length >= 4 && result.traits.weaknesses.length <= 6, `Expected 4-6 weaknesses on empty profile, got ${result.traits.weaknesses.length}`);
  assert.equal(new Set(result.traits.strengths).size, result.traits.strengths.length, 'Empty profile strengths must not contain duplicates');
  assert.equal(new Set(result.traits.weaknesses).size, result.traits.weaknesses.length, 'Empty profile weaknesses must not contain duplicates');

  for (const s of result.traits.strengths) {
    assert(typeof s === 'string' && s.length > 10);
  }
  for (const w of result.traits.weaknesses) {
    assert(typeof w === 'string' && w.length > 10);
  }

  assert(Array.isArray(result.skillsByDomain));
  console.log('✅ Minimal profile graceful degradation passed successfully!');
}

// ─── Test 3: Archetype Variations ───
{
  console.log('\n--- Test 3: Archetype Variations ---');

  // 3a. Machine Learning & AI Engineer × Specialized Systems Hacker
  {
    const mlProfile = createProfileData({
      languageBytes: { Python: 90000 },
      filteredRepos: [
        {
          name: 'ml-research',
          owner: 'researcher',
          description: 'Deep neural models',
          language: 'Python',
          stargazers_count: 8,
          forks_count: 1,
          topics: ['machine-learning', 'deep-learning'],
          created_at: '2024-01-01',
          updated_at: '2026-01-01',
          pushed_at: '2026-01-01',
          size: 200,
          fork: false,
          archived: false,
          html_url: '',
          open_issues_count: 0,
          has_wiki: false,
          default_branch: 'main',
          recencyWeight: 1,
          complexityWeight: 1,
          qualityBoost: 1,
          combinedWeight: 1,
        },
      ],
      detectedManifests: [
        {
          filename: 'requirements.txt',
          content: 'torch>=2.0.0\nscikit-learn>=1.3.0\npandas>=2.0.0',
        },
      ],
      pullRequestActivity: { totalPRsOpened: 3, totalPRsMerged: 2, externalPRsMerged: 0, prReviewsDone: 1 },
    });

    const result = analyzeProfileQualitative(
      mlProfile,
      createScores({ uniqueness: 8.0 }),
      createAcid({ innovation: 8.5 }),
      createMaster()
    );

    console.log('ML Archetype:', result.archetype);
    assert.equal(result.archetype, 'Machine Learning & AI Engineer × Specialized Systems Hacker');
  }

  // 3b. Systems & Infrastructure Engineer × Specialized Systems Hacker
  {
    const sysProfile = createProfileData({
      languageBytes: { Rust: 120000 },
      filteredRepos: [
        {
          name: 'kernel-tools',
          owner: 'rustacean',
          description: 'Async systems runtime',
          language: 'Rust',
          stargazers_count: 12,
          forks_count: 2,
          topics: ['systems', 'tokio'],
          created_at: '2024-01-01',
          updated_at: '2026-01-01',
          pushed_at: '2026-01-01',
          size: 300,
          fork: false,
          archived: false,
          html_url: '',
          open_issues_count: 0,
          has_wiki: false,
          default_branch: 'main',
          recencyWeight: 1,
          complexityWeight: 1,
          qualityBoost: 1,
          combinedWeight: 1,
        },
      ],
      detectedManifests: [
        {
          filename: 'Cargo.toml',
          content: '[dependencies]\ntokio = "1"\nserde = "1"\naxum = "0.7"',
        },
      ],
      pullRequestActivity: { totalPRsOpened: 2, totalPRsMerged: 1, externalPRsMerged: 0, prReviewsDone: 0 },
    });

    const result = analyzeProfileQualitative(
      sysProfile,
      createScores({ uniqueness: 7.8 }),
      createAcid({ innovation: 6.0 }),
      createMaster()
    );

    console.log('Systems Archetype:', result.archetype);
    assert.equal(result.archetype, 'Systems & Infrastructure Engineer × Specialized Systems Hacker');
  }

  // 3c. Backend Systems Engineer × Independent Builder
  {
    const backendProfile = createProfileData({
      languageBytes: { Python: 60000 },
      filteredRepos: [
        {
          name: 'backend-service',
          owner: 'backend-dev',
          description: 'REST API service',
          language: 'Python',
          stargazers_count: 10,
          forks_count: 2,
          topics: ['api', 'database', 'postgresql'],
          created_at: '2024-01-01',
          updated_at: '2026-01-01',
          pushed_at: '2026-01-01',
          size: 200,
          fork: false,
          archived: false,
          html_url: '',
          open_issues_count: 0,
          has_wiki: false,
          default_branch: 'main',
          recencyWeight: 1,
          complexityWeight: 1,
          qualityBoost: 1,
          combinedWeight: 1,
        },
      ],
      detectedManifests: [
        {
          filename: 'requirements.txt',
          content: 'fastapi>=0.100.0\nsqlalchemy>=2.0.0\npsycopg2-binary>=2.9.0',
        },
      ],
      pullRequestActivity: { totalPRsOpened: 2, totalPRsMerged: 1, externalPRsMerged: 0, prReviewsDone: 0 },
    });

    const result = analyzeProfileQualitative(
      backendProfile,
      createScores({ uniqueness: 5.0 }),
      createAcid({ innovation: 5.0 }),
      createMaster()
    );

    console.log('Backend Archetype:', result.archetype);
    assert.equal(result.archetype, 'Backend Systems Engineer × Independent Builder');
  }

  // 3d. Frontend Experience Engineer × Core Product Builder
  {
    const frontendProfile = createProfileData({
      languageBytes: { TypeScript: 60000 },
      filteredRepos: Array.from({ length: 9 }, (_, i) => ({
        name: `frontend-app-${i}`,
        owner: 'ui-dev',
        description: 'React client app',
        language: 'TypeScript',
        stargazers_count: 5,
        forks_count: 1,
        topics: ['react', 'tailwindcss'],
        created_at: '2024-01-01',
        updated_at: '2026-01-01',
        pushed_at: '2026-01-01',
        size: 100,
        fork: false,
        archived: false,
        html_url: '',
        open_issues_count: 0,
        has_wiki: false,
        default_branch: 'main',
        recencyWeight: 1,
        complexityWeight: 1,
        qualityBoost: 1,
        combinedWeight: 1,
      })),
      detectedManifests: [
        {
          filename: 'package.json',
          content: JSON.stringify({
            dependencies: {
              react: '^18.2.0',
              tailwindcss: '^3.4.0',
              'framer-motion': '^11.0.0',
            },
          }),
        },
      ],
      pullRequestActivity: { totalPRsOpened: 2, totalPRsMerged: 1, externalPRsMerged: 0, prReviewsDone: 0 },
    });

    const result = analyzeProfileQualitative(
      frontendProfile,
      createScores({ uniqueness: 5.0 }),
      createAcid({ innovation: 4.0 }),
      createMaster()
    );

    console.log('Frontend Archetype:', result.archetype);
    assert.equal(result.archetype, 'Frontend Experience Engineer × Core Product Builder');
  }

  // 3e. Cloud Platform Engineer × Independent Builder
  {
    const devopsProfile = createProfileData({
      languageBytes: { HCL: 30000 },
      detectedManifests: [
        {
          filename: 'package.json',
          content: JSON.stringify({
            dependencies: {
              '@aws-sdk/client-s3': '^3.500.0',
              'dockerode': '^4.0.0',
            },
          }),
        },
      ],
      filteredRepos: [
        {
          name: 'infra-modules',
          owner: 'cloud-dev',
          description: 'Terraform and Kubernetes infrastructure',
          language: 'HCL',
          stargazers_count: 20,
          forks_count: 5,
          topics: ['docker', 'kubernetes', 'terraform'],
          created_at: '2024-01-01',
          updated_at: '2026-01-01',
          pushed_at: '2026-01-01',
          size: 150,
          fork: false,
          archived: false,
          html_url: '',
          open_issues_count: 0,
          has_wiki: false,
          default_branch: 'main',
          recencyWeight: 1,
          complexityWeight: 1,
          qualityBoost: 1,
          combinedWeight: 1,
        },
      ],
      pullRequestActivity: { totalPRsOpened: 0, totalPRsMerged: 0, externalPRsMerged: 0, prReviewsDone: 0 },
    });

    const result = analyzeProfileQualitative(
      devopsProfile,
      createScores({ uniqueness: 5.0 }),
      createAcid({ innovation: 5.0 }),
      createMaster()
    );

    console.log('DevOps Archetype:', result.archetype);
    assert.equal(result.archetype, 'Cloud Platform Engineer × Independent Builder');
  }

  console.log('✅ Archetype variations passed successfully!');
}

// ─── Test 4: Weakness Detection on Flawed / Vulnerable Repositories ───
{
  console.log('\n--- Test 4: Weakness Detection on Flawed Codebases ---');

  const flawedSignal = createSignal({
    hasTests: false, // missing tests
    hasCI: false, // missing CI
    hasSecurityPolicy: false,
    hasEnvCommitted: true, // committed .env
    readmeHasInstallInstructions: true,
    readmeHasUsageExamples: true,
    deepAnalysis: true,
    cyclomaticComplexity: 16.5, // high CC > 12
    maintainabilityIndex: 32, // low MI < 50
    hasHighTodoDensity: true, // high TODOs
    securityFlags: {
      hardcodedSecrets: 2,
      rawSqlConcatenation: 1,
      unsafeCalls: 1,
      insecureCrypto: 1,
    },
  });

  const flawedProfile = createProfileData({
    repoQualitySignals: [flawedSignal],
  });

  const result = analyzeProfileQualitative(
    flawedProfile,
    createScores({ reliability: 3.0, security: 2.0, maintainability: 3.5 }),
    createAcid(),
    createMaster()
  );

  console.log('Flawed Profile Weaknesses:', result.traits.weaknesses);
  assert(result.traits.weaknesses.length >= 4 && result.traits.weaknesses.length <= 6);
  assert.equal(new Set(result.traits.strengths).size, result.traits.strengths.length, 'Flawed profile strengths must not contain duplicates');
  assert.equal(new Set(result.traits.weaknesses).size, result.traits.weaknesses.length, 'Flawed profile weaknesses must not contain duplicates');

  // Assert specific diagnostic flags are surfaced
  assert(result.traits.weaknesses.some(w => w.includes('Missing automated tests')));
  assert(result.traits.weaknesses.some(w => w.includes('Missing CI/CD pipeline')));
  assert(result.traits.weaknesses.some(w => w.includes('Maintainability Index (<50/100)')));
  assert(result.traits.weaknesses.some(w => w.includes('cyclomatic complexity (>12 per function)')));
  assert(result.traits.weaknesses.some(w => w.includes('Security smells detected')));
  assert(result.traits.weaknesses.some(w => w.includes('TODO/FIXME/HACK')));

  // Reliability wording check for high CC (>12)
  console.log('High CC Reliability wording:', result.curismDescriptions.reliability);
  assert(
    result.curismDescriptions.reliability.includes('with opportunities to simplify control flow (average cyclomatic complexity: 16.5 per function)'),
    'High CC should reflect opportunities to simplify control flow, not disciplined branch control'
  );

  console.log('✅ Weakness detection passed successfully!');
}

// ─── Test 5: Defensive Optional Chaining on Sparse/Undefined Profile Fields ───
{
  console.log('\n--- Test 5: Defensive Optional Chaining on Sparse Fields ---');

  const sparseProfile: EnrichedProfileData = {
    user: undefined as any,
    filteredRepos: [],
    allRepos: [],
    languageBytes: {},
    recentCommits: [],
    readmeSnippets: {},
    commitFrequency: undefined as any,
    pullRequestActivity: undefined as any,
    issueActivity: undefined as any,
    repoQualitySignals: [],
    accountAge: undefined as any,
    totalStarsReceived: undefined as any,
    totalForksReceived: undefined as any,
    orgsCount: 0,
    detectedManifests: [],
  };

  // Should run without throwing TypeError: Cannot read properties of undefined
  const result = analyzeProfileQualitative(
    sparseProfile,
    createScores(),
    createAcid(),
    createMaster()
  );

  assert(typeof result.archetype === 'string');
  assert(typeof result.curismDescriptions.influence === 'string');
  assert(typeof result.curismDescriptions.contribution === 'string');
  assert(result.traits.strengths.length >= 4 && result.traits.strengths.length <= 6);
  assert(result.traits.weaknesses.length >= 4 && result.traits.weaknesses.length <= 6);
  assert.equal(new Set(result.traits.strengths).size, result.traits.strengths.length);
  assert.equal(new Set(result.traits.weaknesses).size, result.traits.weaknesses.length);

  console.log('✅ Defensive optional chaining passed successfully!');
}

console.log('\n🎉 ALL ENGINEERING DNA SYNTHESIZER TESTS PASSED!');
