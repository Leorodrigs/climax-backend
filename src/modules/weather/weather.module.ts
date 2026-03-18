import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

import { WeatherController } from './presentation/controllers/weather.controller';
import { GetCurrentWeatherUseCase } from './application/use-cases/get-current-weather.use-case';
import { GetForecastUseCase } from './application/use-cases/get-forecast.use-case';
import { SearchCitiesUseCase } from './application/use-cases/search-cities.use-case';
import { OpenWeatherProvider } from './infrastructure/providers/openweather.provider';
import { WEATHER_PROVIDER } from './domain/providers/weather-provider.interface';

@Module({
  imports: [HttpModule, CacheModule.register({ ttl: 5 * 60 * 1000 })],
  controllers: [WeatherController],
  providers: [
    GetCurrentWeatherUseCase,
    GetForecastUseCase,
    SearchCitiesUseCase,
    {
      provide: WEATHER_PROVIDER,
      useClass: OpenWeatherProvider,
    },
  ],
  exports: [WEATHER_PROVIDER],
})
export class WeatherModule {}
