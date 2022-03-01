import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../firebase.config"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper-bundle.css"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

const Listing = () => {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        console.log(docSnap.data())
        setListing(docSnap.data())
        setLoading(false)
        // console.log(auth.currentUser.uid)
      }
    }
    fetchListing()
  }, [navigate, params.listingId])
  if (loading) {
    return <Spinner />
  }
  return (
    <main className="container mx-auto px-2.5 relative">
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute top-5 z-10 right-5 p-2 bg-base-100 rounded-full">
        <img
          src={shareIcon}
          alt="share"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setShareLinkCopied(true)
            setTimeout(() => {
              setShareLinkCopied(false)
            }, 2000)
          }}
        />
      </div>
      {shareLinkCopied && <p className="">Link Copied!</p>}
      <div>
        <p className="py-7 font-extrabold text-xl pb-3">
          {listing.name} - ${" "}
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="font-semibold text-sm">{listing.location}</p>
        <div className="flex flex-row justify-start space-x-3  my-2">
          <p className="badge badge-info">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </p>
          {listing.offer && (
            <p className="badge badge-secondary">
              ${listing.regularPrice - listing.discountedPrice} discount
            </p>
          )}
        </div>
        <ul className="mb-5 mt-3">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : "1 Bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : "1 Bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        <p className="font-bold text-lg mb-7">Location</p>
        <div className="w-full h-64 mb-4">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            className="text-center block mx-auto max-w-sm rounded-lg bg-accent p-3 text-base-100"
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  )
}

export default Listing
