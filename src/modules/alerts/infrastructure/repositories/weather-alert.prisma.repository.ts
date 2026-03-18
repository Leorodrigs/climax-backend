import { Injectable } from '@nestjs/common';
import type { IWeatherAlertRepository } from '../../domain/repositories/weather-alert.repository.interface';
import {
  AlertType,
  WeatherAlertEntity,
} from '../../domain/entities/weather-alert.entity';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class WeatherAlertPrismaRepository implements IWeatherAlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(row: any): WeatherAlertEntity {
    return new WeatherAlertEntity(
      row.id,
      row.userId,
      row.cityName,
      row.lat,
      row.lon,
      row.alertType as AlertType,
      row.thresholdValue,
      row.isActive,
      row.createdAt,
      row.updatedAt,
    );
  }

  async findAllByUserId(userId: string): Promise<WeatherAlertEntity[]> {
    const rows = await this.prisma.weatherAlert.findMany({ where: { userId } });
    return rows.map((row) => this.toEntity(row));
  }

  async findAllActive(): Promise<WeatherAlertEntity[]> {
    const rows = await this.prisma.weatherAlert.findMany({
      where: { isActive: true },
    });
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<WeatherAlertEntity | null> {
    const row = await this.prisma.weatherAlert.findUnique({ where: { id } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async save(alert: WeatherAlertEntity): Promise<void> {
    await this.prisma.weatherAlert.create({
      data: {
        id: alert.id,
        userId: alert.userId,
        cityName: alert.cityName,
        lat: alert.lat,
        lon: alert.lon,
        alertType: alert.alertType,
        thresholdValue: alert.thresholdValue,
        isActive: alert.isActive,
      },
    });
  }

  async update(id: string, data: Partial<WeatherAlertEntity>): Promise<void> {
    await this.prisma.weatherAlert.update({ where: { id }, data });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.weatherAlert.deleteMany({ where: { id, userId } });
  }
}
