import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKBAilnh_cWUytEZDKvHxeNFmrUA81cQs",
  authDomain: "chat-app-8f15f.firebaseapp.com",
  projectId: "chat-app-8f15f",
  storageBucket: "chat-app-8f15f.appspot.com",
  messagingSenderId: "441179473543",
  appId: "1:441179473543:web:e66d68b96e3f5a903f9a22",
  measurementId: "G-E5LGTL2Y1N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { app, db }