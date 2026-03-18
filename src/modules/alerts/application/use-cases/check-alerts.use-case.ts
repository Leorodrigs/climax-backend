import { Inject, Injectable, Logger } from '@nestjs/common';
import type { IWeatherAlertRepository } from '../../domain/repositories/weather-alert.repository.interface';
import { WEATHER_ALERT_REPOSITORY } from '../../domain/repositories/weather-alert.repository.interface';
import type { IWeatherProvider } from '../../../weather/domain/providers/weather-provider.interface';
import { WEATHER_PROVIDER } from '../../../weather/domain/providers/weather-provider.interface';
import { AlertType } from '../../domain/entities/weather-alert.entity';
import { FirebaseService } from '../../../notifications/infrastructure/firebase.service';
import type { IPushTokenRepository } from '../../../notifications/domain/repositories/push-token.repository.interface';
import { PUSH_TOKEN_REPOSITORY } from '../../../notifications/domain/repositories/push-token.repository.interface';

@Injectable()
export class CheckAlertsUseCase {
  private readonly logger = new Logger(CheckAlertsUseCase.name);

  constructor(
    @Inject(WEATHER_ALERT_REPOSITORY)
    private readonly alertRepository: IWeatherAlertRepository,
    @Inject(WEATHER_PROVIDER)
    private readonly weatherProvider: IWeatherProvider,
    private readonly firebaseService: FirebaseService,
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly pushTokenRepository: IPushTokenRepository,
  ) {}

  async execute(): Promise<void> {
    const alerts = await this.alertRepository.findAllActive();
    this.logger.log(`Verificando ${alerts.length} alertas ativos...`);

    for (const alert of alerts) {
      try {
        const weather = await this.weatherProvider.getCurrentWeather(
          alert.lat,
          alert.lon,
        );

        const triggered = this.checkCondition(
          alert.alertType,
          alert.thresholdValue,
          weather,
        );

        if (triggered) {
          const tempInfo =
            alert.thresholdValue !== null
              ? `| Temp atual: ${weather.temp.toFixed(1)}°C | Threshold: ${alert.thresholdValue}°C`
              : `| Condição: ${weather.description}`;

          this.logger.warn(
            `🚨 Alerta disparado! Usuário: ${alert.userId} | Cidade: ${alert.cityName} | Tipo: ${alert.alertType} ${tempInfo}`,
          );

          const tokens = await this.pushTokenRepository.findTokensByUserId(
            alert.userId,
          );

          if (tokens.length > 0) {
            const title = `🌡️ Alerta de clima — ${alert.cityName}`;
            const body =
              alert.thresholdValue !== null
                ? `Temperatura atual: ${weather.temp.toFixed(1)}°C (threshold: ${alert.thresholdValue}°C)`
                : `Condição detectada: ${weather.description}`;

            await this.firebaseService.sendToMultiple(tokens, title, body, {
              alertType: alert.alertType,
              cityName: alert.cityName,
            });
          }
        }
      } catch (error) {
        this.logger.error(`Erro ao verificar alerta ${alert.id}: ${error}`);
      }
    }
  }

  private checkCondition(
    alertType: AlertType,
    threshold: number | null,
    weather: { temp: number; description: string },
  ): boolean {
    switch (alertType) {
      case AlertType.TEMPERATURE_BELOW:
        return threshold !== null && weather.temp < threshold;
      case AlertType.TEMPERATURE_ABOVE:
        return threshold !== null && weather.temp > threshold;
      case AlertType.RAIN:
        return (
          weather.description.toLowerCase().includes('chuva') ||
          weather.description.toLowerCase().includes('rain')
        );
      case AlertType.STORM:
        return (
          weather.description.toLowerCase().includes('trovoada') ||
          weather.description.toLowerCase().includes('tempestade') ||
          weather.description.toLowerCase().includes('storm')
        );
      default:
        return false;
    }
  }
}
