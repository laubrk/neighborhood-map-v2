### Udacity Front End Web Developer Neighborhood Map Project
---

#### Overview

This is a single page application from Udacity Front End Web Developer Nano-Degree. It uses React, Google Maps and FourSquare to present a map of breweries in the downtown San Diego area.

The application functions as follows:

* Clicking on a marker will open info on that venue.
* Markers may be closed using "x" or closed when a new info window is opened.
* Clicking on a venue in the sidebar will open an info window on the map marker. Clicking any new venue in the sidebar will close any open info window.
* The search bar will filter all venues and corresponding map markers dynamically, as typed, depending on the query string being searched. Search filtering is based on venue name.

<img width="750px" alt="Neighborhood Map" src="/img/map-application.jpg">

#### Other Functionality and Technologies

The application map and locations are based on use of [Google Maps API](https://developers.google.com/maps/documentation/). Venue information is based on data from [Fourquare API](https://developer.foursquare.com/).

The application also uses [axios](https://www.npmjs.com/package/axios) to simplify API calls to FourSquare.

The single page application is accessible and responsive.

Service worker is functional only after application is put in production with `run npm build`

#### Running the Site

To run the application, follow these steps:

* Download the repository to your local machine
* Install all project dependencies with `npm install`
* Start the development server with `npm start`
* Open up localhost:3000 in your browser

#### Resources and Acknowledgement

References and attribution is given in code comments for certain functionality approaches used.

***

#### Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).