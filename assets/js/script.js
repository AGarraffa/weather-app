

// setting up the openweathermap url
const key = 'e1eb99be58f229feb0f00b803ac936d3';
let apiUrl = 'https://api.openweathermap.org/';
let city = '';
let state = '';
let country = '';

// populate the state dropdown with state codes
let form = document.getElementById('form')
let stateEl = document.getElementById('states');
let countryEl = document.getElementById('countries');
const submitBtn = document.getElementById('submit-btn');

// applies the search history from memory to this variable
let recentCity = JSON.parse(localStorage.getItem('searchHistory'));

// if there is no history, initialize as an array
if (recentCity === null) {
  recentCity = [];
}

// Iterate over object and add options to select
//states
for (let i = 0; i < stateData.length; i++) {
    let option = document.createElement('option')

    stateEl.appendChild(option)
    
    option.setAttribute('class', 'state-choice')
    option.textContent = stateData[i].code;
    option.value = i+1; 
}

//countries
for (let i = 0; i < countryData.length; i++) {
    let option = document.createElement('option')

    countryEl.appendChild(option)
    
    option.textContent = countryData[i].name;
    option.value = i;
}


renderHistory();

// I moved the US to the first option; when I tried to have it as the default, I couldn't figure out how to get the states back when they were hidden/not displayed
function hideState(Id, element)
{
    document.getElementById(Id).style.display = element.value == 1 ? 'block' : 'none';
}


// execute app on submit
submitBtn.addEventListener('click', function(event) {
    
    event.preventDefault();

    // assigns input values to be used in geocoding
    city = document.querySelector('#city').value;
    state = stateEl[stateEl.selectedIndex].textContent; 
    country = countryToCode(countryEl[countryEl.selectedIndex].textContent);

    // clears the state variable if no state is selected or if you didn't choose USA
    if ((state === 'State') || (country != 'United States of America')) {
      state = '';
    }

    getLatLon();

  });


  // identifies the country code of the selected country
  function countryToCode (entry) {

    let code = countryData.find(element => element.name === entry)
    return code.alpha2;

  }

  // gets the lat and long of the selected location
  function getLatLon() {

    let geoUrl = `${apiUrl}geo/1.0/direct?q=${city},${state},${country}&*limit=1&appid=${key}`;



    fetch (geoUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {

        let lat = data[0].lat;
        let lon = data[0].lon;
        

        let lastCity = {
          name: city,
          lat: lat,
          lon: lon
        }

        // if recentCity is null, it will populate with lastCity
        if (!recentCity) {

          recentCity = lastCity;

        }

        // if/else adds the last city to the search history but keeps it capped at 10 entries
        else if (recentCity.length <= 9) {

          recentCity.unshift(lastCity);
        
        }

        else {

          recentCity.unshift(lastCity);
          recentCity.pop();

        }

        renderHistory();

        // sends the recentCity array to local storage.
        localStorage.setItem('searchHistory', JSON.stringify(recentCity));


        getWeather(lat, lon);

      })

  }

// gets the weather for the geocoded lat/lon
  function getWeather(x, y) {

    let weatherUrl = `${apiUrl}data/2.5/onecall?lat=${x}&lon=${y}&exclude=minutely,hourly&units=imperial&appid=${key}`

    fetch(weatherUrl)
    .then(function(response){
      return response.json();
    })
    .then(function(data){

      let current = data.current;
      let daily = data.daily;

      renderCurrentWeather(current, daily);
      renderForecast(daily)
    })

  }

// renders the current weather on screen
function renderCurrentWeather(current, forecast) {
  
    let hiddenEl = document.querySelectorAll('.hidden');

    for (var i = 0; i < hiddenEl.length; i++) {
      
      hiddenEl[i].style.display = 'block'
      

    }


  document.getElementById('current-temp').textContent = current.temp;

  document.getElementById('feels-like').textContent = current.feels_like;
  
  document.getElementById('high').textContent = forecast[0].temp.max;

  document.getElementById('low').textContent = forecast[0].temp.min;

  document.getElementById('humidity').textContent = current.humidity;

  document.getElementById('dew-point').textContent = current.dew_point;

  document.getElementById('uvi').textContent = current.uvi;

  document.getElementById('wind').textContent = `${current.wind_speed}mph @ ${current.wind_deg} degrees`;

  document.getElementById('desc').textContent = current.weather[0].description;

  document.getElementById('current-icon').src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`

}


// renders the forecast
function renderForecast(forecast) {


  for (let i = 1; i < forecast.length; i++) {
      
      document.getElementById(`day${i}-high`).textContent = forecast[i].temp.max;

      document.getElementById(`day${i}-low`).textContent = forecast[i].temp.min;

      document.getElementById(`day${i}-humidity`).textContent = forecast[i].humidity;

      document.getElementById(`day${i}-dew-point`).textContent = forecast[i].dew_point;

      document.getElementById(`day${i}-uvi`).textContent = forecast[i].dew_point;

      document.getElementById(`day${i}-wind`).textContent = `${forecast[i].wind_speed}mph @ ${forecast[i].wind_deg} degrees`;

      document.getElementById(`day${i}-desc`).textContent = forecast[i].weather[0].description

      document.getElementById(`day${i}-icon`).src = `http://openweathermap.org/img/wn/${forecast[i].weather[0].icon}@2x.png`
  }


}

// renders the search history
function renderHistory(){
  
    for (let i = 0; i < recentCity.length; i++) {
 

    document.getElementById(`city${i}`).textContent = recentCity[i].name;
    document.getElementById(`city${i}`).value = recentCity[i].name;
    document.getElementById(`city${i}`).style.visibility = 'visible';
    
    }
  }
  

//TODO
// make the search history clickable to get the weather for that city
// style style style

// Things to do if there's time:
// add imperial measurements to the api call (or a drop down with c or f)
// add some flare to the page

