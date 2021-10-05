import React, { useState, useEffect } from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

import "../styles/theme.scss"

const reactStringReplace = require("react-string-replace")

const IndexPage = () => {
  // Build Time Data Fetching

  const [data, setData] = useState([])
  const [meta, setMeta] = useState([])
  //const [placeToFind, setplaceToFind] = useState([])
  const [placeFound, setplaceFound] = useState([])
  //const [regex, setRegex] = useState()
  const [typedValueState, setTypedValueState] = useState()
  //let fixedDate
  // Client-side Runtime Data Fetching
  const url =
    "https://gist.githubusercontent.com/tolkadot/bf82976676f5e3140c8acead487328c0/raw/vic-covid-testing-sites.json"
  //"https://gist.githubusercontent.com/tolkadot/bf82976676f5e3140c8acead487328c0/raw/d732553023f50837868d9508573b2e9be8c919af/vic-covid-testing-sites.json"

  useEffect(() => {
    const cities = []

    fetch(url)
      .then(response => response.json()) // parse JSON from request
      .then(resultData => {
        // console.log(resultData.sites)
        cities.push(...resultData.sites)
        // console.log(resultData.meta)
        //fixedDate = formatDate(resultData.meta.releaseDate)
        setMeta(formatDate(resultData.meta.releaseDate))
        setData(cities)
      })
  }, [])

  function formatDate(date) {
    if (date.length === 19) {
      const month = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ]
      return (
        date.substring(8, 10) +
        " " +
        month[date.substring(5, 7)] +
        " " +
        date.substring(0, 4) +
        " " +
        date.substring(11, 16)
      )
    } else {
      return "Not currently available"
    }
  }

  function findMatches(inputWord, citiesArray) {
    return citiesArray.filter(place => {
      const regexInput = new RegExp(inputWord, "gi")
      return place.Suburb.match(regexInput) || place.LGA.match(regexInput)
    })
  }

  function handleChange(e) {
    //console.log(e.target.value)
    setTypedValueState(e.target.value)
    //setRegex(new RegExp(e.target.value, "gi"))
    //console.log("REGEX", regex)
    setplaceFound(findMatches(e.target.value, data))
  }

  return (
    <Layout>
      <Seo title="Get tested Victoria" />

      <section>
        <header>
          <h2>Covid testing locations in Victoria, Australia</h2>
        </header>
        <p className="text--body-large">
          Last Updated: <span id="updated">{meta}</span>
        </p>
        <form className="search-form">
          <label htmlFor="cities-search" className="visually-hidden">
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
              {place.LGA}
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
                rel="noreferrer"
              >
                Take me to the map
              </a>
            </li>
          </ul>
        ))}
      </section>
      <section>
        <p>
          Information about Covid 19 testing centers is pulled from the{" "}
          <a
            href="https://discover.data.vic.gov.au/dataset/victorian-testing-site-locations-for-covid-19"
            target="_blank"
            rel="noreferrer"
          >
            Data Vic website
          </a>
        </p>
      </section>
    </Layout>
  )
}

export default IndexPage
