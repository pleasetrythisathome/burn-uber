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

function initGoogleMap(el, center) {
  var embed = $("<iframe>", {
    src: "https://www.google.com/maps/d/embed?mid=1w25_ugthwsCoMaeNOn1nAjOsz20",
    id:  "google-map",
    width: "100%",
    height: "100%",
    marginwidth: 0,
    marginheigth: 0,
    frameborder: 0,
    scrolling: "no"
  });
  el.html(embed);
}
