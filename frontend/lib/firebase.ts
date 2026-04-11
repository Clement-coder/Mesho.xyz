import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwsOJasfRxnyLWw8-9MxWA-D8_3_H6abI",
  authDomain: "mesho-data-sciences-18d96.firebaseapp.com",
  projectId: "mesho-data-sciences-18d96",
  storageBucket: "mesho-data-sciences-18d96.firebasestorage.app",
  messagingSenderId: "416205100132",
  appId: "1:416205100132:web:3f69843624349a4011fb71",
  measurementId: "G-SRT2867G0V",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
