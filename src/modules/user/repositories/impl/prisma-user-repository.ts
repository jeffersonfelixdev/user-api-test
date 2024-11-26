import { User } from '@prisma/client'

import { DatabaseConnection } from '../../../../config/database'
import { UserRepository } from '../user-repository'

const { prisma } = DatabaseConnection.getInstance()

export class PrismaUserRepository implements UserRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({ data: user })
  }

  async update({ email, name, passwordHash, role }: User): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: { name, passwordHash, role },
    })
  }

  async get(email: string): Promise<User | undefined> {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return undefined
    return user
  }

  async all(): Promise<User[]> {
    return prisma.user.findMany()
  }

  async delete(email: string): Promise<void> {
    await prisma.user.delete({ where: { email } })
  }
}
