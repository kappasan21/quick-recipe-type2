/* eslint-disable */
const path = require('path');
const fs = require('fs');


const filePath = path.join(__dirname, '../src/lib/translations.ts');
const txt = fs.readFileSync(filePath, 'utf8');

const regex = /["']([^"']+)["']\s*:\s*["']([^"']+)["']/g;
const keys = new Map();
const values = new Map();
let match;
let duplicateKeyCount = 0;
// let duplicateValueCount = 0;

while ((match = regex.exec(txt))) {
  const key = match[1].trim();
  const value = match[2].trim();
  if (!keys.has(key)) {
    keys.set(key, []);
  }
  keys.get(key).push(value);

  if (!values.has(value)) {
    values.set(value, []);
  }
  values.get(value).push(key);
}

const duplicateKeyEntries = [...keys.entries()].filter(([_, v]) => v.length > 1);
if (duplicateKeyEntries.length > 0) {
  console.error('Error: Duplicate translation keys found in translations.ts:');
  duplicateKeyEntries.forEach(([key, values]) => {
    console.error(`  ${key} => ${values.join(' | ')}`);
  });
  duplicateKeyCount = duplicateKeyEntries.length;
}

// optional: detect duplicate value translations to same target (not critical)
const duplicateValueEntries = [...values.entries()].filter(([_, v]) => v.length > 1);
if (duplicateValueEntries.length > 0) {
  console.warn('Warning: Duplicate translation values in translations.ts (same output for multiple keys):');
  duplicateValueEntries.forEach(([value, keys]) => {
    console.warn(`  ${value} <= ${keys.join(' | ')}`);
  });
  // duplicateValueCount = duplicateValueEntries.length;
}

if (duplicateKeyCount > 0) {
  process.exit(1);
}

console.log('translations.ts validation passed:', keys.size, 'unique keys,', values.size, 'unique values');
process.exit(0);
