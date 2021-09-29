
var citySearch = null;

var coords = fetch("https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=0c4100a3c3b494478634c7e4efeb7808")
    .then(response => response.json())
    .then(data => console.log(data))

var lat = coords.data.

