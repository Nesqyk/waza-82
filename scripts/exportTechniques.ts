/**
 * Export TECHNIQUES array to JSON for seeding.
 *
 * Usage: npx tsx scripts/exportTechniques.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the TECHNIQUES array directly.
import { TECHNIQUES } from '../constants';

const outputPath = path.resolve(__dirname, 'techniques.json');
fs.writeFileSync(outputPath, JSON.stringify(TECHNIQUES, null, 2), 'utf-8');
console.log(`Exported ${TECHNIQUES.length} techniques to ${outputPath}`);

