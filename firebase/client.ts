// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDq6GaR0uwkqrHHaeTbw9fGtR_6Zn21DQA",
    authDomain: "prepwise-7a335.firebaseapp.com",
    projectId: "prepwise-7a335",
    storageBucket: "prepwise-7a335.firebasestorage.app",
    messagingSenderId: "689512159320",
    appId: "1:689512159320:web:50ea8747ae41c07514d22d",
    measurementId: "G-SY1BCXG4TF"
};

// Initialize Firebase
const app = !getApp.length? initializeApp(firebaseConfig): getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
