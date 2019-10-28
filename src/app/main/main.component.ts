import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment-timezone';

interface Cities {
  name: string;
  countryName: string;
  continentName: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit {
  weather: string;
  temperatureMAX: number;
  temperatureMIN: number;
  windSpeed: number;
  windDirection: number;
  Humidity: number;
  Sunrise: string;
  Sunset: string;
  Time: string;
  selectedCity: any;
  cities: Array<Cities> = [];
  continents: Array<string> = [];

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.getCities().subscribe(data => this.cities = data);
  }

  getConfig(city: string): Promise<any> {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=3e430d76f0074ce63575d48b7fd38db7';
    return this._http.get(url).toPromise();
  }

  showWeather(event: Cities) {
    document.getElementsByClassName('TableOfInfo')[0].setAttribute('style', 'display: block');
    this.getConfig(event.name)
    .then(data => {
      this.weather = data.weather[0].main;
      this.temperatureMAX = Math.round(data.main.temp_max - 273.15);
      this.temperatureMIN = Math.round(data.main.temp_min - 273.15);
      this.windSpeed = data.wind.speed;
      this.windDirection = data.wind.deg;
      this.Humidity = data.main.humidity;
      this.Sunrise =  moment(new Date(data.sys.sunrise * 1000)).tz(event.continentName + '/' + event.name.replace(/ /g, '_')).format();
      this.Sunrise = this.Sunrise.replace(/T/g, ' ').slice(0, this.Sunrise.length - 6);
      this.Sunset = moment(new Date(data.sys.sunset * 1000)).tz(event.continentName + '/' + event.name.replace(/ /g, '_')).format();
      this.Sunset = this.Sunset.replace(/T/g, ' ').slice(0, this.Sunset.length - 6);
      this.Time = moment(new Date(data.dt * 1000)).tz(event.continentName + '/' + event.name.replace(/ /g, '_')).format();
      this.Time = this.Time.replace(/T/g, ' ').slice(0, this.Time.length - 6);
      });
  }

  getCities(): Observable<Cities[]> {
    return this._http.get<Cities[]>('/src/app/cities/city.list.model.json');
  }
}
