import React from "react"
import { Link } from "react-router-dom"
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg"
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg"
import bedIcon from "../assets/svg/bedIcon.svg"
import bathtubIcon from "../assets/svg/bathtubIcon.svg"

const ListingItem = ({ listing, id, onDelete, onEdit }) => {
  console.log(listing)
  console.log(id)
  console.log(listing.id)
  return (
    <li className="relative mb-5">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="flex justify-between items-center"
      >
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="h-32 w-4/12 object-cover object-center rounded-2xl lg:h-44 xl:h-52"
        />

        <div className="h-min w-7/12 flex flex-col">
          <p className="text-xs font-semibold">{listing.location}</p>
          <p className="mt-2 font-bold">{listing.name}</p>
          <p className="mt-3 text-accent font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / Month"}
          </p>
          <div className="flex flex-row justify-between mt-4 w-full max-w-xs">
            <img src={bedIcon} alt="bed" />
            <p>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : "1 Bedroom"}
            </p>
            <img src={bathtubIcon} alt="bathtub" />
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </div>
        </div>
      </Link>
      {onDelete && (
        <DeleteIcon
          className="absolute top-0 right-0"
          fill="rgb(231,76,60)"
          onClick={() => onDelete()}
        />
      )}
      {onEdit && (
        <EditIcon
          className="absolute top-0 right-8"
          fill="black"
          onClick={() => onEdit(id)}
        />
      )}
    </li>
  )
}

export default ListingItem
