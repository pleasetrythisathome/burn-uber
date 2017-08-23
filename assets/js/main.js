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

$(document).ready(function(){
  initTypeform("jfPC2R");
});
