import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

import "../styles/theme.scss"

const reactStringReplace = require("react-string-replace")

const IndexPage = () => {
  // Build Time Data Fetching

  const [data, setData] = useState([])
  const [meta, setMeta] = useState([])
  const [placeToFind, setplaceToFind] = useState([])
  const [placeFound, setplaceFound] = useState([])
  const [regex, setRegex] = useState()
  const [typedValueState, setTypedValueState] = useState()

  const cities = []
  // Client-side Runtime Data Fetching
  const url =
    "https://gist.githubusercontent.com/tolkadot/bf82976676f5e3140c8acead487328c0/raw/vic-covid-testing-sites.json"
  //"https://gist.githubusercontent.com/tolkadot/bf82976676f5e3140c8acead487328c0/raw/d732553023f50837868d9508573b2e9be8c919af/vic-covid-testing-sites.json"

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
    <Layout>
      <Seo title="Get tested Victoria" />

      <section>
        <header>
          <h2>Covid testing locations in Victoria Australia</h2>
        </header>
        <p className="text--body-large">
          Last Updated: <span id="updated">{meta.releaseDate}</span>
        </p>
        <form className="search-form">
          <label for="cities-search" className="visually-hidden">
            Enter a City or Suburb
          </label>
          <input
            type="text"
            className="search"
            id="cities-search"
            placeholder="Enter City or Suburb"
            onChange={handleChange}
          />
        </form>
        {placeFound.map(place => (
          <ul className="card--results">
            <li>
              <strong>Suburb:&nbsp;</strong>
              {reactStringReplace(place.Suburb, typedValueState, (match, i) => (
                <span className="hl">{typedValueState}</span>
              ))}
            </li>
            <li>
              <strong>LGA:&nbsp;</strong>
              {reactStringReplace(place.LGA, typedValueState, (match, i) => (
                <span className="hl"> {typedValueState}</span>
              ))}
            </li>
            <li>
              <strong>Address:&nbsp;</strong> {place.Address}
            </li>
            <li>
              <strong>Format:&nbsp;</strong> {place.ServiceFormat}
            </li>
            <li>
              <strong>Phone:&nbsp;</strong>
              <a href={place.Phone && "tel:" + place.Phone}>
                {place.Phone != null
                  ? place.Phone
                  : " No phone number available"}
              </a>
            </li>
            <li>
              <strong>Hours:&nbsp;</strong>
              {place.Service_Availability != null
                ? place.Service_Availability
                : "No hours available"}
            </li>
            <li>
              <strong>Instructions:&nbsp;</strong>
              {place.Attendance_Instructions != null
                ? place.Attendance_Instructions
                : "No special instructions available"}
            </li>
            <li>
              <strong>Parking:&nbsp;</strong>
              {place.Parking_Options != null
                ? place.Parking_Options
                : "No details available"}
            </li>
            <li>
              <strong>Toilets:&nbsp;</strong>
              {place.Toilets_Available != null
                ? place.Toilets_Available
                : "No details available"}
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
    </Layout>
  )
}

export default IndexPage
