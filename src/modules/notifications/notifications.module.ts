import { Module } from '@nestjs/common';
import { FirebaseService } from './infrastructure/firebase.service';
import { RegisterPushTokenUseCase } from './application/use-cases/register-push-token.use-case';
import { NotificationsController } from './presentation/controllers/notifications.controller';
import { PushTokenPrismaRepository } from './infrastructure/repositories/push-token.prisma.repository';
import { PUSH_TOKEN_REPOSITORY } from './domain/repositories/push-token.repository.interface';

@Module({
  controllers: [NotificationsController],
  providers: [
    FirebaseService,
    RegisterPushTokenUseCase,
    {
      provide: PUSH_TOKEN_REPOSITORY,
      useClass: PushTokenPrismaRepository,
    },
  ],
  exports: [FirebaseService, PUSH_TOKEN_REPOSITORY],
})
export class NotificationsModule {}
