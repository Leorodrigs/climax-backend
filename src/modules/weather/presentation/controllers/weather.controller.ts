import { Controller, Get, Query, ParseFloatPipe } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetCurrentWeatherUseCase } from '../../application/use-cases/get-current-weather.use-case';
import { GetForecastUseCase } from '../../application/use-cases/get-forecast.use-case';
import { SearchCitiesUseCase } from '../../application/use-cases/search-cities.use-case';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(
    private readonly getCurrentWeather: GetCurrentWeatherUseCase,
    private readonly getForecast: GetForecastUseCase,
    private readonly searchCities: SearchCitiesUseCase,
  ) {}

  @Get('current')
  @ApiOperation({ summary: 'Current weather by coordinates' })
  @ApiQuery({ name: 'lat', example: -30.0331 })
  @ApiQuery({ name: 'lon', example: -51.23 })
  current(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
  ) {
    return this.getCurrentWeather.execute(lat, lon);
  }

  @Get('forecast')
  @ApiOperation({ summary: '5-day forecast by coordinates' })
  @ApiQuery({ name: 'lat', example: -30.0331 })
  @ApiQuery({ name: 'lon', example: -51.23 })
  forecast(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
  ) {
    return this.getForecast.execute(lat, lon);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for cities by name' })
  @ApiQuery({ name: 'q', example: 'Florianopolis' })
  search(@Query('q') query: string) {
    return this.searchCities.execute(query);
  }
}
