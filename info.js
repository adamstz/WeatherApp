// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//https://api.tomtom.com/search/2/search/Benton%20Hall%20in%20Oxford%20Ohio.json?limit=1&lat=39.5070&lon=-84.7452&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=all&key=uihEdPGAe1ZOsPCkVP6aiAk2fFcefTdQ;
//https://api.openweathermap.org/data/2.5/forecast?lat=39.5070&lon=-84.7452&units=imperial&appid=8ea202ee92c6ca06bec7a160a3a3deb1
const firebaseConfig = {
	apiKey: "AIzaSyAGXlyekdqpPy_Gra6lByUCfXhBLhhhp4Q",
  authDomain: "weatherapp-818b4.firebaseapp.com",
  projectId: "weatherapp-818b4",
  storageBucket: "weatherapp-818b4.appspot.com",
  messagingSenderId: "31493056498",
  appId: "1:31493056498:web:5aede3ee8d2eb6647dad6b",
  measurementId: "G-S34DTJSRW6"
  };
  
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var TomTomAPIKey="uihEdPGAe1ZOsPCkVP6aiAk2fFcefTdQ";
var WeatherAPIKey = "8ea202ee92c6ca06bec7a160a3a3deb1";
var date;
var mapLocation;
var lat;
var lon;
var minTemp;
var maxTemp;
var visibility;
var humidity;
var icon;
var mapJson;
var weatherJson;
var mapData = [];
var weatherData = [];
var mapLocations = [];

$(document).ready(function() {
	$("tbody").on("click",'tr',function() {
		$('#selectedEntry').empty();
		let i = $(this).attr("id");
		i = i.replace('h',''); 
		$('#selectedEntry').append("<div class='row entry' id='selectedEntryRow'></div>");
		$('#selectedEntryRow').append("<div class='col' id= 'firstCol'></div>");
		$('#firstCol').append("<p> Location: "+ mapLocations[i]+"</p>");
		$('#firstCol').append("<p> Lat: "+ mapData[i].lat+"</p>");
		$('#firstCol').append("<p> Lat: "+ mapData[i].lon+"</p>");
		$('#firstCol').append("<p> Date: "+ weatherData[i].date+"</p>");
		$('#firstCol').append("<p> Min Temp: "+weatherData[i].minTemp+"\u00B0</p>");
		$('#firstCol').append("<p> Max Temp: "+weatherData[i].maxTemp+"\u00B0</p>");
		$('#firstCol').append("<p> Visibility: "+weatherData[i].visibility+" meters</p>");
		$('#firstCol').append("<p> Humidity: "+weatherData[i].humidity+"%</p>");
		$('#selectedEntryRow').append("<div class='col weatherImage' id= 'secondCol'></div>");
		$('#secondCol').append("<i><img src='http://openweathermap.org/img/wn/"+weatherData[i].icon+"@2x.png'></img></i>");
	 });
  });


