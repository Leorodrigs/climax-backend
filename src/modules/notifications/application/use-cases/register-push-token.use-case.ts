import { Inject, Injectable } from '@nestjs/common';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { IPushTokenRepository } from '../../domain/repositories/push-token.repository.interface';
import { PUSH_TOKEN_REPOSITORY } from '../../domain/repositories/push-token.repository.interface';

export class RegisterPushTokenDto {
  @ApiProperty({ example: 'fcm-token-do-dispositivo' })
  @IsString()
  token: string;
}

@Injectable()
export class RegisterPushTokenUseCase {
  constructor(
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly pushTokenRepository: IPushTokenRepository,
  ) {}

  async execute(userId: string, token: string): Promise<void> {
    await this.pushTokenRepository.upsert(userId, token);
  }
}
