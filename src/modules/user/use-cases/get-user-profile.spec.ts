import { User, UserRole } from '@prisma/client'

import { InMemoryUserRepository } from '../repositories/impl/in-memory-user-repository'
import { GetUserProfileUseCase } from './get-user-profile'

let userRepository: InMemoryUserRepository
let getUserProfile: GetUserProfileUseCase
const user: User = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  passwordHash: '123456',
  role: UserRole.USER,
}

describe('Get User Profile', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    getUserProfile = new GetUserProfileUseCase(userRepository)
    await userRepository.create(user)
  })

  it('should get user profile', async () => {
    const { user: userProfile } =
      await getUserProfile.execute('johndoe@email.com')
    expect(userProfile.email).toEqual('johndoe@email.com')
  })

  it('should not get user profile if user does not exist', async () => {
    await expect(getUserProfile.execute('janedoe@email.com')).rejects.toThrow(
      'user not found',
    )
  })
})
