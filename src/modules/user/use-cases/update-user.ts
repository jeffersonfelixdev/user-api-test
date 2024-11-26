import { UserRole } from '@prisma/client'

import { AppError } from '../../../shared/errors/app-error'
import { UserRepository } from '../repositories/user-repository'

interface UpdateUserInput {
  email: string
  newEmail?: string
  name?: string
  password?: string
  role?: UserRole
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ email, name, password, role }: UpdateUserInput) {
    const user = await this.userRepository.get(email)
    if (!user) throw new AppError('user not found', 404)
    user.name = name ?? user.name
    if (password) user.passwordHash = password
    user.role = role ?? user.role
    await this.userRepository.update(user)
  }
}
