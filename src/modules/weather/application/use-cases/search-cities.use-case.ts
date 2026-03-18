import { Inject, Injectable } from '@nestjs/common';
import type { IWeatherProvider } from '../../domain/providers/weather-provider.interface';
import { WEATHER_PROVIDER } from '../../domain/providers/weather-provider.interface';

@Injectable()
export class SearchCitiesUseCase {
  constructor(
    @Inject(WEATHER_PROVIDER)
    private readonly weatherProvider: IWeatherProvider,
  ) {}

  async execute(query: string) {
    return this.weatherProvider.searchCities(query);
  }
}
