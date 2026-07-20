import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

import { firebaseConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Missing Firebase environment variables");
  }

  if (app) {
    return app;
  }

  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return app;
}
