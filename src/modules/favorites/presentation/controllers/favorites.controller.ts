import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/presentation/guards/jwt.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { GetFavoritesUseCase } from '../../application/use-cases/get-favorites.use-case';
import {
  AddFavoriteUseCase,
  AddFavoriteDto,
} from '../../application/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../application/use-cases/remove-favorite.use-case';

@ApiTags('Favorites')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(JwtGuard)
export class FavoritesController {
  constructor(
    private readonly getFavorites: GetFavoritesUseCase,
    private readonly addFavorite: AddFavoriteUseCase,
    private readonly removeFavorite: RemoveFavoriteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar cidades favoritas do usuário' })
  getAll(@CurrentUser() user: { sub: string }) {
    return this.getFavorites.execute(user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Adicionar cidade aos favoritos' })
  add(@CurrentUser() user: { sub: string }, @Body() dto: AddFavoriteDto) {
    return this.addFavorite.execute(user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cidade dos favoritos' })
  remove(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.removeFavorite.execute(id, user.sub);
  }
}
