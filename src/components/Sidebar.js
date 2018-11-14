import React, {Component} from 'react';

class Sidebar extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      query: "",
      filteredSearch:[],
      filteredMarkers:[],
      isSideBarOpen: true,
      menuOpen: true
    }
  }
  
  updateQuery = (query) => {
    this.setState({query: query});
    this.searchLocations(query);
    this.showMarkers(query)
  }

  //Run search query form search box input. Filter and show locations based on query
  searchLocations = (query) => {
    let filteredSearch =
      this.props.locationNames.filter(place => place.venue.name.toLowerCase().includes(query)
      )
      this.setState({filteredSearch: filteredSearch})
  }
  
  //Show markers for when match on search query by setting marker visibility true
  //and false if not a match from query.
  showMarkers = (query) => {
    //filtered markers (filtered to mean exclude from list) 
      this.props.markers.filter(place =>
      !place.title.toLowerCase().includes(query)
      )
      .map(place => (place.setVisible(false)));
    //unfiltered markers (to mean include in list)
      this.props.markers.filter(place =>
      place.title.toLowerCase().includes(query)
      )
      .map(place => (place.setVisible(true)));
  }

  //Open infowindow if id from click on marker matches in array of markers
  //and close all others if not match to id for the rest in array
  openWindow = (id) => {
    this.props.markers.map(marker => {
      if (marker.id === id) {
        window.google.maps.event.trigger(marker,"click")
      } else {marker.infoWindow.close(this.map,marker)}
    })
  }
  
  //perform marker bounce with timeout if clicked
  //https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
  bounceMarker = (id) => {
    this.props.markers.map(marker => {
      if (marker.id === id) {
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function(){marker.setAnimation(null);},3000);
      }
    })
  }
  
  menuToggle = () => {
    this.setState({menuOpen: !this.state.menuOpen})
    //console.log("state: "+this.state.menuOpen);
  }
  
  render() {
    console.log({...this.props})
    let navBarStyle = {width:this.state.menuOpen ? "325px" : "0"}
    let navClassName = this.state.menuOpen ? "fa fa-bars" : "fa fa-close"
    return (
      <div>
          <header className ="navbar">
            <div id = "navbar-text">Neighborhood Breweries
              <i
                className = {navClassName}
                aria-label="hide venues"
                role="button"
                aria-pressed="false"
                tabIndex="0"
                onClick={this.menuToggle} onKeyPress={this.menuToggle}
              >
              </i>
            </div>
          </header>
      
      <div className="sidebar" tabIndex="-1" style = {navBarStyle}>
      
        <div className="sidebar-content" tabIndex="-1">
          <input
            type={"search"}
            id={"search"}
            placeholder={"Filter Locations Below"}
            role={"search"}
            aria-label={"searchfield"}
            value={this.state.value}
            onChange={(event) => this.updateQuery(event.target.value)}
          />
          <ol className="venue-list">
            {this.state.query &&
             this.state.filteredSearch.map(location => (
              <li className="venue-name" tabIndex="0" key={location.venue.id}
                onClick={() => {
                  this.openWindow(location.venue.id);
                  this.bounceMarker(location.venue.id)
                }}
              >
                {location.venue.name}
                <div className="venue-address">
                  <p>
                    {location.venue.location.formattedAddress[0]}
                  </p>
                  <p>
                    {location.venue.location.formattedAddress[1]}
                  </p>
                </div>
              </li>
              ))
            }
            {!this.state.query && 
              this.props.locationNames.map(location => (
              <li className="venue-name" tabIndex="0" key={location.venue.id}
                onClick={() => {
                  this.openWindow(location.venue.id);
                  this.bounceMarker(location.venue.id)
                }}
              >
                {location.venue.name}
                <div className="venue-address">
                  <p>
                    {location.venue.location.formattedAddress[0]}
                  </p>
                  <p>
                    {location.venue.location.formattedAddress[1]}
                  </p>
                  {/*} {location.testPhoto.id}
                  <p>{location.testPhoto.prefix+`width200`+location.testPhoto.suffix}
                  {location.newPhoto[0].prefix+`width200`+location.newPhoto[0].suffix}
                  </p>
                  */}
                </div>
              </li>
              ))
            }
            
          {/*}
            {this.props.locationNames.map(location => (<li>{location.testPhoto.id}</li>))}
          */}
          
          </ol>
        </div>
      </div>
</div>
    );
  }
}

export default Sidebar;