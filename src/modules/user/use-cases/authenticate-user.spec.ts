import { User, UserRole } from '@prisma/client'

import { InMemoryUserRepository } from '../repositories/impl/in-memory-user-repository'
import { AuthenticateUserUseCase } from './authenticate-user'

let userRepository: InMemoryUserRepository
let authenticateUser: AuthenticateUserUseCase
const user: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  passwordHash: '123456',
  role: UserRole.USER,
}

describe('Authenticate User', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    authenticateUser = new AuthenticateUserUseCase(userRepository)
    await userRepository.create(user)
  })

  it('should authenticate an user', async () => {
    const { user } = await authenticateUser.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })
    expect(user.name).toEqual('John Doe')
  })

  it('should not authenticate an user with invalid email', async () => {
    await expect(
      authenticateUser.execute({
        email: 'janedoe@example.com',
        password: '123456',
      }),
    ).rejects.toThrow('invalid email/password')
  })

  it('should not authenticate an user with invalid password', async () => {
    await expect(
      authenticateUser.execute({
        email: 'john.doe@example.com',
        password: '1234567',
      }),
    ).rejects.toThrow('invalid email/password')
  })
})
