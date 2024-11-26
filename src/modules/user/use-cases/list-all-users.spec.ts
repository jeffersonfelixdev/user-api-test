import { User, UserRole } from '@prisma/client'

import { InMemoryUserRepository } from '../repositories/impl/in-memory-user-repository'
import { ListAllUsersUseCase } from './list-all-users'

let userRepository: InMemoryUserRepository
let listAllUsers: ListAllUsersUseCase
const user: User = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  passwordHash: '123456',
  role: UserRole.USER,
}

describe('listUsers', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    listAllUsers = new ListAllUsersUseCase(userRepository)
    await userRepository.create(user)
  })

  it('should return a list of users', async () => {
    const { users } = await listAllUsers.execute()
    expect(users).toBeInstanceOf(Array)
  })
})
