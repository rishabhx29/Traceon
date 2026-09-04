// scripts/test-manifest-classifier.mts
import assert from 'node:assert/strict';
import {
  parsePackageJson,
  parseRequirementsTxt,
  parseGoMod,
  parseCargoToml,
  extractDependenciesFromManifest,
  classifySkillsFromManifests,
  PACKAGE_TAXONOMY,
  lookupSkill,
} from '../src/lib/profile/manifestClassifier.ts';

console.log('Testing Manifest Classifier...');

// ─── 1. parsePackageJson ───
{
  const validPkg = JSON.stringify({
    name: 'test-app',
    version: '1.0.0',
    dependencies: {
      react: '^18.2.0',
      next: '14.1.0',
      '@radix-ui/react-dialog': '^1.0.5',
    },
    devDependencies: {
      typescript: '^5.3.3',
      jest: '^29.7.0',
      tailwindcss: '^3.4.1',
    },
  });

  const deps = parsePackageJson(validPkg);
  assert(deps.includes('react'));
  assert(deps.includes('next'));
  assert(deps.includes('@radix-ui/react-dialog'));
  assert(deps.includes('typescript'));
  assert(deps.includes('jest'));
  assert(deps.includes('tailwindcss'));
  assert.equal(deps.length, 6);

  // Malformed / partial safety checks
  assert.deepEqual(parsePackageJson(''), []);
  assert.deepEqual(parsePackageJson('invalid json {['), []);
  assert.deepEqual(parsePackageJson('null'), []);
  assert.deepEqual(parsePackageJson('[]'), []);
  assert.deepEqual(parsePackageJson('{"dependencies": "not-an-object"}'), []);
  assert.deepEqual(parsePackageJson('{"devDependencies": null}'), []);
  assert.deepEqual(parsePackageJson('{"name": "only-name"}'), []);
}

// ─── 2. parseRequirementsTxt ───
{
  const reqs = `
# Core web dependencies
fastapi>=0.100.0,<=0.110.0
uvicorn[standard]~=0.23.0
pydantic==2.5.0
requests >= 2.28.0 # HTTP client
torch==2.1.0+cu118
pandas
scikit-learn!=1.2.0

# Flags and options to ignore
-r base.txt
--requirement other.txt
-i https://pypi.org/simple
--extra-index-url https://download.pytorch.org/whl/cu118
-f /path/to/wheels

# Complex extras & environment markers
celery[redis,auth] >= 5.2.0; python_version >= '3.8'
pywin32 >= 1.0; sys_platform == 'win32'
git+https://github.com/psf/black.git#egg=black
pkg-with-url @ https://github.com/org/pkg/archive/main.zip
`;

  const deps = parseRequirementsTxt(reqs);
  assert(deps.includes('fastapi'));
  assert(deps.includes('uvicorn'));
  assert(deps.includes('pydantic'));
  assert(deps.includes('requests'));
  assert(deps.includes('torch'));
  assert(deps.includes('pandas'));
  assert(deps.includes('scikit-learn'));
  assert(deps.includes('celery'));
  assert(deps.includes('pywin32'));
  assert(deps.includes('black'));
  assert(deps.includes('pkg-with-url'));

  // Ensure options and comments are stripped
  assert(!deps.some(d => d.startsWith('-')));
  assert(!deps.some(d => d.includes('#')));
  assert(!deps.some(d => d.includes('>')));
  assert(!deps.some(d => d.includes('=')));

  // Malformed safety checks
  assert.deepEqual(parseRequirementsTxt(''), []);
  assert.deepEqual(parseRequirementsTxt('# only comments\n# second comment'), []);
  assert.deepEqual(parseRequirementsTxt('   \n\n\t  '), []);
}

// ─── 3. parseGoMod ───
{
  const goMod = `
module github.com/test/my-go-app

go 1.22.0

require (
\tgithub.com/gin-gonic/gin v1.9.1
\tgithub.com/stretchr/testify v1.8.4 // indirect
\tgo.uber.org/zap v1.26.0
\tgithub.com/gofiber/fiber/v2 v2.52.0
\tgorm.io/gorm v1.25.7
)

require github.com/google/uuid v1.6.0
require "github.com/sirupsen/logrus" v1.9.3

replace github.com/old/pkg => github.com/new/pkg v1.0.0
`;

  const deps = parseGoMod(goMod);
  assert(deps.includes('gin'));
  assert(deps.includes('testify'));
  assert(deps.includes('zap'));
  assert(deps.includes('fiber'));
  assert(deps.includes('gorm'));
  assert(deps.includes('uuid'));
  assert(deps.includes('logrus'));

  // Malformed safety checks
  assert.deepEqual(parseGoMod(''), []);
  assert.deepEqual(parseGoMod('module foo\ngo 1.21'), []);
  assert.deepEqual(parseGoMod('require (\n'), []);
}

