import React from "react"
import { useState } from "react"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const onChange = (e) => setEmail(e.target.value)
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Email was sent")
    } catch (error) {
      toast.error("Could not send reset email")
    }
  }

  return (
    <div className="container mx-auto px-2.5">
      <header className="py-7">
        <p className="font-extrabold text-3xl">Forgot Password</p>
      </header>
      <main>
        <form className="form-control" onSubmit={onSubmit}>
          <input
            type="email"
            className="emailInput mt-4 p-2 rounded-lg pl-12"
            id="Email"
            value={email}
            placeholder="Email"
            onChange={onChange}
          />
          <Link
            className="ml-auto mt-4 font-semibold text-accent mr-1"
            to="/sign-in"
          >
            Sign In
          </Link>
          <div className="flex justify-between align-center mt-4 mr-1">
            <div className="w-max font-semibold text-xl">Send Reset Link</div>
            <button type="submit">
              <ArrowRightIcon
                fill="white"
                className="bg-accent rounded-full"
                width="34px"
                height="34px"
              />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
