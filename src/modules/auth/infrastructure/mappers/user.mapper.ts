import { UserEntity } from '../../domain/entities/user.entity';

type PrismaUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity(
      raw.id,
      raw.name,
      raw.email,
      raw.passwordHash,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPrisma(user: UserEntity) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
