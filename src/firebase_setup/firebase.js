// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     // apiKey: "AIzaSyDaWbc539oKFCQZSe7RRjeC7awgrRKb7KM",
//     apiKey: "AIzaSyBmvBvFY2I7ilnUo5K6E6wzLykDBTv7IC0",
//     // authDomain: "streampro-79790.firebaseapp.com",
//     // projectId: "streampro-f7e7f",
//     projectId: "streampro-768a8",
//     // storageBucket: "streampro-79790.appspot.com",
//     // messagingSenderId: "270100339480",
//     appId: "1:412220407331:web:68c07d3b1386facb86bb96",
//     // appId: "1:1058172241420:web:218c03fb44285b21ded029",
//     // measurementId: "G-HS4ZLXXGMN"
// };
const firebaseConfig = {
    apiKey: "AIzaSyBmvBvFY2I7ilnUo5K6E6wzLykDBTv7IC0",
    projectId: "streampro-768a8",
    appId: "1:412220407331:web:68c07d3b1386facb86bb96",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)

// const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);