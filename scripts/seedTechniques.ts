/**
 * Seed Firestore `techniques` collection from constants.ts data.
 *
 * Usage:
 *   1. Download a service account key from Firebase Console and save as `scripts/serviceAccountKey.json`.
 *   2. Run: npx tsx scripts/seedTechniques.ts
 */

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import techniques (we'll generate JSON first)
const techniquesPath = path.resolve(__dirname, 'techniques.json');
if (!fs.existsSync(techniquesPath)) {
  console.error('techniques.json not found. Run: npx tsx scripts/exportTechniques.ts first.');
  process.exit(1);
}

const techniques = JSON.parse(fs.readFileSync(techniquesPath, 'utf-8'));

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account key not found at scripts/serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount: ServiceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function seed() {
  const batch = db.batch();

  for (const tech of techniques) {
    const docRef = db.collection('techniques').doc(tech.id);
    batch.set(docRef, tech, { merge: true });
  }

  await batch.commit();
  console.log(`Seeded ${techniques.length} techniques to Firestore.`);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});

