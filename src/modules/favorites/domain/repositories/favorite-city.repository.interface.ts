import { FavoriteCityEntity } from '../entities/favorite-city.entity';

export const FAVORITE_CITY_REPOSITORY = Symbol('FAVORITE_CITY_REPOSITORY');

export interface IFavoriteCityRepository {
  findAllByUserId(userId: string): Promise<FavoriteCityEntity[]>;
  findById(id: string): Promise<FavoriteCityEntity | null>;
  findByUserIdAndCoords(
    userId: string,
    lat: number,
    lon: number,
  ): Promise<FavoriteCityEntity | null>;
  save(favorite: FavoriteCityEntity): Promise<void>;
  delete(id: string, userId: string): Promise<void>;
}
