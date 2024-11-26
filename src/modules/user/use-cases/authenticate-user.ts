import { AppError } from '../../../shared/errors/app-error'
import { UserRepository } from '../repositories/user-repository'

interface AuthenticateUserInput {
  email: string
  password: string
}

export class AuthenticateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute({ email, password }: AuthenticateUserInput) {
    const user = await this.userRepository.get(email)
    if (!user) throw new AppError('invalid email/password', 401)
    if (user.passwordHash !== password)
      throw new AppError('invalid email/password', 401)
    return { user }
  }
}
