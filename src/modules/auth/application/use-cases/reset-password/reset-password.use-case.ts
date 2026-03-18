import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { ResetPasswordDto } from '../../dtos/reset-password/reset-password.dto';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('E-mail não cadastrado.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.userRepository.updatePassword(dto.email, passwordHash);

    return { message: 'Senha redefinida com sucesso.' };
  }
}
