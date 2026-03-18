import { Injectable } from '@nestjs/common';
import type { IFavoriteCityRepository } from '../../domain/repositories/favorite-city.repository.interface';
import { FavoriteCityEntity } from '../../domain/entities/favorite-city.entity';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class FavoriteCityPrismaRepository implements IFavoriteCityRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): FavoriteCityEntity {
    return new FavoriteCityEntity(
      r.id,
      r.userId,
      r.cityName,
      r.lat,
      r.lon,
      r.country,
      r.createdAt,
    );
  }

  async findAllByUserId(userId: string): Promise<FavoriteCityEntity[]> {
    const rows = await this.prisma.favoriteCity.findMany({ where: { userId } });
    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<FavoriteCityEntity | null> {
    const row = await this.prisma.favoriteCity.findUnique({ where: { id } });
    if (!row) return null;
    return this.toEntity(row);
  }

  async findByUserIdAndCoords(
    userId: string,
    lat: number,
    lon: number,
  ): Promise<FavoriteCityEntity | null> {
    const row = await this.prisma.favoriteCity.findFirst({
      where: { userId, lat, lon },
    });
    if (!row) return null;
    return this.toEntity(row);
  }

  async save(favorite: FavoriteCityEntity): Promise<void> {
    await this.prisma.favoriteCity.create({
      data: {
        id: favorite.id,
        userId: favorite.userId,
        cityName: favorite.cityName,
        lat: favorite.lat,
        lon: favorite.lon,
        country: favorite.country,
        createdAt: favorite.createdAt,
      },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.prisma.favoriteCity.deleteMany({ where: { id, userId } });
  }
}
