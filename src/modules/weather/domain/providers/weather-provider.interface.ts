import {
  CitySuggestionEntity,
  ForecastItemEntity,
  WeatherEntity,
} from '../entities/weather.entity';

export const WEATHER_PROVIDER = Symbol('WEATHER_PROVIDER');

export interface IWeatherProvider {
  getCurrentWeather(lat: number, lon: number): Promise<WeatherEntity>;
  getForecast(lat: number, lon: number): Promise<ForecastItemEntity[]>;
  searchCities(query: string): Promise<CitySuggestionEntity[]>;
}
