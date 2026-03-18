import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error('Firebase service account not found');
}

const fullPath = path.resolve(serviceAccountPath);

if (!fs.existsSync(fullPath)) {
  throw new Error(`Firebase service account file not found: ${fullPath}`);
}

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(fullPath, 'utf-8'),
  ) as admin.ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
