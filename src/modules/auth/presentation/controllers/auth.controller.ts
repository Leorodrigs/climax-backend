import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RegisterUserUseCase } from '../../application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user/login-user.use-case';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password/reset-password.use-case';
import { RegisterUserDto } from '../../application/dtos/register-user/register-user.dto';
import { LoginUserDto } from '../../application/dtos/login-user/login-user.dto';
import { ResetPasswordDto } from '../../application/dtos/reset-password/reset-password.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new User' })
  register(@Body() dto: RegisterUserDto) {
    return this.registerUserUseCase.execute(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and generate JWT token' })
  login(@Body() dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password by email' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Returns the authenticated user' })
  me(@CurrentUser() user: { sub: string; email: string }) {
    return user;
  }
}
