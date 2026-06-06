import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = 'dist';
const SRC_DIR = 'src';

// Set to true to fail CI if styled-components is found in dist
// Currently set to false to allow migration progress without breaking CI
const FAIL_ON_LEAKAGE = false;

function checkDist() {
  console.log('--- Checking dist/ for styled-components leakage ---');
  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist/ directory not found. Run npm run build first.');
    process.exit(1);
  }

  const files = fs.readdirSync(DIST_DIR, { recursive: true });
  let found = false;

  for (const file of files) {
    const filePath = path.join(DIST_DIR, file);
    if (fs.statSync(filePath).isFile() && (file.endsWith('.mjs') || file.endsWith('.cjs'))) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('styled-components')) {
        console.error(`Warning: styled-components found in ${filePath}`);
        found = true;
      }
    }
  }

  if (found) {
    console.log(`Leakage check finished with warnings.${FAIL_ON_LEAKAGE ? ' (Configured to FAIL)' : ''}`);
  } else {
    console.log('Leakage check PASSED.');
  }
  return FAIL_ON_LEAKAGE ? !found : true;
}

function checkSrc() {
  console.log('\n--- Migration Progress Report ---');
  const items = fs.readdirSync(SRC_DIR).filter(f => {
    const fullPath = path.join(SRC_DIR, f);
    return fs.statSync(fullPath).isDirectory() &&
           !['common', 'TailwindTheme', 'assets', 'legacy'].includes(f);
  });

  let migrated = 0;
  let total = items.length;

  for (const item of items) {
    const itemDir = path.join(SRC_DIR, item);
    const files = fs.readdirSync(itemDir, { recursive: true });
    let hasStyled = false;

    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
        const filePath = path.join(itemDir, file);
        if (fs.statSync(filePath).isFile()) {
           const content = fs.readFileSync(filePath, 'utf8');
           if (content.includes('styled-components')) {
             hasStyled = true;
             break;
           }
        }
      }
    }

    if (hasStyled) {
      console.log(`[ ] ${item}: Still uses styled-components`);
    } else {
      console.log(`[✅] ${item}: Migrated to Tailwind`);
      migrated++;
    }
  }

  console.log(`\nProgress: ${migrated}/${total} components/primitives migrated (${Math.round((migrated / total) * 100)}%)`);
  return true;
}

const distOk = checkDist();
const srcOk = checkSrc();

if (!distOk) {
  process.exit(1);
}
