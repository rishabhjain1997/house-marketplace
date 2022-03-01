import React from "react"
import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"

const Contact = () => {
  const [message, setMessage] = useState("")
  const [landlord, setLandlord] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error("Could not get landlord data")
      }
    }
    getLandlord()
  }, [params.landlordId])

  const onChange = (e) => {
    return setMessage(e.target.value)
  }

  return (
    <div className="container mx-auto px-2.5">
      <header>
        <p className="py-7 font-extrabold text-xl">Contact Landlord</p>
      </header>
      {landlord !== null && (
        <main>
          <div>
            <p className="mb-5 font-semibold">Contact {landlord?.name}</p>
          </div>

          <form>
            <div className="flex flex-col justify-center space-y-2">
              <label htmlFor="message" className="text-sm">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={onChange}
                className="w-full mx-auto max-w-xl h-24 rounded-lg"
              ></textarea>
            </div>
            <a
              href={`mailto:${landlord.id}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button
                type="button"
                className="block max-w-md bg-accent mx-auto mt-8 p-4 px-8 rounded-lg text-base-100 font-semibold"
              >
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}

export default Contact
