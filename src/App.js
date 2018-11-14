import React, {Fragment, Component } from 'react';
import './App.css';
import Sidebar from './components/Sidebar.js'
import axios from 'axios'

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      locationNames: [],
      locationPhotos:[],
      locationDetails:[],
      fourSquareReady: false,
      fourSquarePhotosReady: false, //new
      markers: [],
      menuOpen: true
    }
  }
  
  //when component loads, run foursquare API to get locations
  componentDidMount() {
    this.foursquareLocations()
  }
 
  //only after component updated and foursquare locations obtained, based on state change, create the map
  componentDidUpdate(prevProps,prevState) {
    if (prevState.fourSquarePhotosReady !== this.state.fourSquarePhotosReady) {
      this.initMap()
    }
  }

  //call foursquare api using axios and get locations
  //when done, set state so map can load asynchronously
  //approach inspired by https://www.youtube.com/watch?v=dAhMIF0fNpo&index=4&list=PLgOB68PvvmWCGNn8UMTpcfQEiITzxEEA1&t=0s
  foursquareLocations = () => {
    const endpoint = "https://api.foursquare.com/v2/venues/explore?"
    const params = {
      client_id: "4GEVXOTWI0JXY51A0DS1K5CA3TCC5YWKEOTRMEYEGE2JO1CJ",
      client_secret: "SBCF5FNWEE1XHCHOQINY0T2U3UAUYYQSFOMD0GZ5VAGTDRBX",
      query: "brewery",
      ll: "32.713631,-117.155602",
      //near: 'san diego, CA',
      limit: 3,
      v: '20181030',
    }
    
    //use axios to request foursquare data
    axios.get(endpoint + new URLSearchParams(params))
      .then(response => {
        this.setState({
          locationNames: response.data.response.groups[0].items,
          fourSquareReady: true,
        })
          //console.log("FourSquare Done: "+this.state.fourSquareReady)
      })
      .then(()=>{
        this.foursquarePhotos()
      })
      .catch(error => {
        alert("There was an error with Foursquare Venue Data\n" + error)
      })
  }

  //get photos for venue by looping through all locations
  foursquarePhotos = () => {
    this.state.locationNames.map((location) => {
    const endpoint = "https://api.foursquare.com/v2/venues/"
    const params = {
      client_id: "4GEVXOTWI0JXY51A0DS1K5CA3TCC5YWKEOTRMEYEGE2JO1CJ",
      client_secret: "SBCF5FNWEE1XHCHOQINY0T2U3UAUYYQSFOMD0GZ5VAGTDRBX",
      v: '20181030',
    }

    axios.get(endpoint + location.venue.id + "/photos?" + new URLSearchParams(params))
      .then(response => {
        this.setState({
          locationPhoto: response.data.response.photos.items[0],
        })
      })
      .then(() => {
        location.testPhoto=new Object
        Object.assign(location.testPhoto, this.state.locationPhoto)

        this.state.locationPhotos.push(this.state.locationPhoto)
      /*
        location.newPhoto=new Array
        location.newPhoto.push(this.state.locationPhoto)
        this.state.locationPhotos.push(this.state.locationPhoto)
        */
      })
      
      .then(() => {
        if (this.state.locationPhotos.length === 3) {
          this.setState ({
          fourSquarePhotosReady: true
          })
        this.foursquareDetails()
        }
      })
      .catch(error => {
        alert("There was an error with Foursquare photo data.\n" + error)
        console.log("photo error here")
      })
    })
  }
  
  //get details for venue by looping through all locations
  foursquareDetails = () => {
    this.state.locationNames.map((location) => {
    const endpoint = "https://api.foursquare.com/v2/venues/"
    const params = {
      client_id: "4GEVXOTWI0JXY51A0DS1K5CA3TCC5YWKEOTRMEYEGE2JO1CJ",
      client_secret: "SBCF5FNWEE1XHCHOQINY0T2U3UAUYYQSFOMD0GZ5VAGTDRBX",
      v: '20181030',
    }

    axios.get(endpoint + location.venue.id + "/?" + new URLSearchParams(params))
      .then(response => {
        this.setState({
          locationDetails: response.data.response.venue,
        })
      })
      .then(() => {this.setState({fourSquarePhotosReady: true})
    })
  })
  }
  
  //initialize map
  initMap = () => {
    const map = new window.google.maps.Map(this.refs.map, {
      center: {lat: 32.713631, lng: -117.155602},
      zoom: 15
    });
    
    //console log testing for asynch loading issues
    //console.log("Map Loading: "+this.state.fourSquareReady)

    //create marker for each location returned on API call
    this.state.locationNames.map(location => {
      const marker = new window.google.maps.Marker({
        position: {lat: location.venue.location.lat, lng: location.venue.location.lng},
        map: map,
        id: location.venue.id,
        title: location.venue.name,
        address: location.venue.location.address,
        formattedAddress: location.venue.location.formattedAddress,
        animation: window.google.maps.Animation.DROP,
        isOpen: false,
        isVisible: true,
        photo: location.testPhoto.prefix+`width200`+location.testPhoto.suffix
        //photo: location.newPhoto[0].prefix+`width200`+location.newPhoto[0].suffix
      });

      this.state.markers.push(marker)

      //create infowindow for each marker
      marker.infoWindow = new window.google.maps.InfoWindow({
        content:
          `<div id="infoWindow">`+
          `<h1>${marker.title}</h1>`+
          `<p>${marker.formattedAddress[0]}</p>`+
          `<p>${marker.formattedAddress[1]}</p>`+
          `<br>`+
          `</div>`+
          `<p id="infoWindowImage"><img src="${marker.photo}"/></p>`,
        maxWidth: 300
      });

      //show infowindow on click
      marker.addListener('click', function() {
        closeMarkers(map);
        marker.infoWindow.open(map, marker);
      });

      //close all infowindows on click of new marker
      //https://hashnode.com/post/google-maps-api-onclick-on-marker-close-infowindow-of-other-markers-ciou68dw708x33353les71nyi
      let closeMarkers = (map) => {
        this.state.markers.forEach(function(marker) {
          marker.infoWindow.close(map,marker);
        });
      }
    })
  }

//approach on creating map in component:
//https://www.codementor.io/thomastuts/integrate-google-maps-api-react-refs-du10842zd

  render() {
    //console.log({...this.state});
    return (
      <Fragment>
        <div className = "App">
          <main>
            <Sidebar {...this.state}/>
            <div id = "map" ref = "map" aria-label = "map" role="application"></div>
          </main>
          <footer>Powered by Foursquare &nbsp; &nbsp;<i className = "fa fa-foursquare"></i></footer>
        </div>
      </Fragment>
    )
  }

}

export default App;