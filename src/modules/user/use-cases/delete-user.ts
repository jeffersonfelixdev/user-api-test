import { AppError } from '../../../shared/errors/app-error'
import { UserRepository } from '../repositories/user-repository'

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(email: string) {
    const user = await this.userRepository.get(email)
    if (!user) throw new AppError('user not found', 404)
    await this.userRepository.delete(email)
  }
}
