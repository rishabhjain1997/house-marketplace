import React from "react"
import { getAuth, updateProfile } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"

const Profile = () => {
  const auth = getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const navigate = useNavigate()
  const { name, email } = formData
  const onLogout = () => {
    auth.signOut()
    navigate("/")
  }
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update profile in FB Auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
        // Update profile in FB Firestore
        const userRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error("Could not update profile")
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      }
    })
  }

  return (
    <div>
      <header className="flex container mx-auto pt-8 px-2.5 justify-between">
        <p className="font-extrabold text-3xl">My Profile</p>
        <button
          type="button"
          onClick={onLogout}
          className="bg-accent rounded-full py-1 px-2 text-white font-bold"
        >
          Logout
        </button>
      </header>
      <main>
        <div className="flex container mx-auto px-2.5 justify-between mt-8">
          <p className="font-semibold">Personal Details</p>
          <p
            className="text-accent font-semibold pr-2"
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prev) => !prev)
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="flex container mt-5 mx-auto px-2.5 flex-col">
          <form>
            <div className="w-full max-w-5xl p-4 bg-white">
              <input
                type="text"
                id="name"
                disabled={!changeDetails}
                value={name}
                className={`w-full ${
                  changeDetails ? "bg-base-300" : "bg-base-100"
                }`}
                onChange={onChange}
                placeholder="Name"
              />
            </div>

            <div className="w-full max-w-5xl mt-5 p-4 bg-white">
              <input
                type="text"
                id="email"
                disabled={!changeDetails}
                value={email}
                className={`w-full ${
                  changeDetails ? "bg-base-300" : "bg-base-100"
                }`}
                onChange={onChange}
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default Profile
