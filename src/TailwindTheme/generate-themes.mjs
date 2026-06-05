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

  for (const file of themeFiles) {
    const themeName = file.replace('.ts', '');
    const themePath = path.join(themesDir, file);

    // We need to use dynamic import because themes are TS files
    // But since they are ESM and we are in a script, we might need a trick or just read them as strings if they are simple objects
    // Actually, they are exported as default objects.

    const fileContent = fs.readFileSync(themePath, 'utf8');
    // Simple regex to extract keys and values assuming the format is:
    // export default {
    //   key: 'value',
    // }
    const matches = fileContent.matchAll(/(\w+):\s*'([^']+)'/g);
    const tokens = {};
    for (const match of matches) {
      tokens[match[1]] = match[2];
    }

    const selector = themeName === 'original' ? ':root, [data-theme="original"]' : `[data-theme="${themeName}"]`;
    cssContent += `${selector} {\n`;
    tsContent += `  ${themeName}: {\n`;

    for (const [key, value] of Object.entries(tokens)) {
      // Convert camelCase to kebab-case for CSS variables
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      cssContent += `  --t-${cssKey}: ${value};\n`;
      tsContent += `    ${key}: 'var(--t-${cssKey})',\n`;
    }

    cssContent += '}\n\n';
    tsContent += '  },\n';
  }

  tsContent += '} as const;\n\nexport type ThemeName = keyof typeof themes;\n';

  fs.writeFileSync(outputCssFile, cssContent);
  fs.writeFileSync(outputTsFile, tsContent);

  console.log('Successfully generated tokens.css and tokens.ts');
}

generate().catch(console.error);