// ─── 4. parseCargoToml ───
{
  const cargoToml = `
[package]
name = "rust-service"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7.4"
tokio = { version = "1.37.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[dev-dependencies]
criterion = "0.5"

[build-dependencies]
cc = "1.0"

[target.'cfg(unix)'.dependencies]
nix = "0.27"

[features]
default = []
`;

  const deps = parseCargoToml(cargoToml);
  assert(deps.includes('axum'));
  assert(deps.includes('tokio'));
  assert(deps.includes('serde'));
  assert(deps.includes('serde_json'));
  assert(deps.includes('criterion'));
  assert(deps.includes('cc'));
  assert(deps.includes('nix'));

  // Ensure non-dependencies sections are not included
  assert(!deps.includes('rust-service'));
  assert(!deps.includes('default'));

  // Table-style dependencies
  const tableCargoToml = `
[dependencies.reqwest]
version = "0.11"
features = ["json"]

[dev-dependencies.pretty_assertions]
version = "1.4"
`;
  const tableDeps = parseCargoToml(tableCargoToml);
  assert(tableDeps.includes('reqwest'));
  assert(tableDeps.includes('pretty_assertions'));

  // Malformed safety checks
  assert.deepEqual(parseCargoToml(''), []);
  assert.deepEqual(parseCargoToml('[package]\nname = "foo"'), []);
  assert.deepEqual(parseCargoToml('invalid toml [[[]'), []);
}

// ─── 5. extractDependenciesFromManifest ───
{
  const pkgContent = '{"dependencies": {"react": "^18.0.0"}}';
  assert.deepEqual(extractDependenciesFromManifest('package.json', pkgContent), ['react']);
  assert.deepEqual(extractDependenciesFromManifest('frontend/package.json', pkgContent), ['react']);

  const reqContent = 'flask>=2.0.0\nrequests';
  assert.deepEqual(extractDependenciesFromManifest('requirements.txt', reqContent), ['flask', 'requests']);
  assert.deepEqual(extractDependenciesFromManifest('requirements/dev.txt', reqContent), ['flask', 'requests']);

  const goContent = 'require github.com/gin-gonic/gin v1.9.0';
  assert.deepEqual(extractDependenciesFromManifest('go.mod', goContent), ['gin']);

  const cargoContent = '[dependencies]\ntokio = "1"';
  assert.deepEqual(extractDependenciesFromManifest('Cargo.toml', cargoContent), ['tokio']);

  // Unsupported files
  assert.deepEqual(extractDependenciesFromManifest('README.md', '# Hello'), []);
  assert.deepEqual(extractDependenciesFromManifest('Makefile', 'all: build'), []);
}

// ─── 6. Taxonomy Dictionary Checks (150+ packages & canonical domains) ───
{
  const taxonomySize = Object.keys(PACKAGE_TAXONOMY).length;
  console.log(`Taxonomy dictionary contains ${taxonomySize} package entries.`);
  assert(taxonomySize >= 150, `Expected at least 150 taxonomy entries, got ${taxonomySize}`);

  const requiredDomains = [
    'Frontend & UI',
    'Backend & APIs',
    'Databases & Storage',
    'DevOps & Cloud',
    'Testing & Quality',
    'Security & Auth',
    'AI & Machine Learning',
    'Systems & Tooling',
  ];

  const domainsFound = new Set(Object.values(PACKAGE_TAXONOMY).map(t => t.domain));
  for (const domain of requiredDomains) {
    assert(domainsFound.has(domain), `Domain "${domain}" missing from taxonomy.`);
  }

  // Check sample lookups across all domains
  assert.equal(lookupSkill('react')?.domain, 'Frontend & UI');
  assert.equal(lookupSkill('@radix-ui/react-dialog')?.domain, 'Frontend & UI');
  assert.equal(lookupSkill('express')?.domain, 'Backend & APIs');
  assert.equal(lookupSkill('fastapi')?.domain, 'Backend & APIs');
  assert.equal(lookupSkill('gin')?.domain, 'Backend & APIs');
  assert.equal(lookupSkill('axum')?.domain, 'Backend & APIs');
  assert.equal(lookupSkill('pg')?.domain, 'Databases & Storage');
  assert.equal(lookupSkill('@prisma/client')?.domain, 'Databases & Storage');
  assert.equal(lookupSkill('docker')?.domain, 'DevOps & Cloud');
  assert.equal(lookupSkill('@aws-sdk/client-s3')?.domain, 'DevOps & Cloud');
  assert.equal(lookupSkill('jest')?.domain, 'Testing & Quality');
  assert.equal(lookupSkill('playwright')?.domain, 'Testing & Quality');
  assert.equal(lookupSkill('next-auth')?.domain, 'Security & Auth');
  assert.equal(lookupSkill('jsonwebtoken')?.domain, 'Security & Auth');
  assert.equal(lookupSkill('torch')?.domain, 'AI & Machine Learning');
  assert.equal(lookupSkill('openai')?.domain, 'AI & Machine Learning');
  assert.equal(lookupSkill('vite')?.domain, 'Systems & Tooling');
  assert.equal(lookupSkill('webpack')?.domain, 'Systems & Tooling');

  // Delimiter normalization (- vs _)
  assert.equal(lookupSkill('scikit_learn')?.canonicalName, 'Scikit-Learn');
  assert.equal(lookupSkill('serde-json')?.canonicalName, 'Serde JSON');
  assert.equal(lookupSkill('github.com/gin-gonic/gin')?.canonicalName, 'Gin');
}

