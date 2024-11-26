import { User, UserRole } from '@prisma/client'

import { InMemoryUserRepository } from '../repositories/impl/in-memory-user-repository'
import { DeleteUserUseCase } from './delete-user'

let userRepository: InMemoryUserRepository
let deleteUser: DeleteUserUseCase
const user: User = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  passwordHash: '123456',
  role: UserRole.USER,
}

describe('Delete user', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    deleteUser = new DeleteUserUseCase(userRepository)
    await userRepository.create(user)
  })

  it('should delete an user', async () => {
    await expect(
      deleteUser.execute('johndoe@example.com'),
    ).resolves.toBeUndefined()
  })

  it('should not delete an user if user does not exist', async () => {
    await expect(deleteUser.execute('johndoe2@example.com')).rejects.toThrow(
      'user not found',
    )
  })
})
