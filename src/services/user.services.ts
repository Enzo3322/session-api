import { SessionModel, UsersModel } from "../repositories/user.repository";
import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcryptjs";

export default class UserService {
  sessionService = async (sessionId: string) => {
    try {
      const { session } = new PrismaClient();
      const handler = new SessionModel(session);

      if (!sessionId) throw new Error("Session Error");

      const validSession = handler.getSession({ sessionId });

      if (!validSession) throw new Error("Session Error");

      return validSession;
    } catch (e) {
      throw new Error("Session Error");
    }
  };

  signInService = async (username: string, password: string) => {
    const { user, session } = new PrismaClient();
    const userHandler = new UsersModel(user);
    const sessionHandler = new SessionModel(session);

    const userData = await userHandler.findByUsername({ username });

    if (!userData) {
      throw new Error("User not found");
    }

    const validCredential = compareSync(password, userData.password);

    if (!validCredential) throw new Error("Invalid credentials");

    const sessionId = await sessionHandler.createSession(userData.id);

    return sessionId;
  };

  signUpService = async (username: string, password: string) => {
    const prisma = new PrismaClient();
    const handler = new UsersModel(prisma.user);

    const alreadyExists = await handler.findByUsername({ username });

    if (alreadyExists) throw new Error("ACCOUNT ALREADY EXISTS");

    const user = await handler.createUser({
      username,
      password,
    });

    if (!user) throw new Error("User not exists");

    return user;
  };

  logoutService = async (sessionId: string) => {
    if (!sessionId) throw new Error("SessionId must be provided");
    const { session } = new PrismaClient();
    const handler = new SessionModel(session);

    const killSession = await handler.logout({ sessionId });

    if (!killSession) throw new Error("Cannot kill session");

    return { message: `Session "${sessionId}" killed!` };
  };
}
