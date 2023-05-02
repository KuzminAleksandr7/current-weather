// так, як поточного часу dt в json за адресою 5 рядка немає, а
// в адресі 4 рядка немає погодинного масиву данних використав обидвa JSON

let weather_now = "https://api.openweathermap.org/data/2.5/weather?q=Kyiv&appid=67c49f37eded9736eb9e0dfb13c7aae2&lang=ua&units=metric";
let weather_forecast = "https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&appid=67c49f37eded9736eb9e0dfb13c7aae2&lang=ua&cnt=6&units=metric";
let dateNow;
let dateForec;

weatherNow(weather_now);
weatherForecast(weather_forecast);

function weatherNow(weather_now) {
    $.ajax({
        url: weather_now,
        dataType: "json",
    }).done(function (data) {
        console.log(data);
        $("#city").html(data.name);

        // в дужках сумма часу за юнікс-таймом та часовим поясом(*1000 для коректної роботи необхідно додати мілісекунди)
        dateNow = new Date((data.dt + data.timezone) * 1000);

        // для того, щоб не враховувався мій часовий пояс при пошуку інших міст з іншим часовим поясом використав UTC
        // місяці йдуть масивом, тому +1
        $("#date").html(dateNow.getUTCDate() + "." + (dateNow.getUTCMonth() +1) + "." + dateNow.getUTCFullYear());
        $("#weather-now").html(data.weather[0].description);

        // використав посилання на картинки з сайту Weather
        // витягуючи з json "data.weather[0].icon" отримую id іконки і вставляю в шлях img
        $("#now_body_left_icon").html(`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`);
        $("#now_body_left_temp").html(Math.round(data.main.temp) + "&deg;C");
        $("#now_body_right_min").html(Math.round(data.main.temp_min) + "&deg;C");
        $("#now_body_right_max").html(Math.round(data.main.temp_max) + "&deg;C");
        $("#now_body_right_wind").html(Math.round(data.wind.speed) + "km/h");
    }).fail(function () {

        // при помилці поверх всього стає моє вікно
        $(".error-window").css("display", "flex");
    });
}

function weatherForecast(weather_forecast) {
    $.ajax({
        url: weather_forecast,
        dataType: "json",
    }).done(function (data) {
        console.log(data);

        // циклом додаю HTML
        // змінна і = масиву json
        for(let i=0; i<=data.cnt-1; i++){
            dateForec = new Date((data.list[i].dt + data.city.timezone) * 1000);
            $("#weather_forecast_body").append(`<div id='forecast-elem${1+i}' class="forecast-elem"></div>`);
            $(`#forecast-elem${1+i}`).append(`<div id='elem-time${1+i}' class="elem-time">` + dateForec.getUTCHours() + ":00" + "</div>");
            $(`#forecast-elem${1+i}`).append(`<div id='elem-icon${1+i}' class="elem-icon"><img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"></div>`);
            $(`#forecast-elem${1+i}`).append(`<div id='elem-forec${1+i}' class="elem-forec">` + data.list[i].weather[0].description + "</div>");
            $(`#forecast-elem${1+i}`).append(`<div id='elem-temp${1+i}' class="elem-temp">` + data.list[i].main.temp + "&deg;C</div>");
            $(`#forecast-elem${1+i}`).append(`<div id='elem-wind${1+i}' class="elem-wind">` + data.list[i].wind.speed + "km/h</div>");
        };
    });
}

let inputValue;

document.getElementById("search-btn").addEventListener("click", function enterCity(){

    // при натисканні на пошук забираємо аварійне вікно, якщо це потрібно
    $(".error-window").css("display", "none");

    // отримуємо вел'ю
    inputValue = document.getElementById("search").value;

    // підставляємо текст, що ввели в полі в посилання
    weather_now = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=67c49f37eded9736eb9e0dfb13c7aae2&lang=ua&cnt=6&units=metric`;
    weather_forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&appid=67c49f37eded9736eb9e0dfb13c7aae2&lang=ua&cnt=6&units=metric`;

    // і запускаємо наші функції
    weatherNow(weather_now);

    // видаляємо HTML для вводу наступної інформації
    $(".forecast-elem").remove();
    weatherForecast(weather_forecast);

    // очищаємо поле вводу
    document.getElementById("search").value = '';
})