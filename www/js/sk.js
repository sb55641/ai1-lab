const WeatherApp =class{
    constructor(apiKey, blockSel){
        this.apiKey = apiKey;
        this.block=document.querySelector(blockSel);
        this.currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric`;
        this.forecastLink=`https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric`;

        this.currentWeather = undefined;
        this.forecast = undefined;
    }
    getCurrentWeather(query){
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET",url,true);
        req.addEventListener("load",() => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(JSON.parse(req.responseText));
            this.drawWeather();  
        });
        req.send();
    }
    getForecast(query){
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) =>{
            return response.json();
        }).then((data) =>{
            console.log(data);
            this.forecast = data.list;
            this.drawWeather();
        });
    }
    getWeather(query){
        this.getCurrentWeather(query);
        this.getForecast(query);
    }
    drawWeather(){
        this.block.innerHTML = "";

        if(this.currentWeather){
            const date = new Date(this.currentWeather.dt * 1000);
            const weatherBlock = this.blockCreate(
                `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                this.currentWeather.main.temp,
                this.currentWeather.main.feels_like,
                this.currentWeather.weather[0].icon,
                this.currentWeather.weather[0].description
            );
            this.block.appendChild(weatherBlock);
        }

        if(this.forecast){
            for(let i = 0; i<this.forecast.length; i++){
                let weather = this.forecast[i];
                
                const date = new Date(weather.dt * 1000);
                const weatherBlock = this.blockCreate(
                    `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`,
                    weather.main.temp,
                    weather.main.feels_like,
                    weather.weather[0].icon,
                    weather.weather[0].description
                );
                this.block.appendChild(weatherBlock)
            }
        }

    }
    blockCreate(dateString,temperature,feelTemperature,iconName,desc){
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "w_block";
        
        const dateBlock = document.createElement("div");
        dateBlock.className = "w_date";
        dateBlock.innerHTML = dateString;
        weatherBlock.appendChild(dateBlock);

        const temperatureBlock = document.createElement("div");
        temperatureBlock.className = "w_temp";
        temperatureBlock.innerHTML = `${temperature}&deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        const temperatureFeelBlock = document.createElement("div");
        temperatureFeelBlock.className = "w_tempfeel";
        temperatureFeelBlock.innerHTML = `Feel: ${feelTemperature}&deg;C`;
        weatherBlock.appendChild(temperatureFeelBlock);
        
        const iconImg = document.createElement("img");
        iconImg.className = "w_icon";
        iconImg.src = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
        weatherBlock.appendChild(iconImg);

        const descBlock = document.createElement("div");
        descBlock.className = "w_desc";
        descBlock.innerHTML = desc;
        weatherBlock.appendChild(descBlock);

        return weatherBlock
    }

}
document.weatherApp=new WeatherApp("0a73fc65d67d41c36339b1a0d50f2241","#w_container")

document.querySelector("#button").addEventListener("click",function(){
    const query = document.querySelector("#l_input").value;
    document.weatherApp.getWeather(query);
});
