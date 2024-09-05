// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCsLxS1TOj7ww0UekMVZF3aEB3QF1wrfgc",
  authDomain: "fir-snap-49947.firebaseapp.com",
  projectId: "fir-snap-49947",
  storageBucket: "fir-snap-49947.appspot.com",
  messagingSenderId: "54884287656",
  appId: "1:54884287656:web:fd85fac1478af14efaae9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const db=getFirestore(app)
export default app