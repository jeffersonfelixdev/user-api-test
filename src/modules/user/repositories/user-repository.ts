import { User } from '@prisma/client'

export interface CreateUserDTO {
  name: string
  email: string
  password: string
}

export interface UserRepository {
  create(user: User): Promise<void>
  update(user: User): Promise<void>
  get(email: string): Promise<User | undefined>
  all(): Promise<User[]>
  delete(email: string): Promise<void>
}
