import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg"
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg"
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true
    }
    return false
  }
  return (
    <footer className="fixed bottom-0 left-0 right-0 ">
      {/* */}
      <ul className="navbar w-full bg-base-100  mx-auto shadow-sm">
        <li
          className="navbar-start flex flex-col"
          onClick={() => navigate("/")}
        >
          <ExploreIcon
            fill={pathMatchRoute("/") ? "#2c2c2c" : "#8f8f8f"}
            width="36px"
            height="36px"
          />
          <p
            className={`font-semibold text-sm mt-1 ${
              pathMatchRoute("/") ? "text-base-content" : "text-gray-500"
            }`}
          >
            Explore
          </p>
        </li>
        <li
          className="navbar-center flex flex-col"
          onClick={() => navigate("/offers")}
        >
          <OfferIcon
            fill={pathMatchRoute("/offers") ? "#2c2c2c" : "#8f8f8f"}
            width="36px"
            height="36px"
          />
          <p
            className={`font-semibold text-sm mt-1 ${
              pathMatchRoute("/offers") ? "text-base-content" : "text-gray-500"
            }`}
          >
            Offers
          </p>
        </li>
        <li
          className="navbar-end flex flex-col"
          onClick={() => navigate("/profile")}
        >
          <PersonOutlineIcon
            fill={pathMatchRoute("/profile") ? "#2c2c2c" : "#8f8f8f"}
            width="36px"
            height="36px"
          />
          <p
            className={`font-semibold text-sm mt-1 ${
              pathMatchRoute("/profile") ? "text-base-content" : "text-gray-500"
            }`}
          >
            Profile
          </p>
        </li>
      </ul>
    </footer>
  )
}

export default Navbar
