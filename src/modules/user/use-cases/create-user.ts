import { User, UserRole } from '@prisma/client'

import { AppError } from '../../../shared/errors/app-error'
import { UserRepository } from '../repositories/user-repository'

interface CreateUserInput {
  name: string
  email: string
  password: string
}

interface CreateUserOutput {
  user: User
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({
    name,
    email,
    password,
  }: CreateUserInput): Promise<CreateUserOutput> {
    const userWithSameEmail = await this.userRepository.get(email)
    if (userWithSameEmail) throw new AppError('email already exists', 409)
    const user = {
      name,
      email,
      passwordHash: password,
      role: UserRole.USER,
    }
    await this.userRepository.create(user)
    return { user }
  }
}
