import { Injectable } from '@nestjs/common';
import type { IPushTokenRepository } from '../../domain/repositories/push-token.repository.interface';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class PushTokenPrismaRepository implements IPushTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTokensByUserId(userId: string): Promise<string[]> {
    const rows = await this.prisma.pushToken.findMany({ where: { userId } });
    return rows.map((r) => r.token);
  }

  async upsert(userId: string, token: string): Promise<void> {
    await this.prisma.pushToken.upsert({
      where: { token },
      update: { userId },
      create: { userId, token },
    });
  }
}
