"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
exports.initFirebaseAdmin = initFirebaseAdmin;
exports.isFirebaseAdminInitialized = isFirebaseAdminInitialized;
const admin = __importStar(require("firebase-admin"));
exports.admin = admin;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function readServiceAccountFromEnvOrFile() {
    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (json && json.trim()) {
        return {
            serviceAccount: JSON.parse(json),
            source: 'FIREBASE_SERVICE_ACCOUNT_JSON',
        };
    }
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (b64 && b64.trim()) {
        const decoded = Buffer.from(b64, 'base64').toString('utf-8');
        return {
            serviceAccount: JSON.parse(decoded),
            source: 'FIREBASE_SERVICE_ACCOUNT_BASE64',
        };
    }
    const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
        process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!envPath || !envPath.trim())
        return null;
    const fullPath = path.resolve(envPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Firebase service account file not found: ${fullPath}`);
    }
    return {
        serviceAccount: JSON.parse(fs.readFileSync(fullPath, 'utf-8')),
        source: process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ? 'FIREBASE_SERVICE_ACCOUNT_PATH' : 'GOOGLE_APPLICATION_CREDENTIALS',
    };
}
function initFirebaseAdmin() {
    if (admin.apps.length)
        return true;
    const maybeAccount = readServiceAccountFromEnvOrFile();
    if (!maybeAccount)
        return false;
    admin.initializeApp({
        credential: admin.credential.cert(maybeAccount.serviceAccount),
    });
    return true;
}
function isFirebaseAdminInitialized() {
    return admin.apps.length > 0;
}
//# sourceMappingURL=firebase-admin.js.map