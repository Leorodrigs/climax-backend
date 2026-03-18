import { Inject, Injectable } from '@nestjs/common';
import type { IWeatherAlertRepository } from '../../domain/repositories/weather-alert.repository.interface';
import { WEATHER_ALERT_REPOSITORY } from '../../domain/repositories/weather-alert.repository.interface';

@Injectable()
export class GetAlertsUseCase {
  constructor(
    @Inject(WEATHER_ALERT_REPOSITORY)
    private readonly alertRepository: IWeatherAlertRepository,
  ) {}

  async execute(userId: string) {
    return this.alertRepository.findAllByUserId(userId);
  }
}
