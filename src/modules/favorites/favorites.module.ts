import { Module } from '@nestjs/common';
import { FavoritesController } from './presentation/controllers/favorites.controller';
import { GetFavoritesUseCase } from './application/use-cases/get-favorites.use-case';
import { AddFavoriteUseCase } from './application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from './application/use-cases/remove-favorite.use-case';
import { FavoriteCityPrismaRepository } from './infrastructure/repositories/favorite-city.prisma.repository';
import { FAVORITE_CITY_REPOSITORY } from './domain/repositories/favorite-city.repository.interface';

@Module({
  controllers: [FavoritesController],
  providers: [
    GetFavoritesUseCase,
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    {
      provide: FAVORITE_CITY_REPOSITORY,
      useClass: FavoriteCityPrismaRepository,
    },
  ],
})
export class FavoritesModule {}
