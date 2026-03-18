import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IFavoriteCityRepository } from '../../domain/repositories/favorite-city.repository.interface';
import { FAVORITE_CITY_REPOSITORY } from '../../domain/repositories/favorite-city.repository.interface';

@Injectable()
export class RemoveFavoriteUseCase {
  constructor(
    @Inject(FAVORITE_CITY_REPOSITORY)
    private readonly favoriteCityRepository: IFavoriteCityRepository,
  ) {}

  async execute(id: string, userId: string) {
    const favorite = await this.favoriteCityRepository.findById(id);

    if (!favorite || favorite.userId !== userId) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await this.favoriteCityRepository.delete(id, userId);
    return { message: 'Removido com sucesso' };
  }
}
