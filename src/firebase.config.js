import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCTXPCSs7ZhqJUms3W5YeFVtkGcKVxb_cQ",
  authDomain: "house-marketplace-app-5ed50.firebaseapp.com",
  projectId: "house-marketplace-app-5ed50",
  storageBucket: "house-marketplace-app-5ed50.appspot.com",
  messagingSenderId: "194485157107",
  appId: "1:194485157107:web:316946feb71a8200e18b86",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore()
