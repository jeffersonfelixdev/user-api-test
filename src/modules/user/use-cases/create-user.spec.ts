import { UserRole } from '@prisma/client'

import { InMemoryUserRepository } from '../repositories/impl/in-memory-user-repository'
import { CreateUserUseCase } from './create-user'

let userRepository: InMemoryUserRepository
let createUser: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    createUser = new CreateUserUseCase(userRepository)
  })

  it('should create an user', async () => {
    const { user } = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })
    expect(user.email).toEqual('johndoe@email.com')
    expect(user.role).toEqual(UserRole.USER)
  })

  it('should not create an user if email already exists', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      passwordHash: '123456',
      role: UserRole.USER,
    })
    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      }),
    ).rejects.toThrow('email already exists')
  })
})
