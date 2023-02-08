const content = document.getElementById("content");

fetch("http://www.omdbapi.com/?apikey=[71aa02e0]&t=blade+runner")
  .then((response) => response.json())
  .then((data) => console.log(data));
