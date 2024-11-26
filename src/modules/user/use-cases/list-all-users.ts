import { UserRepository } from '../repositories/user-repository'

export class ListAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute() {
    const users = await this.userRepository.all()
    return { users }
  }
}
