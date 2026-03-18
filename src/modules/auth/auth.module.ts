import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './presentation/guards/jwt.strategy';
import { RegisterUserUseCase } from './application/use-cases/register-user/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user/login-user.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password/reset-password.use-case';
import { UserPrismaRepository } from './infrastructure/repositories/user.prisma.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    ResetPasswordUseCase,
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
})
export class AuthModule {}
