var cityList = [];
var fiveDay = $("#fiveDay");
var apiKey = "0c4100a3c3b494478634c7e4efeb7808";
// var city = "atlanta";
// var today = moment()

function printWeather(city) {
    var latLonURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(latLonURL).then(function(response){
        if(response.status !== 200) {
            alert("Please enter a valid city");
            return;
        }
        return response.json()
    }).then(function(data){
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
              weatherTodayIcon.attr("src","http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
            //   this forloop builds the 5 day forcast
              for (var i=0; i<5; i++) {
                  console.log("this is the start of my for loop")

                  var forecastCard = $('<div>').attr({
                      class: "card text white bg-secondary m-2 p-1 col-2",
                      style: "max-width: 14rem"
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
                  console.log("this is my for loop");
              };
            })
        })
    }

// printWeather()


function writeCityList() {
    if (cityList !== null) {
        $("#citylist").empty();
        while (cityList.length > 8) {
            cityList = json.parse(localStorage.getItem("cityList"))
            cityList.pop();
            localStorage.setItem("cityList", JSON.stringify(cityList))
        }
        localStorage.setItem("cityList",JSON.stringify(cityList));
        for (var i=0; i < cityList.length; i++) {
            var citySearchBtn = $('<button>').attr({
                class: "btn btn-secondary col-12 my-2 histBtn",
                type: "city",
                city: cityList[i]
            }).text(cityList[i])
            $('#citylist').append(citySearchBtn)
        }
    }
}

$("#cityBtn").on("click", function() {
    $("#fiveDay").html("");
    printWeather($("#citySearch").val());
    cityList.unshift($("#citySearch").val())
    localStorage.setItem("cityList", JSON.stringify(cityList))
    writeCityList();
})

$(".histBtn").on("click", ".histBtn", function() {
    $('#fiveday').html("");
    var city = $(this).attr("city")
    console.log(city)
})

function init() {
    writeCityList()
}

init();