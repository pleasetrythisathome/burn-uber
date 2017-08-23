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

function initGoogleMap(el, mapOptions) {
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
  el.html(map);
  return map;
}

function initCenterMarker() {
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
    map: map,
    icon: image,
    zIndex: 10
  });
  return marker;s
}
