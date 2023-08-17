// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDaWbc539oKFCQZSe7RRjeC7awgrRKb7KM",
    // authDomain: "streampro-79790.firebaseapp.com",
    projectId: "streampro-f7e7f",
    // storageBucket: "streampro-79790.appspot.com",
    // messagingSenderId: "270100339480",
    appId: "1:1058172241420:web:218c03fb44285b21ded029",
    // measurementId: "G-HS4ZLXXGMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)

// const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);