import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../../dtos/register-user/register-user.dto';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<{ id: string }> {
    const email = new Email(dto.email);

    const existing = await this.userRepository.findByEmail(email.value);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = UserEntity.create(dto.name, email.value, passwordHash);

    await this.userRepository.save(user);

    return { id: user.id };
  }
}
