import { Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    if (!raw) return null;
    return UserMapper.toDomain(raw);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    if (!raw) return null;
    return UserMapper.toDomain(raw);
  }

  async save(user: UserEntity): Promise<void> {
    await this.prisma.user.create({ data: UserMapper.toPrisma(user) });
  }

  async updatePassword(email: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
  }
}
