import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { IFavoriteCityRepository } from '../../domain/repositories/favorite-city.repository.interface';
import { FAVORITE_CITY_REPOSITORY } from '../../domain/repositories/favorite-city.repository.interface';
import { FavoriteCityEntity } from '../../domain/entities/favorite-city.entity';

export class AddFavoriteDto {
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

  @ApiProperty({ example: 'BR' })
  @IsString()
  country: string;
}

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    @Inject(FAVORITE_CITY_REPOSITORY)
    private readonly favoriteCityRepository: IFavoriteCityRepository,
  ) {}

  async execute(userId: string, dto: AddFavoriteDto) {
    const existing = await this.favoriteCityRepository.findByUserIdAndCoords(
      userId,
      dto.lat,
      dto.lon,
    );

    if (existing) {
      throw new ConflictException('Cidade já está nos favoritos');
    }

    const favorite = FavoriteCityEntity.create(
      userId,
      dto.cityName,
      dto.lat,
      dto.lon,
      dto.country,
    );

    await this.favoriteCityRepository.save(favorite);
    return favorite;
  }
}
