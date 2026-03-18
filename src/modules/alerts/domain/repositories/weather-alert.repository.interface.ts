import { WeatherAlertEntity } from '../entities/weather-alert.entity';

export const WEATHER_ALERT_REPOSITORY = Symbol('WEATHER_ALERT_REPOSITORY');

export interface IWeatherAlertRepository {
  findAllByUserId(userId: string): Promise<WeatherAlertEntity[]>;
  findAllActive(): Promise<WeatherAlertEntity[]>;
  findById(id: string): Promise<WeatherAlertEntity | null>;
  save(alert: WeatherAlertEntity): Promise<void>;
  update(id: string, data: Partial<WeatherAlertEntity>): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