// ─── 7. classifySkillsFromManifests ───
{
  const manifests = [
    {
      filename: 'package.json',
      content: JSON.stringify({
        dependencies: {
          next: '^14.1.0',
          react: '^18.2.0',
          tailwindcss: '^3.4.0',
          '@prisma/client': '^5.10.0',
          'next-auth': '^4.24.5',
        },
        devDependencies: {
          jest: '^29.7.0',
          typescript: '^5.3.0',
        },
      }),
    },
    {
      filename: 'requirements.txt',
      content: 'fastapi>=0.100.0\npandas>=2.0.0\ntorch>=2.1.0',
    },
    {
      filename: 'go.mod',
      content: 'require github.com/gin-gonic/gin v1.9.1',
    },
    {
      filename: 'Cargo.toml',
      content: '[dependencies]\ntokio = "1"\naxum = "0.7"',
    },
  ];

  const topics = ['docker', 'kubernetes', 'graphql'];
  const languages = { TypeScript: 50000, Python: 20000, Go: 10000, Rust: 5000 };

  const classified = classifySkillsFromManifests(manifests, topics, languages);

  // Must be an array of DomainSkill objects
  assert(Array.isArray(classified));
  assert(classified.length > 0);

  // Check structure
  for (const item of classified) {
    assert(typeof item.domain === 'string');
    assert(Array.isArray(item.skills));
    assert(item.skills.length > 0);
    // Skills inside domain must be sorted alphabetically
    const sortedSkills = [...item.skills].sort((a, b) => a.localeCompare(b));
    assert.deepEqual(item.skills, sortedSkills, `Skills in ${item.domain} not sorted alphabetically`);
    // No duplicates in skills
    assert.equal(new Set(item.skills).size, item.skills.length, `Duplicates found in ${item.domain}`);
  }

  // Domains must be sorted by skill count descending
  for (let i = 0; i < classified.length - 1; i++) {
    assert(
      classified[i].skills.length >= classified[i + 1].skills.length,
      `Domain order error: ${classified[i].domain} (${classified[i].skills.length}) before ${classified[i + 1].domain} (${classified[i + 1].skills.length})`
    );
  }

  // Check specific skills mapped into appropriate domains
  const getSkills = (domain: string) => classified.find(c => c.domain === domain)?.skills ?? [];

  const frontendSkills = getSkills('Frontend & UI');
  assert(frontendSkills.includes('Next.js'));
  assert(frontendSkills.includes('React'));
  assert(frontendSkills.includes('Tailwind CSS'));

  const backendSkills = getSkills('Backend & APIs');
  assert(backendSkills.includes('FastAPI'));
  assert(backendSkills.includes('Gin'));
  assert(backendSkills.includes('Axum'));
  assert(backendSkills.includes('GraphQL')); // From topics!

  const dbSkills = getSkills('Databases & Storage');
  assert(dbSkills.includes('Prisma'));

  const devopsSkills = getSkills('DevOps & Cloud');
  assert(devopsSkills.includes('Docker')); // From topics!
  assert(devopsSkills.includes('Kubernetes')); // From topics!

  const aiSkills = getSkills('AI & Machine Learning');
  assert(aiSkills.includes('Pandas'));
  assert(aiSkills.includes('PyTorch'));

  const secSkills = getSkills('Security & Auth');
  assert(secSkills.includes('NextAuth.js'));

  const testSkills = getSkills('Testing & Quality');
  assert(testSkills.includes('Jest'));

  const languagesSkills = getSkills('Languages');
  assert(languagesSkills.includes('TypeScript'));
  assert(languagesSkills.includes('Python'));
  assert(languagesSkills.includes('Go'));
  assert(languagesSkills.includes('Rust'));
}

console.log('✅ All Manifest Classifier tests passed!');
