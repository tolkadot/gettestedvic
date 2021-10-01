import React, { useState, useEffect } from "react"
//import { graphql, useStaticQuery } from "gatsby"
const reactStringReplace = require("react-string-replace")

const IndexPage = () => {
  // Build Time Data Fetching

  const [data, setData] = useState([])
  const [meta, setMeta] = useState([])
  const [placeToFind, setplaceToFind] = useState([])
  const [placeFound, setplaceFound] = useState([])
  const [regex, setRegex] = useState()
  const [typedValueState, setTypedValueState] = useState()
  let typedValue
  let hl

  const cities = []
  // Client-side Runtime Data Fetching
  const url =
    "https://gist.githubusercontent.com/tolkadot/bf82976676f5e3140c8acead487328c0/raw/3180bbd7fe7a6067f2ccf14f8f2c34d921a5418d/vic-covid-testing-sites.json"

  useEffect(() => {
    fetch(url)
      .then(response => response.json()) // parse JSON from request
      .then(resultData => {
        console.log(resultData.sites)
        cities.push(...resultData.sites)
        setMeta(resultData.meta)
        setData(cities)
      })
  }, [])

  function findMatches(inputWord, citiesArray) {
    return citiesArray.filter(place => {
      const regexInput = new RegExp(inputWord, "gi")
      return place.Suburb.match(regexInput) || place.LGA.match(regexInput)
    })
  }

  function handleChange(e) {
    console.log(e.target.value)
    setTypedValueState(e.target.value)
    setRegex(new RegExp(e.target.value, "gi"))
    console.log("REGEX", regex)
    setplaceFound(findMatches(e.target.value, data))
  }

  return (
    <section>
      <header>
        <h1>Covid testing locations in Victoria Australia</h1>
      </header>
      <h2>
        Last Updated: <span id="updated">{meta.releaseDate}</span>
      </h2>
      <form className="search-form">
        <input
          type="text"
          className="search"
          id="cities-search"
          placeholder="Enter City or Suburb"
          onChange={handleChange}
        />
        <ul className="suggestions"></ul>
      </form>
      {placeFound.map(place => (
        <ul>
          <li>Suburb: {place.Suburb}</li>
          <li>
            {reactStringReplace(place.Suburb, typedValueState, (match, i) => (
              <span className="hl">{typedValueState}</span>
            ))}
          </li>
          <li>LGA: {place.LGA}</li>
          <li>Address: {place.Address}</li>
          <li>Format: {place.ServiceFormat}</li>
          <li>
            Phone:
            <a href={place.Phone && "tel:" + place.Phone}>
              {place.Phone != null ? place.Phone : " No phone number available"}
            </a>
          </li>
          <li>
            Hours:{" "}
            {place.Service_Availability != null
              ? place.Service_Availability
              : "No hours available"}{" "}
          </li>
          <li>
            Instructions:{" "}
            {place.Attendance_Instructions != null
              ? place.Attendance_Instructions
              : "No special instructions available"}{" "}
          </li>
          <li>
            <a
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                place.Latitude +
                "%2C" +
                place.Longitude
              }
              target="_blank"
            >
              Take me to the map
            </a>
          </li>
        </ul>
      ))}
    </section>
  )
}

export default IndexPage
