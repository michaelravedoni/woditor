function pagedjs() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://unpkg.com/pagedjs/dist/paged.polyfill.js";
  document.getElementsByTagName("head")[0].appendChild(script);
}
window.onload = function () {
  /* render pagedjs after page loading (set timeout if necessary) */
  setTimeout(pagedjs, 0);
}
