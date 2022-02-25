import React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ListingItem from "../components/ListingItem"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"

const Offers = () => {
  const navigate = useNavigate()
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, "listings")
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        )
        const querySnap = await getDocs(q)
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }

    fetchListings()
  }, [])

  const onDeleteListing = (id, name) => {
    console.log(id, name)
  }
  return (
    <div className="container mx-auto px-2.5">
      <header className="py-7">
        <p className="font-extrabold text-3xl">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul>
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={onDeleteListing}
                  />
                )
              })}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  )
}

export default Offers
