import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themesDir = path.resolve(__dirname, '../common/themes');
const outputCssFile = path.resolve(__dirname, './tokens.css');
const outputTsFile = path.resolve(__dirname, './tokens.ts');

async function generate() {
  const themeFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'types.ts');

  let cssContent = '/* Generated file - do not edit manually */\n\n';
  let tsContent = '/* Generated file - do not edit manually */\n\nexport const themes = {\n';
  let themeCount = 0;

  for (const file of themeFiles) {
    const themeName = file.replace('.ts', '');
    const themePath = path.join(themesDir, file);

    const fileContent = fs.readFileSync(themePath, 'utf8');

    // Better regex to handle both single and double quotes, and optional trailing commas
    const matches = fileContent.matchAll(/(\w+):\s*['"]([^'"]+)['"]/g);
    const tokens = {};
    for (const match of matches) {
      if (match[1] === 'name') continue;
      tokens[match[1]] = match[2];
    }

    if (Object.keys(tokens).length === 0) {
      console.warn(`Warning: No tokens found in ${file}`);
      continue;
    }

    themeCount++;
    const selector = themeName === 'original' ? ':root, [data-theme="original"]' : `[data-theme="${themeName}"]`;
    cssContent += `${selector} {\n`;
    tsContent += `  ${themeName}: {\n`;

    for (const [key, value] of Object.entries(tokens)) {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      cssContent += `  --t-${cssKey}: ${value};\n`;
      tsContent += `    ${key}: 'var(--color-${cssKey})',\n`;
    }

    cssContent += '}\n\n';
    tsContent += '  },\n';
  }

  tsContent += '} as const;\n\nexport type ThemeName = keyof typeof themes;\n';

  fs.writeFileSync(outputCssFile, cssContent);
  fs.writeFileSync(outputTsFile, tsContent);

  console.log(`Successfully generated tokens.css and tokens.ts with ${themeCount} themes`);
}

generate().catch(console.error);
