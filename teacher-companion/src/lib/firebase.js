import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
apiKey: "AIzaSyBb0S_7U8FPaoUgjYpt_TlaAnJTBqNdvIE",
authDomain: "teaching-to-do-list.firebaseapp.com",
projectId: "teaching-to-do-list",
storageBucket: "teaching-to-do-list.firebasestorage.app",
messagingSenderId: "436829328408",
appId: "1:436829328408:web:6cc89bf82f9610c2689f6d",
measurementId: "G-32552MXKEK",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);