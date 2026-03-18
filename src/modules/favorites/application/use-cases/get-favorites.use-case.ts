import { Inject, Injectable } from '@nestjs/common';
import type { IFavoriteCityRepository } from '../../domain/repositories/favorite-city.repository.interface';
import { FAVORITE_CITY_REPOSITORY } from '../../domain/repositories/favorite-city.repository.interface';

@Injectable()
export class GetFavoritesUseCase {
  constructor(
    @Inject(FAVORITE_CITY_REPOSITORY)
    private readonly favoriteCityRepository: IFavoriteCityRepository,
  ) {}

  async execute(userId: string) {
    return this.favoriteCityRepository.findAllByUserId(userId);
  }
}
