export enum AlertType {
  TEMPERATURE_BELOW = 'TEMPERATURE_BELOW',
  TEMPERATURE_ABOVE = 'TEMPERATURE_ABOVE',
  STORM = 'STORM',
  RAIN = 'RAIN',
}

export class WeatherAlertEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly cityName: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly alertType: AlertType,
    public readonly thresholdValue: number | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    userId: string,
    cityName: string,
    lat: number,
    lon: number,
    alertType: AlertType,
    thresholdValue: number | null,
  ): WeatherAlertEntity {
    const now = new Date();
    return new WeatherAlertEntity(
      crypto.randomUUID(),
      userId,
      cityName,
      lat,
      lon,
      alertType,
      thresholdValue,
      true,
      now,
      now,
    );
  }
}
