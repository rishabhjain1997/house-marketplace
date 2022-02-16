import React from "react"
import spinner from "../assets/svg/Spinner.gif"
const Spinner = () => {
  return (
    <div className="h-screen flex flex-col  justify-center">
      <img src={spinner} alt="Loading..." className=" align-middle mx-auto" />
    </div>
  )
}

export default Spinner
