require('dotenv').config()
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");

})

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const api = process.env.API_NEW;
  const unit = "metric"

  //Getting live data using openweather API
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + api + "&units=" + unit;

  // making GET request to get data in JSON format
  https.get(url, function(response) {
    console.log(response.statusCode);
    response.on("data", function(data) {

      //parsing the data
      const weatherData = JSON.parse(data)
      const temperature = weatherData.main.temp
      const weatherDescription = weatherData.weather[0].description
      const icon = weatherData.weather[0].icon
      const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

      // sending the data back to the browser
      res.write("<p>The Weather is currently  " + weatherDescription + " </p>");
      res.write("<h1>The temperature in " + query + " is " + temperature + " degree celsius</h1>");
      res.write("<img src=" + imageurl + ">")
      res.send();
    })
  })
})

app.listen(3000, function() {
  console.log("server is running on port 3000.");
})
