import React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import { db } from "../firebase.config"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { toast } from "react-toastify"

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const { name, email, password } = formData
  const onChange = (e) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      }
    })
  }
  const navigate = useNavigate()
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, "users", user.uid), formDataCopy)
      navigate("/")
    } catch (error) {
      toast.error("Error signing up", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
  return (
    <div>
      <div className="container mx-auto px-2.5">
        <header className="py-7">
          <p className="font-extrabold text-3xl">Welcome Back!</p>
        </header>
        <form className="form-control" onSubmit={onSubmit}>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onChange}
            className="input rounded-3xl nameInput px-12 mb-8"
            placeholder="Name"
          />

          <input
            type="email"
            id="email"
            value={email}
            onChange={onChange}
            className="input rounded-3xl emailInput px-12 mb-8"
            placeholder="Email"
          />
          <div className="relative mb-8">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={onChange}
              className="input rounded-3xl w-full passwordInput px-12"
              placeholder="Password"
            />
            <img
              src={visibilityIcon}
              alt="show"
              className="absolute bottom-3 right-5"
              onClick={(e) => {
                setShowPassword((prevState) => !prevState)
              }}
            />
          </div>
          <Link
            to="/forgot-password"
            className="ml-auto text-accent font-bold mb-16"
          >
            Forgot Password
          </Link>
          <div className="flex items-center justify-between">
            <p className="font-extrabold text-2xl">Sign Up</p>
            <button className="bg-accent rounded-full p-2">
              <ArrowRightIcon width="34px" height="34px" fill="white" />
            </button>
          </div>
        </form>
        {/* {Google OAuth} */}

        <div className="w-full mt-8 mx-auto flex justify-center">
          <Link to="/sign-in" className="text-accent font-bold">
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
