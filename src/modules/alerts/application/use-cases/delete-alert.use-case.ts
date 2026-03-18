import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IWeatherAlertRepository } from '../../domain/repositories/weather-alert.repository.interface';
import { WEATHER_ALERT_REPOSITORY } from '../../domain/repositories/weather-alert.repository.interface';

@Injectable()
export class DeleteAlertUseCase {
  constructor(
    @Inject(WEATHER_ALERT_REPOSITORY)
    private readonly alertRepository: IWeatherAlertRepository,
  ) {}

  async execute(id: string, userId: string) {
    const alert = await this.alertRepository.findById(id);

    if (!alert || alert.userId !== userId) {
      throw new NotFoundException('Alerta não encontrado');
    }

    await this.alertRepository.delete(id, userId);
    return { message: 'Alerta removido com sucesso' };
  }
}
