import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"
import { db } from "../firebase.config"

const OAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check for user
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate("/")
    } catch (error) {
      toast("Could not authorize with Google")
    }
  }
  return (
    <div className="my-12 flex flex-col items-center">
      <p>Sign {location.pathname === "/sign-in" ? "in" : "up"} with</p>
      <button
        onClick={onGoogleClick}
        className="mt-8 p-4 bg-base-100 rounded-full"
      >
        <img src={googleIcon} alt="Google" height="30px" width="30px" />
      </button>
    </div>
  )
}

export default OAuth
