export class FavoriteCityEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly cityName: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly country: string,
    public readonly createdAt: Date,
  ) {}

  static create(
    userId: string,
    cityName: string,
    lat: number,
    lon: number,
    country: string,
  ): FavoriteCityEntity {
    return new FavoriteCityEntity(
      crypto.randomUUID(),
      userId,
      cityName,
      lat,
      lon,
      country,
      new Date(),
    );
  }
}
