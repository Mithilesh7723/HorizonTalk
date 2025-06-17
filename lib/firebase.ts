import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCPHGXVrGotd6REsA6WFlw2okgJzTbVvbQ",
  authDomain: "horizontalk123.firebaseapp.com",
  databaseURL: "https://horizontalk123-default-rtdb.firebaseio.com",
  projectId: "horizontalk123",
  storageBucket: "horizontalk123.firebasestorage.app",
  messagingSenderId: "187200046808",
  appId: "1:187200046808:web:caae462a40ce0ad804f9ad",
  measurementId: "G-PBDWWMHYZM",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const database = getDatabase(app)
export const storage = getStorage(app)

// Initialize Analytics only in browser environment
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
