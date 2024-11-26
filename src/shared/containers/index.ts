import { createContainer } from 'iti'

import { PrismaUserRepository } from '../../modules/user/repositories/impl/prisma-user-repository'
import { AuthenticateUserUseCase } from '../../modules/user/use-cases/authenticate-user'
import { CreateUserUseCase } from '../../modules/user/use-cases/create-user'
import { DeleteUserUseCase } from '../../modules/user/use-cases/delete-user'
import { GetUserProfileUseCase } from '../../modules/user/use-cases/get-user-profile'
import { ListAllUsersUseCase } from '../../modules/user/use-cases/list-all-users'
import { UpdateUserUseCase } from '../../modules/user/use-cases/update-user'
import { UpdateUserProfileUseCase } from '../../modules/user/use-cases/update-user-profile'

export const container = createContainer()
  .add({
    userRepository: () => new PrismaUserRepository(),
  })
  .add(ctx => ({
    createUser: () => new CreateUserUseCase(ctx.userRepository),
    deleteUser: () => new DeleteUserUseCase(ctx.userRepository),
    getUserProfile: () => new GetUserProfileUseCase(ctx.userRepository),
    listAllUsers: () => new ListAllUsersUseCase(ctx.userRepository),
    updateUserProfile: () => new UpdateUserProfileUseCase(ctx.userRepository),
    updateUser: () => new UpdateUserUseCase(ctx.userRepository),
    authenticateUserUseCase: () =>
      new AuthenticateUserUseCase(ctx.userRepository),
  }))
