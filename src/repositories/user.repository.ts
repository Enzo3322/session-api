import { PrismaClient, Session } from "@prisma/client";
import { hashSync } from "bcryptjs";

export class UsersModel {
  constructor(private readonly prismaUser: PrismaClient["user"]) {}
  async findByUsername(data: { username: string }): Promise<{
    username: string;
    password: string;
    id: string;
  } | null> {
    return this.prismaUser.findFirst({
      where: { username: data.username },
    });
  }

  async createUser(data: { username: string; password: string }): Promise<any> {
    const hashedPassword = hashSync(data.password, 15);

    return this.prismaUser.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }
}

export class SessionModel {
  constructor(private readonly prismaUserSession: PrismaClient["session"]) {}

  async logout({ sessionId }: { sessionId: string }): Promise<Session> {
    return this.prismaUserSession.delete({
      where: {
        id: sessionId,
      },
    });
  }

  async getSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<Session | null> {
    return this.prismaUserSession.findFirst({
      where: { id: sessionId },
    });
  }

  async createSession(userId: string): Promise<Session> {
    return this.prismaUserSession.create({
      data: {
        userId,
      },
    });
  }
}
