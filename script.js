document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city_input');
    const searchBtn = document.getElementById('searchbtn');
    const locationBtn = document.getElementById('locationbtn');
    const apiKey = '7eea46f022ce9ddcc921605096b7dc53';
    currentweathercard = document.querySelectorAll(`.weather-left .card`)[0];
    let fivedayscard = document.querySelector(`.day-forecast`);
    aqicard = document.querySelectorAll(`.highlights .card`)[0];
    sunrisecard = document.querySelectorAll(`.highlights .card`)[1];
    humidityval = document.getElementById(`humidityval`),
    pressureval = document.getElementById(`pressureval`),
    visibilityval = document.getElementById(`visibilityval`),
    windspeedval = document.getElementById(`windspeedval`),
    hourlyforecastcard = document.querySelector(`.hourly-forecast`),
    aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];

    function getWeatherdetails(name, lat, lon, country, state){
        let forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        let weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&cnt={cnt}&appid=${apiKey}&units=metric`
        let air_pollution_url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

        days = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thurs',
            'Fri',
            'Sat'
        ],
        months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ];

        fetch(air_pollution_url).then(res => res.json()).then(data => {
            let {co, no, no2, o3, so2, pm2_5,pm10,nh3} = data.list[0].components;
            aqicard.innerHTML = `
            <div class="card-head">
                <p>Air Quality Index</p>
                <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
            </div>
            <div class="air-indices">
                <i class="fa-regular fa-wind fa-3x"></i>
                <div class="item">
                    <p>PM2.5</p>
                    <h3>${pm2_5}</h3>
                </div>
                <div class="item">
                    <p>PM10</p>
                    <h3>${pm10}</h3>
                </div>
                <div class="item">
                    <p>SO2</p>
                    <h3>${so2}</h3>
                </div>
                <div class="item">
                    <p>Co</p>
                    <h3>${co}</h3>
                </div>
                <div class="item">
                    <p>NO</p>
                    <h3>${no}</h3>
                </div>
                <div class="item">
                    <p>NO2</p>
                    <h3>${no2}</h3>
                </div>
                <div class="item">
                    <p>NH3</p>
                    <h3>${nh3}</h3>
                </div>
                <div class="item">
                    <p>O3</p>
                    <h3>${o3}</h3>
                </div>
            </div>`
        }).catch(() => alert('Failed to fetch AQI Index'))

        fetch(weather_url).then(res => res.json()).then(data => {
            let date = new Date();
            const desc = data.weather[0].description.toLowerCase();

            let bgClass = "";
            if (desc.includes("clear")) bgClass = "clear-sky";
            else if (desc.includes("few") || desc.includes("scattered")) bgClass = "few-clouds";
            else if (desc.includes("broken") || desc.includes("overcast") || desc.includes("clouds")) bgClass = "few-clouds";
            else if (desc.includes("shower") || desc.includes("rain") || desc.includes("drizzle")) bgClass = "rain";
            else if (desc.includes("thunderstorm")) bgClass = "thunderstorm";
            else if (desc.includes("snow") || desc.includes("sleet")) bgClass = "snow";
            else if (desc.includes("mist") || desc.includes("fog") || desc.includes("haze") || desc.includes("smoke") || desc.includes("dust") || desc.includes("ash")) bgClass = "mist";
            else if (desc.includes("tornado") || desc.includes("squall")) bgClass = "extreme";
            else bgClass = "default";

            document.body.className = bgClass;
            currentweathercard.innerHTML = `
            <h2>Current Weather</h2>
            <div class="current-weather">
                            <div class="details">
                                <p>Now</p>
                                <h2>${(data.main.temp).toFixed(2)}&deg;C</h2>
                                <p>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</p>
                            </div>
                            <div id="feels-like">
                                <p>Feels Like</p>
                                <div id="feelslikeval">
                                    <p>${(data.main.feels_like).toFixed(2)}&deg;C</p>
                                </div>
                            </div>
                            <div class="weather-icon">
                                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
                                alt="">
                            </div>
                            <div class="card-footer">
                                <p><i class="fa-light fa-calendar"></i>  ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]}, ${date.getFullYear()}</p>
                                <p><i class="fa-light fa-location-dot"></i>  ${name}, ${country}</p>
                            </div>
                        </div>
            `;
            let {sunrise, sunset} = data.sys,
            {timezone, visibility} = data,
            {humidity, pressure} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
            sunrisecard.innerHTML = `
            <div class="card-head">
                <p>Sunrise & Sunset</p>
            </div>
            <div class="sunrise-sunset">
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunrise fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunrise</p>
                        <h2>${sRiseTime}</h2>
                    </div>
                </div>
                <div class="item">
                    <div class="icon">
                        <i class="fa-light fa-sunset fa-4x"></i>
                    </div>
                    <div>
                        <p>Sunset</p>
                        <h2>${sSetTime}</h2>
                    </div>
                </div>
            </div>
            `;
            humidityval.innerHTML = `${humidity}%`;
            pressureval.innerHTML = `${pressure}hPa`;
            visibilityval.innerHTML = `${visibility/1000}km`;
            windspeedval.innerHTML = `${speed}m/s`;


        }).catch(() => {
            alert('Failed to fetch current weather')
        })

        fetch(forecast_url).then(res => res.json()).then(data => {
            let hourlyforecast = data.list;
            hourlyforecastcard.innerHTML = ``;
            for(i=0; i<=7;i++){
                let hourlyforecastdate = new Date(hourlyforecast[i].dt_txt);
                let hr = hourlyforecastdate.getHours();
                let a = `PM`;
                if(hr < 12) a = `AM`;
                if(hr == 0) hr = 12;
                if(hr > 12) hr = hr-12;
                hourlyforecastcard.innerHTML += `
                <div class="card">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${hourlyforecast[i].weather[0].icon}@2x.png" alt="">
                    <p>${(hourlyforecast[i].main.temp.toFixed(2))}&deg;C</p>
                </div>
                `;
            }
            let uniqueforecastdays = [];
            let fivedays = data.list.filter(forecast => {
                let forecastdate = new Date(forecast.dt_txt).toDateString();
                if(!uniqueforecastdays.includes(forecastdate)){
                    return uniqueforecastdays.push(forecastdate);
                }
            });
        // Extract temps
            
        fetch(forecast_url)
        .then(res => res.json())
        .then(data => {
            const hourlyForecast = data.list.slice(0, 8); 
            const labels = hourlyForecast.map(forecast => {
            const date = new Date(forecast.dt_txt);
            return `${date.getHours()}:00`;
            });
            const tempData = hourlyforecast.slice(0, 8).map(f => f.main.temp);
            const avgTemp = tempData.reduce((a, b) => a + b, 0) / tempData.length;

            let lineColor = '#4caf50';
            let bgColor = 'rgba(76, 175, 80, 0.2)';

            if (avgTemp <= 10) {
                lineColor = '#00bcd4';
                bgColor = 'rgba(0, 188, 212, 0.2)';
            } else if (avgTemp <= 20) {
                lineColor = '#4caf50';
                bgColor = 'rgba(76, 175, 80, 0.2)';
            } else if (avgTemp <= 30) {
                lineColor = '#ff9800';
                bgColor = 'rgba(255, 152, 0, 0.2)';
            } else {
                lineColor = '#f44336';
                bgColor = 'rgba(244, 67, 54, 0.2)';
            }

            const ctx = document.getElementById('tempChart').getContext('2d');
            if (window.tempChart instanceof Chart) {
                window.tempChart.destroy();
            }

            window.tempChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                data: tempData,
                fill: true,
                borderColor: lineColor,
                backgroundColor: bgColor,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: bgColor,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                      ticks: {
                        color: '#000',
                        font: {
                                weight: 'bold'
                        }
                      },
                      grid: {
                        display: false
                      }
                    },
                    y: {
                      ticks: {
                        display: false,
                        font: {
                                weight: 'bold'
                        }
                      },
                      grid: {
                        display: false
                      }
                    }
                },
                plugins: {
                legend: {
                    display: false 
                    },
                tooltip: {
                    callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.raw}°C`;
                    }
                    }
                }
                }
            }
            });
        })
        .catch(error => console.error('Error fetching weather data for chart:', error));
            
    const forecastItems = document.querySelectorAll('.day-forecast .forecast-item');

    fivedays.slice(0, 5).forEach((forecast, index) => {
      let date = new Date(forecast.dt_txt);

      forecastItems[index].innerHTML = `
        <div class="icon-wrapper">
          <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="">
          <span>${forecast.main.temp.toFixed(2)}&deg;C</span>
        </div>
        <p>${date.getDate()} ${months[date.getMonth()]}</p>
        <p>${days[date.getDay()]}</p>
      `;
    });
    }).catch(() => {
                alert('Failed to fetch weather forecast')
            })
    }

    function getCityCoordinates() {
        const cityName = cityInput.value.trim();
        cityInput.value = '';
        if(!cityName) return;
        let Geocoding_url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
        fetch(Geocoding_url).then(res => res.json()).then(data => {
            let {name, lat, lon, country, state} = data[0];
            getWeatherdetails(name, lat, lon, country, state);
        })
        .catch(()=>{alert('Failed to fetch')});

    }

    function showCitySuggestions(query) {
        let searchUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
        fetch(searchUrl)
            .then(res => res.json())
            .then(data => {
                cityDropdown.innerHTML = '';
                if (data.length > 0) {
                    data.forEach(city => {
                        const div = document.createElement('div');
                        div.textContent = `${city.name}, ${city.state ? city.state + ', ' : ''}${city.country}`;
                        div.addEventListener('click', () => {
                            cityInput.value = div.textContent;
                            getWeatherdetails(city.name, city.lat, city.lon, city.country, city.state);
                            cityDropdown.style.display = 'none';
                        });
                        cityDropdown.appendChild(div);
                    });
                    cityDropdown.style.display = 'block';
                } else {
                    cityDropdown.style.display = 'none';
                }
            })
            .catch(() => cityDropdown.style.display = 'none');
    }


    function getUserCoordinates(){
        navigator.geolocation.getCurrentPosition(position => {
            let {latitude, longitude} = position.coords;
            let rev_geocoding_url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
            fetch(rev_geocoding_url).then(res => res.json()).then(data => {
                let {name, country, state} = data[0];
                getWeatherdetails(name, latitude, longitude, country, state);
            }).catch(()=>{
                alert('Failed to fetch user coordinates')
            })
        }, error => {
            if(error.code === error.PERMISSION_DENIED){
                alert('Geolocation Permission Denied, please grant location permission to access')
            }
        })
    }

    cityInput.addEventListener('keyup', (e) => {
        const query = e.target.value.trim();
        if (query.length >= 2) {
            showCitySuggestions(query);
        } else {
            cityDropdown.style.display = 'none';
        }
        if (e.key === 'Enter') {
            getCityCoordinates();
        }
    });

    searchBtn.addEventListener('click', getCityCoordinates);
    locationBtn.addEventListener('click', getUserCoordinates);
    window.addEventListener('load', getUserCoordinates);
});
