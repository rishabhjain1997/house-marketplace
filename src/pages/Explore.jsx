import React from "react"
import { Link } from "react-router-dom"
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg"
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg"
import Slider from "../components/Slider"

const Explore = () => {
  return (
    <div className="container mx-auto px-2.5">
      <header>
        <p className="pt-8 mb-8 font-extrabold text-3xl">Explore</p>
      </header>
      <main>
        <Slider />

        <p className="mb-4 font-bold">Categories</p>
        <div className="grid grid-cols-2 gap-x-6">
          <Link to="/category/rent">
            <img
              src={rentCategoryImage}
              alt="rent"
              className="rounded-2xl h-36 w-full md:h-44 lg:h-60 2xl:h-72 mb-4"
            />
            <p className="font-semibold">Places to rent</p>
          </Link>
          <Link to="/category/sale">
            <img
              src={sellCategoryImage}
              alt="sell"
              className="rounded-2xl h-36  w-full md:h-44 lg:h-60 2xl:h-72 mb-4"
            />
            <p className="font-semibold">Places for sale</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore
