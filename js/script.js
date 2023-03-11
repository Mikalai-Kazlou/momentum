const eGreeting = document.querySelector('.greeting');

// --------------------------------------------------------------------------------
// Date & Time
// --------------------------------------------------------------------------------
const eTime = document.querySelector('.time');
const eDate = document.querySelector('.date');

function showDateTime() {
  const date = new Date();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  eDate.textContent = date.toLocaleDateString('en-US', options);
  eTime.textContent = date.toLocaleTimeString('en-US');

  showGreeting();
  setTimeout(showDateTime, 1000);
}

showDateTime();

// --------------------------------------------------------------------------------
// Greeting
// --------------------------------------------------------------------------------
function showGreeting() {
  const timeOfDay = getTimeOfDay();
  eGreeting.textContent = `Good ${timeOfDay}`;
}

function getTimeOfDay() {
  const hours = new Date().getHours();
  const timesOfDay = [
    'night',
    'morning',
    'afternoon',
    'evening'
  ];

  return timesOfDay[
    Math.floor(hours / 6)
  ];
}

// --------------------------------------------------------------------------------
// Local storage
// --------------------------------------------------------------------------------
const eName = document.querySelector('.name');
const eCity = document.querySelector('.city');

function setLocalStorage() {
  localStorage.setItem('name', eName.value);
  localStorage.setItem('city', eCity.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
  const name = localStorage.getItem('name');
  if (name) {
    eName.value = name;
  }

  const city = localStorage.getItem('city');
  eCity.value = city ? city : 'Minsk';
  getWeather();
}
window.addEventListener('load', getLocalStorage);

// --------------------------------------------------------------------------------
// Image slider
// --------------------------------------------------------------------------------
const eBody = document.querySelector('body');
const eLArrow = document.querySelector('.slide-prev');
const eRArrow = document.querySelector('.slide-next');

let currentBackgroundNumber = getRandomNumber(20);

function getRandomNumber(max) {
  let random = 0;
  while (random === 0) {
    random = Math.ceil(Math.random() * max);
  }
  return random;
}

function setBackground() {
  const timeOfDay = getTimeOfDay();
  const backgroundNumber = currentBackgroundNumber.toString().padStart(2, '0');

  const image = new Image();
  image.src = `./assets/images/${timeOfDay}/${backgroundNumber}.jpg`;
  image.onload = () => {
    eBody.style.backgroundImage = `url('${image.src}')`;
  };
}

function getSlideNext() {
  currentBackgroundNumber++;
  currentBackgroundNumber = (currentBackgroundNumber > 20) ? 1 : currentBackgroundNumber;
  setBackground();
}

function getSlidePrev() {
  currentBackgroundNumber--;
  currentBackgroundNumber = (currentBackgroundNumber < 1) ? 20 : currentBackgroundNumber;
  setBackground();
}

eLArrow.addEventListener('click', getSlidePrev);
eRArrow.addEventListener('click', getSlideNext);

setBackground();

// --------------------------------------------------------------------------------
// Weather
// --------------------------------------------------------------------------------
const eWeatherIcon = document.querySelector('.weather-icon');
const eWeatherMain = document.querySelector('.weather-main');
const eWeatherDescription = document.querySelector('.weather-description');
const eWeatherError = document.querySelector('.weather-error');

const eTemperature = document.querySelector('.temperature');
const eHumidity = document.querySelector('.humidity-value');
const eWind = document.querySelector('.wind-value');

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${eCity.value}&lang=en&appid=40c088c1234a2bc9a5bbf4771d588c40&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  eWeatherIcon.className = 'weather-icon owf';
  eWeatherMain.textContent = '';
  eWeatherDescription.textContent = '';
  eTemperature.textContent = '';
  eWind.textContent = '';
  eHumidity.textContent = '';
  eWeatherError.textContent = '';

  if (data.cod === 200) {
    eWeatherIcon.classList.add(`owf-${data.weather[0].id}`);
    eWeatherMain.textContent = data.weather[0].main;
    eWeatherDescription.textContent = data.weather[0].description;
    eTemperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    eWind.textContent = `${data.wind.speed.toFixed(0)} m/s`;
    eHumidity.textContent = `${data.main.humidity}%`;
  } else {
    eWeatherError.textContent = `${data.cod} ${data.message}`;
  };
}

function setCity() {
  getWeather();
  eCity.blur();
}

eCity.addEventListener('change', setCity);

// --------------------------------------------------------------------------------
// Quotes
// --------------------------------------------------------------------------------
const eQuote = document.querySelector('.quote');
const eAuthor = document.querySelector('.author');
const eRefreshQuote = document.querySelector('.change-quote');
const eWarning = document.querySelector('.warning');

async function getQuoteOfTheDay() {
  const xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const data = JSON.parse(this.responseText);

      eQuote.textContent = data.contents.quotes[0].quote;
      eAuthor.textContent = data.contents.quotes[0].author;
    }
  };

  xhttp.open("GET", "https://quotes.rest/qod.json", true);
  xhttp.send();
}

getQuoteOfTheDay();

function showWarning() {
  if (eWarning.classList.contains('hidden')) {
    eWarning.classList.remove('hidden');
    setTimeout(() => eWarning.classList.add('hidden'), 5000);
  }
}

eRefreshQuote.addEventListener('click', showWarning);

// --------------------------------------------------------------------------------
// Audio player
// --------------------------------------------------------------------------------
import player from './player.js';