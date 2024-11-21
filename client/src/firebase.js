// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mern-blog-6d3c9.firebaseapp.com",
  projectId: "mern-blog-6d3c9",
  storageBucket: "mern-blog-6d3c9.firebasestorage.app",
  messagingSenderId: "419873762189",
  appId: "1:419873762189:web:e9117c8328bd5fde3bebc4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);