import { Inject, Injectable } from '@nestjs/common';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { IWeatherAlertRepository } from '../../domain/repositories/weather-alert.repository.interface';
import { WEATHER_ALERT_REPOSITORY } from '../../domain/repositories/weather-alert.repository.interface';
import {
  AlertType,
  WeatherAlertEntity,
} from '../../domain/entities/weather-alert.entity';

export class CreateAlertDto {
  @ApiProperty({ example: 'Porto Alegre' })
  @IsString()
  @MinLength(2)
  cityName: string;

  @ApiProperty({ example: -30.0331 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -51.23 })
  @IsNumber()
  lon: number;

  @ApiProperty({ enum: AlertType, example: AlertType.TEMPERATURE_BELOW })
  @IsEnum(AlertType)
  alertType: AlertType;

  @ApiProperty({ example: 15, required: false })
  @IsNumber()
  @IsOptional()
  thresholdValue?: number;
}

@Injectable()
export class CreateAlertUseCase {
  constructor(
    @Inject(WEATHER_ALERT_REPOSITORY)
    private readonly alertRepository: IWeatherAlertRepository,
  ) {}

  async execute(userId: string, dto: CreateAlertDto) {
    const alert = WeatherAlertEntity.create(
      userId,
      dto.cityName,
      dto.lat,
      dto.lon,
      dto.alertType,
      dto.thresholdValue ?? null,
    );

    await this.alertRepository.save(alert);
    return alert;
  }
}
