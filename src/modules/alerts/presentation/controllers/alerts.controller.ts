import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../../auth/presentation/guards/jwt.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import {
  CreateAlertUseCase,
  CreateAlertDto,
} from '../../application/use-cases/create-alert.use-case';
import { GetAlertsUseCase } from '../../application/use-cases/get-alerts.use-case';
import { ToggleAlertUseCase } from '../../application/use-cases/toggle-alert.use-case';
import { DeleteAlertUseCase } from '../../application/use-cases/delete-alert.use-case';

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
@UseGuards(JwtGuard)
export class AlertsController {
  constructor(
    private readonly createAlert: CreateAlertUseCase,
    private readonly getAlerts: GetAlertsUseCase,
    private readonly toggleAlert: ToggleAlertUseCase,
    private readonly deleteAlert: DeleteAlertUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar alertas do usuário' })
  getAll(@CurrentUser() user: { sub: string }) {
    return this.getAlerts.execute(user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Criar novo alerta de clima' })
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateAlertDto) {
    return this.createAlert.execute(user.sub, dto);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Ativar ou desativar alerta' })
  toggle(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.toggleAlert.execute(id, user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover alerta' })
  remove(@CurrentUser() user: { sub: string }, @Param('id') id: string) {
    return this.deleteAlert.execute(id, user.sub);
  }
}
