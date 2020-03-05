(function() {
  console.log("demo.js");
})();

var year = document.getElementById("year");
year.innerText = (new Date()).getFullYear().toString();