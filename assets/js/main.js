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

var theMan = new google.maps.LatLng(40.7853306,-119.2130828);
var centerCamp = new google.maps.LatLng(40.7815329,-119.2136077);

function BRCMap() {
  return {
    center: centerCamp,
    zoom: 14,

  }
}

function updateUserLocation(map) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(location) {
      map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
    });
  }
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
