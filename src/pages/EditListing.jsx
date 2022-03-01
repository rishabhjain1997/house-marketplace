import React from "react"
import { useState, useEffect, useRef } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useParams } from "react-router-dom"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import { v4 as uuidv4 } from "uuid"

const EditListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(false)
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  })

  const {
    type,
    name,
    bathrooms,
    bedrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const params = useParams()

  //Redirect if listing is not user's
  useEffect(() => {
    if (listing && auth.currentUser.uid !== listing.userRef) {
      toast.error("You can not edit this document")
      navigate("/")
    }
  })
  useEffect(() => {
    const fetchListings = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setFormData({ ...docSnap.data(), address: docSnap.data().location })
        setLoading(false)
      } else {
        toast.error("Could not fetch listing")
        navigate("/")
      }
    }
    setLoading(true)
    fetchListings()
  }, [])

  // Sets userRef to logged in user
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate("/sign-in")
        }
      })
    }

    return () => {
      isMounted.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error("Discounted Price needs to be less than the regular price")
    }
    if (images.length > 6) {
      setLoading(false)
      toast.error("Please upload less than 6 images")
    }
    let geolocation = { lat: latitude, lng: longitude }
    let location = address

    // Store images in Firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
          .replace(".", "_")
          .replace("-", "_")

        const storageRef = ref(storage, "images/" + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            // console.log("Upload is " + progress + "% done")
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((e) => {
      setLoading(false)
      toast.error("Images not uploaded")
      return
    })

    const formDataCopy = {
      ...formData,
      imageUrls: imgUrls,
      geolocation,
      location,
      timestamp: serverTimestamp(),
    }
    delete formDataCopy.images
    delete formDataCopy.address
    if (!formDataCopy.offer) {
      delete formDataCopy.discountedPrice
    }

    const docRef = doc(db, "listings", params.listingId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success("Listing updated")
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  const onMutate = (e) => {
    let boolean = null
    if (e.target.value === "true") {
      boolean = true
    }

    if (e.target.value === "false") {
      boolean = false
    }

    if (e.target.files) {
      setFormData((prevState) => {
        return {
          ...prevState,
          images: e.target.files,
        }
      })
    } else {
      setFormData((prevState) => {
        return {
          ...prevState,
          [e.target.id]: boolean ?? e.target.value,
        }
      })
    }
  }

  if (loading) {
    return <Spinner />
  }
  return (
    <div className="container mx-auto px-2.5">
      <header className="py-7">
        <p className="font-extrabold text-3xl">Create a Listing</p>
      </header>
      <main>
        <form onSubmit={onSubmit} className="flex flex-col">
          <label className="font-semibold text-md  mb-2">Sell / Rent</label>
          <div className="flex flex-row space-x-3">
            <button
              type="button"
              className={`${
                type === "sale"
                  ? "bg-accent text-primary-content"
                  : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>

            <button
              type="button"
              className={`${
                type === "rent"
                  ? "bg-accent text-primary-content"
                  : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="mt-4 mb-2 font-semibold text-md">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            className={`py-3 px-8 rounded-xl font-semibold max-w-xl`}
            required
          />
          <div className="mt-4 flex flex-row space-x-8">
            <div className="flex flex-col  space-y-2">
              <label className=" font-semibold text-md">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                className="py-3 px-8 rounded-xl"
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className=" font-semibold text-md">Bathrooms</label>
              <input
                type="number"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
                className="py-3 px-8 rounded-xl"
              />
            </div>
          </div>

          <label className="mt-4 mb-2 font-semibold text-md">
            Parking Spot
          </label>
          <div className="flex flex-row space-x-3">
            <button
              type="button"
              className={`${
                parking ? "bg-accent text-primary-content" : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              id="parking"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>

            <button
              type="button"
              className={`${
                !parking && parking !== null
                  ? "bg-accent text-primary-content"
                  : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              id="parking"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="mt-4 mb-2 font-semibold text-md">Furnished</label>
          <div className="flex flex-row space-x-3">
            <button
              type="button"
              className={`${
                furnished ? "bg-accent text-primary-content" : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              id="furnished"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>

            <button
              type="button"
              className={`${
                !furnished && furnished !== null
                  ? "bg-accent text-primary-content"
                  : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              id="furnished"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="mt-4  mb-2 font-semibold text-md">Address</label>
          <textarea
            id="address"
            value={address}
            className={`py-3 px-8 rounded-xl font-semibold max-w-xl`}
            onChange={onMutate}
            required
          ></textarea>

          {!geolocationEnabled && (
            <div className="mt-4 flex flex-row space-x-8">
              <div className="flex flex-col  space-y-2">
                <label className="mt-2 font-semibold text-md">Latitude</label>
                <input
                  type="number"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                  className="py-3 px-8 rounded-xl"
                  min="-360"
                  max="360"
                />
              </div>
              <div className="flex flex-col  space-y-2">
                <label className="mt-2 font-semibold text-md">Longitude</label>
                <input
                  type="number"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                  className="py-3 px-8 rounded-xl"
                  min="-360"
                  max="360"
                />
              </div>
            </div>
          )}

          <label className="mt-4 mb-2 font-semibold text-md">Offer</label>
          <div className="flex flex-row space-x-3">
            <button
              className={`${
                offer ? "bg-accent text-primary-content" : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              onClick={onMutate}
              id="offer"
              value={true}
              type="button"
            >
              Yes
            </button>

            <button
              className={`${
                !offer && offer !== null
                  ? "bg-accent text-primary-content"
                  : "bg-base-100"
              }  py-3 px-8 rounded-xl font-semibold`}
              onClick={onMutate}
              id="offer"
              value={false}
              type="button"
            >
              No
            </button>
          </div>

          <label className="mt-4  mb-2 font-semibold text-md">
            Regular Price
          </label>
          <div className="flex content-end justify-start">
            <input
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              required
              max="750000000"
              className={`py-3 px-8 rounded-xl font-semibold max-w-xl`}
            />
            {type === "rent" && (
              <p className="h-min self-center ml-4 font-semibold">$ / Month</p>
            )}
          </div>

          {offer && (
            <>
              <label className="mt-4  mb-2 font-semibold text-md">
                Discounter Price
              </label>
              <input
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                required={offer}
                max="750000000"
                className={`py-3 px-8 rounded-xl font-semibold max-w-xl`}
              />
            </>
          )}

          <label className="mt-4 mb-2 font-semibold text-md">Images</label>
          <p className="font-light text-sm mb-4">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onMutate}
            max="6"
            multiple
            accept=".jpg, .png, .jpeg"
            className="py-3 px-8 rounded-xl font-semibold max-w-xl bg-base-100"
          />
          <button
            type="submit"
            className="my-8 py-3 px-8 rounded-xl bg-accent font-semibold text-white text-lg"
          >
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}

export default EditListing
