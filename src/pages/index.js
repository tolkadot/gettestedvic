import React, { useState, useEffect } from "react"

//components
import Layout from "../components/layout"
import Seo from "../components/seo"

//styles
import "../styles/theme.scss"

//helper
const reactStringReplace = require("react-string-replace")


const IndexPage = () => {

  //state variables
  const [data, setData] = useState([])
  const [meta, setMeta] = useState([])
  const [placeFound, setPlaceFound] = useState([])
  const [typedValueState, setTypedValueState] = useState('')

  //client-side Runtime Data Fetching
  const url ="https://polished-frost-2201.tolka.workers.dev/tolka/https://pausedatahealth01.blob.core.windows.net/testsitemaster/testingsitedata/TestSitesData.json"
  //"https://test.cors.workers.dev/?https://pausedatahealth01.blob.core.windows.net/testsitemaster/testingsitedata/TestSitesData.json"
  //"https://thingproxy.freeboard.io/fetch/https://pausedatahealth01.blob.core.windows.net/testsitemaster/testingsitedata/TestSitesData.json"
  //"https://gist.githubusercontent.com/tolkadot/bf82976676f5e3140c8acead487328c0/raw/vic-covid-testing-sites.json"

    
  useEffect(() => {

    const cities = []

    fetch(url)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json() // parse JSON from request

      }) 
      .then(resultData => {
        console.log(resultData);
        cities.push(...resultData.sites) //push sites object into cities array
        setMeta(formatDate(resultData.meta.releaseDate)) //set the meta const
        setData(cities) //set the data const 
      })
      .catch(error => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        )
      })
  }, [])

  //format of queried date is "2021-11-28 13:16:50" convert to  28 Nov 2021 13:16
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
    console.log(inputWord, citiesArray)
    return citiesArray.filter(place => {
      const regexInput = new RegExp(inputWord, "gi")
      return place.Suburb.match(regexInput) || place.LGA.match(regexInput)
    })
  }

  function handleChange(e) {
    //console.log(e.target.value)
    setTypedValueState(e.target.value)
    setPlaceFound(findMatches(e.target.value, data))
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <Layout>
      <Seo title="Get tested Victoria" />

      <section>
        <header>
          <h2>Coronavirus / COVID-19 testing center locations in Victoria, Australia</h2>
          <p>Find your nearest COVID-19 testing center.  Type in your suburb for details of address, opening hours and contact numbers. </p>
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
          <ul className="card--results" key={place.Site_ID}>
            <li>
              <strong>Suburb:&nbsp;</strong>
              {reactStringReplace(place.Suburb, typedValueState, (match, i) => (
                <span className="hl">{capitalizeFirstLetter(typedValueState)}</span>
              ))}
            </li>
            <li>
              <strong>LGA:&nbsp;</strong>
              
               {reactStringReplace(place.LGA, typedValueState, (match, i) => (
                <span className="hl">{capitalizeFirstLetter(typedValueState)}</span>
              ))}
            </li>
            <li>
              <strong>Address:&nbsp;</strong> {place.Address}
            </li>
            <li>
              <strong>Status:&nbsp;</strong> {place.Status}
            </li>
            <li>
              <strong>Format:&nbsp;</strong> {place.ServiceFormat}
            </li>
            <li>
              <strong>Phone:&nbsp;</strong>
                {place.Phone != null
                  ? <a href={place.Phone && "tel:" + place.Phone}>place.Phone</a>
                  : " No phone number available"}
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
              <strong>Current Wait Time:&nbsp;</strong>
              {place.DelayText != null
                ? place.DelayText
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
          Information about Coronavirus / COVID-19 testing centers is pulled from the &nbsp;
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