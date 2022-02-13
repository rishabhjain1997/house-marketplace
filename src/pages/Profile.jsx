import React from "react"
import { getAuth } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
const Profile = () => {
  const auth = getAuth()
  const user = auth.currentUser

  const [formData, setFormData] = useState({
    name: user.displayName,
    email: user.email,
  })
  const navigate = useNavigate()
  const { name, email } = formData
  const onLogout = () => {
    auth.signOut()
    navigate("/")
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
    </div>
  )
}

export default Profile
