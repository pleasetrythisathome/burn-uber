function typeform(id, formId, hiddenFields) {
  hiddenFields = hiddenFields || {};
  return $("<iframe>", {
    src: "https://blackdoor.typeform.com/to/" + formId + "?" + $.param(hiddenFields),
    id:  id,
    width: "100%",
    height: "100%",
    frameborder: 0
  });
};

function embedMap(el, mapOptions) {
  var map = $("<iframe>", {
    src: "https://www.google.com/maps/d/embed?" + $.param(mapOptions),
    id:  "google-map",
    width: "100%",
    height: "100%",
    marginwidth: 0,
    marginheigth: 0,
    frameborder: 0,
    scrolling: "no"
  });
}

function initGoogleMap(id, mapOptions) {
  return new google.maps.Map(document.getElementById(id), mapOptions);
}

var theMan = new google.maps.LatLng(40.78634768018833, -119.20651392770787);

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}

function distanceBetweenLocations(lat1, lon1, lat2, lon2) {
  var R = 6371e3; // metres
  var φ1 = lat1.toRadians();
  var φ2 = lat2.toRadians();
  var Δφ = (lat2-lat1).toRadians();
  var Δλ = (lon2-lon1).toRadians();

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

function distanceToBRC(lat, lng) {
  return distanceBetweenLocations(theMan.lat(), theMan.lng(), lat, lng);
}

function BRCMap() {
  return {
    center: theMan,
    zoom: 14,

  }
}

function initGeolocation(map) {
  var marker = new GeolocationMarker(map);
  marker.setCircleOptions({fillOpacity: 0.1})
  google.maps.event.addListenerOnce(marker, "position_changed", function() {
    var position = marker.getPosition();
    if (8175 > distanceToBRC(position.lat(), position.lng())) {
      map.setCenter(position);
      map.fitBounds(this.getBounds());
    }
  });
  google.maps.event.addListener(marker, 'geolocation_error', function(e) {
    console.log('There was an error obtaining your position.', e);
  });
  return marker;
}

function showDirections(map, service, display, start, end) {
  var request = {
    avoidHighways: true,
    origin: start,
    destination: end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  service.route(request, function(response, status) {
    if (status === 'OK') {
      display.setDirections(response);
    } else {
      console.log('Directions request failed due to ', status, response);
    }
  });
}

function initCenterMarker(map) {
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: "/assets/images/pickup_location.png",
    map: map,
    zIndex: 1
  });
  map.addListener('center_changed', function() {
    marker.setPosition(map.getCenter());
  });
  return marker;
}

function createStartMarker(map) {
  return new google.maps.Marker({
    position: map.getCenter(),
    icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    map: map
  });
}

function createEndMarker(map) {
  return new google.maps.Marker({
    position: map.getCenter(),
    icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    map: map
  });
}

function showLanding() {
  var landing = $("#landing");
  landing.modal();
  landing.modal("open");
  landing.click(closeLanding);
  setTimeout(closeLanding, 4000);
  $(".button-collapse").sideNav();
}

function closeLanding() {
  $("#landing").modal("close");
}

function request(map) {
  $("#request-form").modal();
  $("#request-form").modal("open");
  var hiddenFields = {
    lat: map.getCenter().lat(),
    lng: map.getCenter().lng()
  };
  console.log(hiddenFields);
  typeform("typeform-full", "HhhOAN", hiddenFields)
    .appendTo("#typeform-container");
}

function initBurnerUber() {
  var map = initGoogleMap("map-canvas", BRCMap());
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
  var centerMarker = initCenterMarker(map);
  var geoMarker = initGeolocation(map);
  var startMarker;
  var endMarker;
  google.maps.event.addListener(centerMarker, 'click', function() {
    if (startMarker) {
      showDirections(map, directionsService, directionsDisplay, startMarker.getPosition(),  map.getCenter());
      centerMarker.setMap();
      startMarker.setMap();
      $("#request-form-trigger").removeClass("disabled");
    } else {
      startMarker = createStartMarker(map);
    }
  });
  $("#request-form-trigger").click(request.bind(this, map));
  setTimeout(showLanding, 0);
}
