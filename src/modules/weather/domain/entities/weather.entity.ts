export class WeatherEntity {
  constructor(
    public readonly cityName: string,
    public readonly country: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly temp: number,
    public readonly feelsLike: number,
    public readonly tempMin: number,
    public readonly tempMax: number,
    public readonly humidity: number,
    public readonly description: string,
    public readonly icon: string,
    public readonly windSpeed: number,
  ) {}
}

export class ForecastItemEntity {
  constructor(
    public readonly dt: number,
    public readonly temp: number,
    public readonly tempMin: number,
    public readonly tempMax: number,
    public readonly description: string,
    public readonly icon: string,
    public readonly humidity: number,
    public readonly windSpeed: number,
    public readonly pop: number,
  ) {}
}

export class CitySuggestionEntity {
  constructor(
    public readonly name: string,
    public readonly country: string,
    public readonly state: string | null,
    public readonly lat: number,
    public readonly lon: number,
  ) {}
}
