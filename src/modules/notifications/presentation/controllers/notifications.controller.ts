import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/presentation/guards/jwt.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import {
  RegisterPushTokenUseCase,
  RegisterPushTokenDto,
} from '../../application/use-cases/register-push-token.use-case';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtGuard)
export class NotificationsController {
  constructor(private readonly registerPushToken: RegisterPushTokenUseCase) {}

  @Post('token')
  @ApiOperation({ summary: 'Registrar token FCM do dispositivo' })
  async registerToken(
    @CurrentUser() user: { sub: string },
    @Body() dto: RegisterPushTokenDto,
  ) {
    await this.registerPushToken.execute(user.sub, dto.token);
    return { message: 'Token registrado com sucesso' };
  }
}
