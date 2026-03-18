import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import type { IWeatherProvider } from '../../domain/providers/weather-provider.interface';
import {
  CitySuggestionEntity,
  ForecastItemEntity,
  WeatherEntity,
} from '../../domain/entities/weather.entity';

@Injectable()
export class OpenWeatherProvider implements IWeatherProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.apiKey = this.config.get<string>('OPENWEATHER_API_KEY')!;
    this.baseUrl = this.config.get<string>('OPENWEATHER_BASE_URL')!;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherEntity> {
    const cacheKey = `weather:current:${lat}:${lon}`;
    const cached = await this.cacheManager.get<WeatherEntity>(cacheKey);
    if (cached) return cached;

    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'pt_br',
        },
      }),
    );

    const result = new WeatherEntity(
      data.name,
      data.sys.country,
      data.coord.lat,
      data.coord.lon,
      data.main.temp,
      data.main.feels_like,
      data.main.temp_min,
      data.main.temp_max,
      data.main.humidity,
      data.weather[0].description,
      data.weather[0].icon,
      data.wind.speed,
    );

    await this.cacheManager.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  }

  async getForecast(lat: number, lon: number): Promise<ForecastItemEntity[]> {
    const cacheKey = `weather:forecast:${lat}:${lon}`;
    const cached = await this.cacheManager.get<ForecastItemEntity[]>(cacheKey);
    if (cached) return cached;

    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/data/2.5/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'pt_br',
        },
      }),
    );

    const result = data.list.map(
      (item: any) =>
        new ForecastItemEntity(
          item.dt,
          item.main.temp,
          item.main.temp_min,
          item.main.temp_max,
          item.weather[0].description,
          item.weather[0].icon,
          item.main.humidity,
          item.wind.speed,
          item.pop ?? 0,
        ),
    );

    await this.cacheManager.set(cacheKey, result, 10 * 60 * 1000);
    return result;
  }

  async searchCities(query: string): Promise<CitySuggestionEntity[]> {
    const cacheKey = `weather:search:${query.toLowerCase().trim()}`;
    const cached =
      await this.cacheManager.get<CitySuggestionEntity[]>(cacheKey);
    if (cached) return cached;

    const { data } = await firstValueFrom(
      this.http.get(`${this.baseUrl}/geo/1.0/direct`, {
        params: { q: query, limit: 5, appid: this.apiKey },
      }),
    );

    const result = data.map(
      (item: any) =>
        new CitySuggestionEntity(
          item.name,
          item.country,
          item.state ?? null,
          item.lat,
          item.lon,
        ),
    );

    await this.cacheManager.set(cacheKey, result, 60 * 60 * 1000);
    return result;
  }
}
