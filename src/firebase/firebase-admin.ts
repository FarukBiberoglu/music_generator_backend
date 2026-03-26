import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

function readServiceAccountFromEnvOrFile():
  | { serviceAccount: admin.ServiceAccount; source: string }
  | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json && json.trim()) {
    return {
      serviceAccount: JSON.parse(json) as admin.ServiceAccount,
      source: 'FIREBASE_SERVICE_ACCOUNT_JSON',
    };
  }

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64 && b64.trim()) {
    const decoded = Buffer.from(b64, 'base64').toString('utf-8');
    return {
      serviceAccount: JSON.parse(decoded) as admin.ServiceAccount,
      source: 'FIREBASE_SERVICE_ACCOUNT_BASE64',
    };
  }

  const envPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
    process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!envPath || !envPath.trim()) return null;

  const fullPath = path.resolve(envPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Firebase service account file not found: ${fullPath}`);
  }

  return {
    serviceAccount: JSON.parse(
      fs.readFileSync(fullPath, 'utf-8'),
    ) as admin.ServiceAccount,
    source:
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ? 'FIREBASE_SERVICE_ACCOUNT_PATH' : 'GOOGLE_APPLICATION_CREDENTIALS',
  };
}

export function initFirebaseAdmin(): boolean {
  if (admin.apps.length) return true;

  const maybeAccount = readServiceAccountFromEnvOrFile();
  if (!maybeAccount) return false;

  admin.initializeApp({
    credential: admin.credential.cert(maybeAccount.serviceAccount),
  });
  return true;
}

export function isFirebaseAdminInitialized(): boolean {
  return admin.apps.length > 0;
}

export { admin };
