function typeform(id, formId) {
  return $("<iframe>", {
    src: "https://blackdoor.typeform.com/to/" + formId + window.location.search,
    id:  id,
    width: "100%",
    height: "100%",
    frameborder: 0
  });
};

function initTypeform(formId) {
  typeform("typeform-full", formId).appendTo("#typeform-container");
  $.getScript("https://s3-eu-west-1.amazonaws.com/share.typeform.com/embed.js");
}

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

function BRCMap() {
  return {
    center: new google.maps.LatLng(40.7853306,-119.2130828),
    zoom: 16,

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
  $("#request-form-trigger").click(function() {
    console.log("test");
    $("#request-form").modal();
    initTypeform("HhhOAN");
  });
}
