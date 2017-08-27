var map,
    directionsService,
    directionsDisplay,
    centerMarker,
    geoMarker,
    startMarker,
    destination,
    destinationLocation;

var camps,
    art,
    facilities;

var theMan = new google.maps.LatLng(40.78660, -119.20660);

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

function toRad(n) {
 return n * Math.PI / 180;
};

function toDeg(n) {
 return n * 180 / Math.PI;
};

function toMeters(n) {
  return n * 0.3048;
}

function toFeet(n) {
  return n * 3.28084;
}

/*!
 * JavaScript function to calculate the destination point given start point latitude / longitude (numeric degrees), bearing (numeric degrees) and distance (in m).
 *
 * Original scripts by Chris Veness
 * Taken from http://movable-type.co.uk/scripts/latlong-vincenty-direct.html and optimized / cleaned up by Mathias Bynens <http://mathiasbynens.be/>
 * Based on the Vincenty direct formula by T. Vincenty, “Direct and Inverse Solutions of Geodesics on the Ellipsoid with application of nested equations”, Survey Review, vol XXII no 176, 1975 <http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf>
 */

function destVincenty(lat1, lon1, brng, dist) {
 var a = 6378137,
     b = 6356752.3142,
     f = 1 / 298.257223563, // WGS-84 ellipsiod
     s = dist,
     alpha1 = toRad(brng),
     sinAlpha1 = Math.sin(alpha1),
     cosAlpha1 = Math.cos(alpha1),
     tanU1 = (1 - f) * Math.tan(toRad(lat1)),
     cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1)), sinU1 = tanU1 * cosU1,
     sigma1 = Math.atan2(tanU1, cosAlpha1),
     sinAlpha = cosU1 * sinAlpha1,
     cosSqAlpha = 1 - sinAlpha * sinAlpha,
     uSq = cosSqAlpha * (a * a - b * b) / (b * b),
     A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
     B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
     sigma = s / (b * A),
     sigmaP = 2 * Math.PI;
 while (Math.abs(sigma - sigmaP) > 1e-12) {
  var cos2SigmaM = Math.cos(2 * sigma1 + sigma),
      sinSigma = Math.sin(sigma),
      cosSigma = Math.cos(sigma),
      deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
  sigmaP = sigma;
  sigma = s / (b * A) + deltaSigma;
 };
 var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1,
     lat2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1, (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)),
     lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1),
     C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha)),
     L = lambda - (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM))),
     revAz = Math.atan2(sinAlpha, -tmp); // final bearing
 return new google.maps.LatLng(toDeg(lat2), lon1 + toDeg(L));
};

function distanceBetweenLocations(lat1, lon1, lat2, lon2) {
  var R = 6371e3; // metres
  var φ1 = toRad(lat1);
  var φ2 = toRad(lat2);
  var Δφ = toRad(lat2-lat1);
  var Δλ = toRad(lon2-lon1);

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

function parseAddress(address) {
  var parsed = address.match("(.*):(.*) and (.*)");
  return {
    time: parseInt(parsed[1]) + parseInt(parsed[2]) / 60,
    street: parsed[3]
  }
}

var streets = [
  "Esplanade",
  "Awe",
  "Breath",
  "Ceremony",
  "Dance",
  "Eulogy",
  "Fire",
  "Genuflect",
  "Hallowed",
  "Inspirit",
  "Juju",
  "Kundalini",
  "Lustrate",
];

function distanceFromMan(street) {
  var index = streets.indexOf(street);
  return toMeters(2500 + index * 240 + (index > 0 ? 200 : 0));
}

function timeToBearing(time) {
  return (time + 1.5) / 12 * 360;
}

function campLocation(name) {
  var camp = camps[name];
  var location = parseAddress(camp.address);
  return destVincenty(theMan.lat(), theMan.lng(), timeToBearing(location.time), distanceFromMan(location.street));
}

var destination;

function setDestination(name, location) {
  destination = {
    name: name,
    location: location
  };
  console.log(destination);
}

function initDestinationInput(map, onDestination) {
  $.when(
    $.getJSON("/assets/data/camps2017.min.json", function(data) {
      camps = _.object(_.map(data, _.accessor("camp")),
                       data);
    }),
    $.getJSON("/assets/data/art-installations.json", function(data) {
      art = data;
    }),
    $.getJSON("/assets/data/brc-facilities.json", function(data) {
      facilities = data;
    }),
  ).then(function() {
    $("#destination-input").autocomplete({
      data: _.mapObject(_.extend({},
                                 camps,
                                 art,
                                 facilities),
                        _.constant(null)),
      limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
      onAutocomplete: function(val) {
        if (camps[val]) {
          var camp = camps[val];
          setDestination(camp.camp, camp.address);
          onDestination(campLocation(val));
        } else {
          var coords = _.extend({},
                                art,
                                facilities)[val];
          var location = new google.maps.LatLng(coords[1], coords[0]);

          setDestination(val, [location.lat(), location.lng()].join(","));
          new google.maps.Marker({
            position: location,
            icon: "/assets/images/blue-dot.png",
            map: map
          });
          onDestination(new google.maps.LatLng(coords[1], coords[0]));
        }
      },
      minLength: 1,
    });
  });
}

function showDestinationInput() {
  $("#destination-wrapper").show(500);
  $("#destination-input").focus();
}

function hideDestinationInput() {
  $("#destination-wrapper").hide(500);
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
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(start);
      bounds.extend(end);
      setTimeout(function() {
        map.fitBounds(bounds)
      }, 0);
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
    icon: "/assets/images/blue-dot.png",
    map: map
  });
}

function showLanding() {
  var landing = $("#landing");
  landing.modal();
  landing.modal("open");
  landing.click(closeLanding);
  setTimeout(closeLanding, 4000);
}

function closeLanding() {
  $("#landing").modal("close");
}

function initBurnerUber() {
  map = initGoogleMap("map-canvas", BRCMap());
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({map: map});
  centerMarker = initCenterMarker(map);
  geoMarker = initGeolocation(map);
  google.maps.event.addListener(centerMarker, 'click', function() {
    startMarker = createStartMarker(map);
    centerMarker.setMap();
    showDestinationInput();
  });
  $("#request-form-trigger").click(request.bind(this, map));
  setTimeout(showLanding, 0);
  initDestinationInput(map, function(location) {
    startMarker.setMap();
    console.log("destination", location.lat(), location.lng());
    showDirections(map, directionsService, directionsDisplay, startMarker.getPosition(),  location);
    hideDestinationInput();
  });
  return map;
}

function request(map) {
  $("#request-form").modal();
  $("#request-form").modal("open");
  var hiddenFields = {
    lat: startMarker && startMarker.getPosition().lat() || map.getCenter().lat(),
    lng: startMarker && startMarker.getPosition().lng() || map.getCenter().lng(),
    destination: destination && destination.name,
    location: destination && destination.location
  };
  console.log("request", hiddenFields);
  typeform("typeform-full", "HhhOAN", hiddenFields)
    .appendTo("#typeform-container");
}