function getEntries() {
	/*
	//http://172.17.13.227//final.php?method=getWeather&date=YYYY-MM-DD
	let URL = "http://172.17.13.227/final.php?method=getLookup&date=";
	let count = $("#countEntry").val();
	let datePick = $("#dateEntry").val();
	a=$.ajax({
		url: URL + "&count="+ count + "&date=" + datePick,
		method: "GET"
	}).done(function(data) {
		mapData = [];
		weatherData = [];
		$('tbody').empty();
		
		for(let i = 0; i < count; i++){
			mapData.push(JSON.parse(data.message[i].MapJson));
			weatherData.push(JSON.parse(data.message[i].WeatherJson));
			mapLocations.push(data.message[i].Location);
;
			$('tbody').append("<tr id="+i+"h><td>"+new Date(data.message[i].DateTime).getFullYear()+"-"+
			new Date(data.message[i].DateTime).getMonth()+"-"+ new Date(data.message[i].DateTime).getDate()+
			"</td><td>"+new Date(data.message[i].DateTime).getHours()+":"+new Date(data.message[i].DateTime).getMinutes()+"</td><td>"+data.message[i].Location+"</td><td>"+
			mapData[i].lat+"</td><td>"+mapData[i].lon+"</td><td>Date: "+weatherData[i].date+"</td><td>Min: "
			+weatherData[i].minTemp+"</td><td>Max: "+weatherData[i].maxTemp+"</td><td>Visibility: "+weatherData[i].visibility+"</td><td>Humidity: "
			+weatherData[i].humidity+"</td></tr>");
		}
		

	}).fail(function(error) {
		console.log("error, most likely no values on this date",error.statusText);
		//$("#log").prepend("df error "+new Date()+"<br>");
	});
	*/
	let count = $("#countEntry").val();
  let datePick = $("#dateEntry").val(); // assuming this is a date string
  let date = new Date(datePick); 

  db.collection('WeatherData')
    // Retrieve entries after a certain date
    .where('DateTime', '>=', firebase.firestore.Timestamp.fromDate(date))
    .orderBy('DateTime') // Order by date
    .limit(count) // Limit number of retrieved documents
    .get()
    .then((querySnapshot) => {
      mapData = [];
      weatherData = [];
      $('tbody').empty();

      querySnapshot.forEach((doc) => {
        let data = doc.data();

        let dateTime = data.DateTime.toDate(); // Convert Firestore timestamp to JavaScript date
        let mapJson = JSON.parse(data.MapJson);
        let weatherJson = JSON.parse(data.WeatherJson);

        mapData.push(mapJson);
        weatherData.push(weatherJson);
        mapLocations.push(data.Location);

        $('tbody').append("<tr id="+i+"h><td>"+dateTime.getFullYear()+"-"+
        dateTime.getMonth()+"-"+ dateTime.getDate()+
        "</td><td>"+dateTime.getHours()+":"+dateTime.getMinutes()+"</td><td>"+data.Location+"</td><td>"+
        mapJson.lat+"</td><td>"+mapJson.lon+"</td><td>Date: "+weatherJson.date+"</td><td>Min: "
        +weatherJson.minTemp+"</td><td>Max: "+weatherJson.maxTemp+"</td><td>Visibility: "+weatherJson.visibility+"</td><td>Humidity: "
        +weatherJson.humidity+"</td></tr>");
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
function getLatLon() {
	let URL = "https://api.tomtom.com/search/2/search/";
	mapLocation = $("#searchEntry").val();
	mapLocation = encodeURIComponent(mapLocation);
	a=$.ajax({
		url: URL + mapLocation + 
		".json?limit=1&lat=39.5070&lon=-84.7452&minFuzzyLevel=1&maxFuzzyLevel=2&view=Unified&relatedPois=all&key="
		+ TomTomAPIKey,
		method: "GET"
	}).done(function(data) {
		lat = data.results[0].position.lat;
		lon = data.results[0].position.lon;
		mapJson = {"lat":lat, "lon":lon}
		getForecast(lat,lon);

	}).fail(function(error) {
		console.log("error",error.statusText);
		//$("#log").prepend("df error "+new Date()+"<br>");
	});
}

function getForecast(lat,lon) {
	let URL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=";
	a=$.ajax({
		url: URL + lat + "&lon=" + lon + "&appid=" + WeatherAPIKey,
		method: "GET"
	}).done(function(data) {
		
		const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		let entriesLength = data.list.length;
		$('#entries').empty();
		for(let i =0; i < entriesLength; i++){
			if(date == null){
				$('#entries').append("<div class='row dayofweek'>"+weekday[new Date(data.list[i].dt_txt).getDay()]+"</div>");
			}
			else if(date != weekday[new Date(data.list[i].dt_txt).getDay()]){
				$('#entries').append("<div class='row dayofweek'>"+weekday[new Date(data.list[i].dt_txt).getDay()]+"</div>");
			}
			date = weekday[new Date(data.list[i].dt_txt).getDay()];
			minTemp = data.list[i].main.temp_min;
			maxTemp = data.list[i].main.temp_max;
			visibility = data.list[i].visibility;
			humidity = data.list[i].main.humidity;
			icon = data.list[i].weather[0].icon;
			weatherJson = {'date':data.list[i].dt_txt, 'minTemp':minTemp, 'maxTemp':maxTemp,
							'visibility':visibility, 'humidity':humidity, 'icon':icon}
			storeEntry();
			$('#entries').append("<div class='row entry' id='"+i+"'></div>");
			$('#'+i).append("<div class='col' id= "+i+'col1'+"></div>");
			$('#'+i+'col1').append("<p> Date: "+ new Date(data.list[i].dt_txt).toLocaleString()+"</p>");
			$('#'+i+'col1').append("<p> Min Temp: "+minTemp+"\u00B0</p>");
			$('#'+i+'col1').append("<p> Max Temp: "+maxTemp+"\u00B0</p>");
			$('#'+i+'col1').append("<p> Visibility: "+visibility+" meters</p>");
			$('#'+i+'col1').append("<p> Humidity: "+humidity+"%</p>");
			$('#'+i).append("<div class='col weatherImage' id= "+i+'col2'+"></div>");
			$('#'+i+'col2').append("<i><img src='http://openweathermap.org/img/wn/"+icon+"@2x.png'></img></i>");
		}
		
	}).fail(function(error) {
		console.log("error",error.statusText);
		//$("#log").prepend("df error "+new Date()+"<br>");
	});

}
function storeEntry(){
	/* OLD CODE
	let URL = "http://172.17.13.227/final.php?method=setWeather";
	
	let query = "&location=" + mapLocation + "&mapJson=" + JSON.stringify(mapJson) + "&weatherJson=" + JSON.stringify(weatherJson);
	a=$.ajax({
		url: URL + query,
		method: "GET"
	}).done(function(data) {
		
	}).fail(function(error) {
		console.log("error",error.statusText);
		//$("#log").prepend("df error "+new Date()+"<br>");
	
	});
	*/
	db.collection('WeatherData').add({
		DateTime: firebase.firestore.Timestamp.fromDate(new Date()), // current time
		Location: mapLocation,
		MapJson: JSON.stringify(mapJson),
		WeatherJson: JSON.stringify(weatherJson)
	  })
	  .then((docRef) => {
		console.log("Document written with ID: ", docRef.id);
	  })
	  .catch((error) => {
		console.error("Error adding document: ", error);
	  });
}