function fn() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("main").innerHTML = this.responseText;
    }
  };
  xhttp.open("GET", "main.html", true);
  xhttp.send();
}

document.addEventListener('DOMContentLoaded', fn, false);