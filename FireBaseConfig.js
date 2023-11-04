// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEnrPYVDsMpZ7n44gumOuRm2UZtE0EOXk",
  authDomain: "dailyexpensive-2f1fc.firebaseapp.com",
  projectId: "dailyexpensive-2f1fc",
  storageBucket: "dailyexpensive-2f1fc.appspot.com",
  messagingSenderId: "915544705075",
  appId: "1:915544705075:web:394d2ca48cbc5ecdabfb46",
  measurementId: "G-D1T4B4X9WC"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
let app = ''
if(!firebase.apps.length){
  app=  firebase.initializeApp(firebaseConfig);
}
const auth = getAuth(app);
export {firebase,auth,app};