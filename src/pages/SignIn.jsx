import React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import { updateDoc } from "firebase/firestore"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import OAuth from "../components/OAuth"

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const { email, password } = formData
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
    const auth = getAuth()
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user
      if (user) {
        navigate("/")
        //console.log(user)
      }
    } catch (error) {
      toast.error("Error logging in", {
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
            <p className="font-extrabold text-2xl">Sign In</p>
            <button className="bg-accent rounded-full p-2">
              <ArrowRightIcon width="34px" height="34px" fill="white" />
            </button>
          </div>
        </form>
        <OAuth />

        <div className="w-full mt-8 mx-auto flex justify-center">
          <Link to="/sign-up" className="text-accent font-bold">
            Sign Up Instead
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
