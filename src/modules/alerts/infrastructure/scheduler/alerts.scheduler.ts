import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CheckAlertsUseCase } from '../../application/use-cases/check-alerts.use-case';

@Injectable()
export class AlertsScheduler {
  private readonly logger = new Logger(AlertsScheduler.name);

  constructor(private readonly checkAlertsUseCase: CheckAlertsUseCase) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleCron() {
    this.logger.log('Cron job de alertas iniciado');
    await this.checkAlertsUseCase.execute();
  }
}
