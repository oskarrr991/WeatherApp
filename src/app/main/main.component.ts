import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../models/city.model';

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
  Sunrise: number;
  Sunset: number;
  Time: number;

  selectedCity: string;
  cities: Array<string> = [];

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.getCities().subscribe(data => {
      data.map(city => this.cities.push(city.name));
    });
  }

  getConfig(city: string): Promise<any> {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=3e430d76f0074ce63575d48b7fd38db7';
    return this._http.get(url).toPromise();
  }
  showWeather(event: string) {
    document.getElementsByClassName('TableOfInfo')[0].setAttribute('style', 'display: block');
    this.getConfig(event)
    .then(data => {
      this.weather = data.weather[0].main;
      this.temperatureMAX = Math.round(data.main.temp_max - 273.15);
      this.temperatureMIN = Math.round(data.main.temp_min - 273.15);
      this.windSpeed = data.wind.speed;
      this.windDirection = data.wind.deg;
      this.Humidity = data.main.humidity;
      this.Sunrise = this.timeConverter(data.sys.sunrise);
      this.Sunset = this.timeConverter(data.sys.sunset);
      this.Time = this.timeConverter(data.dt);
    });
  }
  timeConverter(unixTime: number): string {
    const a = new Date(unixTime * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getUTCFullYear();
    const month = months[a.getUTCMonth()];
    const date = a.getUTCDate();
    const hour = a.getUTCHours();
    const min = a.getUTCMinutes();
    const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
  getCities(): Observable<any> {
    return this._http.get<City>('/src/app/cities/city.list.model.json');
  }
}
