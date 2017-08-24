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

function BRCMap() {
  return {
    center: theMan,
    zoom: 14,

  }
}

var tryAPIGeolocation = function(onSuccess) {
	$.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDDEwZnUm3V2TuTI2hUcWiN1CFaKAcpVXQ", function(success) {
    console.log("API Geolocation success!", success);
		onSuccess.call(this, {coords: {latitude: success.location.lat, longitude: success.location.lng}});
  })
  .fail(function(err) {
    console.log("API Geolocation error!", err);
  });
};

var browserGeolocationSuccess = function(onSuccess, position) {
	console.log("Browser geolocation success!", position);
  onSuccess.call(this, position);
};

var browserGeolocationFail = function(onSuccess, error) {
  switch (error.code) {
    case error.TIMEOUT:
      console.log("Browser geolocation error !\n\nTimeout.");
      break;
    case error.PERMISSION_DENIED:
      if(error.message.indexOf("Only secure origins are allowed") == 0) {
        tryAPIGeolocation(onSuccess);
      }
      break;
    case error.POSITION_UNAVAILABLE:
    console.log("Browser geolocation error !\n\nPosition unavailable.");
      break;
  }
};

var tryGeolocation = function(onSuccess) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
    	browserGeolocationSuccess.bind(this, onSuccess),
      browserGeolocationFail.bind(this, onSuccess),
      {maximumAge: 50000, timeout: 20000, enableHighAccuracy: true});
  }
};

function updateUserLocation(map) {
  tryGeolocation(function(location) {
    map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
  });
}

function initCenterMarker(map) {
  var image = 'http://maps.google.com/mapfiles/ms/micons/blue.png';
  var marker = new google.maps.Marker({
    position: map.getCenter(),
    image: image,
    map: map
  });
  map.addListener('center_changed', function() {
    marker.setPosition(map.getCenter());
  });
  return marker;
}

function initBurnerUber(id) {
  var map = initGoogleMap("map-canvas", BRCMap());
  var marker = initCenterMarker(map);
  updateUserLocation(map);
  $("#request-form-trigger").click(function() {
    $("#request-form").modal();
    var hiddenFields = {
      lat: map.getCenter().lat(),
      lng: map.getCenter().lng()
    };
    console.log(hiddenFields);
    typeform("typeform-full", "HhhOAN", hiddenFields)
      .appendTo("#typeform-container");
  });
}
