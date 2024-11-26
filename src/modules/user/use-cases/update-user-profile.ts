import { AppError } from '../../../shared/errors/app-error'
import { UserRepository } from '../repositories/user-repository'

interface UpdateUserProfileInput {
  name?: string
  email: string
  password?: string
}

export class UpdateUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ name, email, password }: UpdateUserProfileInput) {
    const user = await this.userRepository.get(email)
    if (!user) throw new AppError('user not found', 404)
    user.name = name ?? user.name
    if (password) user.passwordHash = password
    await this.userRepository.update(user)
  }
}
