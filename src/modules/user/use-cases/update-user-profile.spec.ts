import { User, UserRole } from '@prisma/client'

import { InMemoryUserRepository } from '../repositories/impl/in-memory-user-repository'
import { UpdateUserProfileUseCase } from './update-user-profile'

let userRepository: InMemoryUserRepository
let updateUserProfile: UpdateUserProfileUseCase
const user: User = {
  email: 'johndoe@email.com',
  passwordHash: 'abc1234',
  name: 'John Doe',
  role: UserRole.USER,
}

describe('Update User Profile', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    updateUserProfile = new UpdateUserProfileUseCase(userRepository)
    await userRepository.create(user)
  })

  it('should not update an user if user does not exist', async () => {
    await expect(
      updateUserProfile.execute({
        email: 'janedoe@email.com',
        name: 'Jane Doe Not Found',
        password: 'abcd1234',
      }),
    ).rejects.toThrow('user not found')
  })

  it('should update an user name', async () => {
    await updateUserProfile.execute({
      email: 'johndoe@email.com',
      name: 'John Doe Updated',
    })
    const updatedUser = (await userRepository.get(user.email)) as User
    expect(updatedUser.name).toEqual('John Doe Updated')
    expect(updatedUser.passwordHash).toEqual(user.passwordHash)
  })

  it('should update an user password', async () => {
    await updateUserProfile.execute({
      email: 'johndoe@email.com',
      password: 'NewPassword123',
    })
    const updatedUser = (await userRepository.get(user.email)) as User
    expect(updatedUser.passwordHash).toEqual('NewPassword123')
  })
})
