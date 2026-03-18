import { Module } from '@nestjs/common';
import { AlertsController } from './presentation/controllers/alerts.controller';
import { CreateAlertUseCase } from './application/use-cases/create-alert.use-case';
import { GetAlertsUseCase } from './application/use-cases/get-alerts.use-case';
import { ToggleAlertUseCase } from './application/use-cases/toggle-alert.use-case';
import { DeleteAlertUseCase } from './application/use-cases/delete-alert.use-case';
import { CheckAlertsUseCase } from './application/use-cases/check-alerts.use-case';
import { AlertsScheduler } from './infrastructure/scheduler/alerts.scheduler';
import { WeatherAlertPrismaRepository } from './infrastructure/repositories/weather-alert.prisma.repository';
import { WEATHER_ALERT_REPOSITORY } from './domain/repositories/weather-alert.repository.interface';
import { WeatherModule } from '../weather/weather.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [WeatherModule, NotificationsModule],
  controllers: [AlertsController],
  providers: [
    CreateAlertUseCase,
    GetAlertsUseCase,
    ToggleAlertUseCase,
    DeleteAlertUseCase,
    CheckAlertsUseCase,
    AlertsScheduler,
    {
      provide: WEATHER_ALERT_REPOSITORY,
      useClass: WeatherAlertPrismaRepository,
    },
  ],
  exports: [WEATHER_ALERT_REPOSITORY],
})
export class AlertsModule {}
