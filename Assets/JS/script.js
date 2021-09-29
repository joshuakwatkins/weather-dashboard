var cityList = [];
var fiveDay = $("#fiveDay");
var apiKey = "0c4100a3c3b494478634c7e4efeb7808";


// This is the function that prints the weather data to the page
function printWeather(city) {
    // This clears the 5 day forecast so taht there isn't duplicate cards
    $("#fiveDay").html("");
    // this harvests the lat/lon data from the first api call that accepts a string value
    var latLonURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(latLonURL).then(function(response){
        if(response.status !== 200) {
            alert("Please enter a valid city");
            return;
        }
        return response.json()
    }).then(function(data){
        // These variables are used to call the one weather api that has all the data needed but only accepts a lat/lon value.
        var cityLat = data.coord.lat;
        var cityLon = data.coord.lon;
        var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=" + apiKey + "&units=imperial";
        fetch(oneCall).then(function(response){
            return response.json()
        }).then(function(data){
            console.log(data);
               //THIS IS WHERE THE MAGIC HAPPENS WITH THE DATA

            //    this builds the current weather card
               var weatherTodayHeader = $("#weatherTodayTitle");
               var weatherTodayTemp = $("#weatherTodayTemp");
               var weatherTodayWind = $("#weatherTodayWind");
               var weatherTodayHumidiy = $("#weatherTodayHumidity");
               var weatherTodayUV = $("#weatherTodayUV");
               var weatherTodayIcon = $("#weatherTodayIcon");

               weatherTodayHeader.text("Weather for " + city + " " + moment().format("(MM/DD/YY)"));
               weatherTodayTemp.text(data.current.temp);
               weatherTodayWind.text(data.current.wind_speed + " MPH");
               weatherTodayHumidiy.text(data.current.humidity);
               weatherTodayUV.text(data.current.uvi);
               // This if function makes the uv block colored depending on the exposure.
               if (data.current.uvi <= 3){
                   weatherTodayUV.attr("style","background-color: green;")

               } else if (data.current.uvi > 3 && data.current.uvi <= 6) {
                   weatherTodayUV.attr("style","background-color: orange;")

               } else {
                   weatherTodayUV.attr("style","background-color: red;")

               }
              weatherTodayIcon.attr("src","http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
            //   this forloop builds the 5 day forcast
              for (var i=0; i<5; i++) {

                  var forecastCard = $('<div>').attr({
                      class: "card text white bg-secondary m-2 p-1 col-2",
                      style: "max-width: 14rem; min-width: 8rem;"
                  });

                  var forecastDate = $('<div>').attr({
                      class: "card-header text-white",
                      id: "#forecastDate"
                  }).text(moment().add((i + 1),'days').format("MM/DD/YY"));

                  var cardBody = $('<div>').attr({
                      class: "card-body"
                  });

                  var forecastIcon = $('<img>').attr({
                      src: "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png",
                      id: "forecastIcon"
                  }) 

                  var forecastTemp = $('<p>').attr({
                      class: "card-text text-white",
                      id: "forecastTemp"
                  }).text("Temp: " + data.daily[i].temp.day);

                  var forecastWind = $('<p>').attr({
                      class: "card-text text-white",
                      id: "forecastWind"
                  }).text("Wind: " + data.daily[i].wind_speed + " MPH")

                  var forecastHumidity = $('<p>').attr({
                      class: "card-text text-white",
                      id: "forecastHumidity"
                  }).text("Humidity: " + data.daily[i].humidity)

                  forecastCard.append(forecastDate);
                  forecastCard.append(cardBody);
                  cardBody.append(forecastIcon);
                  cardBody.append(forecastTemp);
                  cardBody.append(forecastWind);
                  cardBody.append(forecastHumidity);
                  fiveDay.append(forecastCard);
              };
            })
        })
    }

// This writes the city list from storage to the page as clickable buttons that return the results for their cities
function writeCityList() {
    // debugger;
    cityList = JSON.parse(localStorage.getItem("cityList"))
    if (cityList === null) {
        cityList = [];
    }
    if (cityList !== null) {
        $("#citylist").empty();
        while (cityList.length > 8) {
            cityList = JSON.parse(localStorage.getItem("cityList"))
            cityList.pop();
            localStorage.setItem("cityList", JSON.stringify(cityList))
        }
        if (cityList !== null) {
            for (var i=0; i < cityList.length; i++) {
                var citySearchBtn = $('<button>').attr({
                    class: "btn btn-secondary col-12 my-2 histBtn",
                    type: "city",
                    id: "histBtn",
                    city: cityList[i]
                }).text(cityList[i])
                $('#citylist').append(citySearchBtn)
            }
        }
        //this event listener makes the previously searched value buttons clickable and runs the sequence 
        $(".histBtn").on("click", function() {
            $('#fiveday').html("");
            console.log("CLICK")
            var city = $(this).attr("city")
            printWeather(city);
        })
    }
}

// This causes the users input to render the weather on submitting their cities
$("#cityBtn").on("click", function() {
    $("#fiveDay").html("");
    printWeather($("#citySearch").val());
    console.log(cityList);
    //This variable and if function make sure that there aren't any duplicates in the button list or in the array of previously searched cities.
    if (cityList !== null) {
        var cityValue = cityList.indexOf($('#citySearch').val())
        if (cityValue == -1) {
            cityList.unshift($("#citySearch").val())
            localStorage.setItem("cityList", JSON.stringify(cityList))
            console.log('this log is in the array validated unshift and write')
        }
    }
    writeCityList();
})


function init() {
    writeCityList()
    localStorage.setItem("butt","hole");
}

init();