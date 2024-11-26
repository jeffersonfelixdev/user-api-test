import { User } from '@prisma/client'

import { UserRepository } from '../user-repository'

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async create(user: User): Promise<void> {
    this.users.push(user)
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.email === user.email)
    this.users[index] = user
  }

  async get(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email)
  }

  async all(): Promise<User[]> {
    return this.users
  }

  async delete(email: string): Promise<void> {
    const index = this.users.findIndex(user => user.email === email)
    this.users.splice(index, 1)
  }
}
