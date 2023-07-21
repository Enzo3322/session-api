import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { SessionModel } from "../repositories/user.repository";

export const checkValidUser = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (request.url !== "/api/user/signin") {
    try {
      let { sessionId } = request?.cookies;

      if (!sessionId) {
        throw new Error("SessionId must be provided");
      }

      const { session } = new PrismaClient();
      const handler = new SessionModel(session);

      const userSession = await handler.getSession({ sessionId });

      if (!userSession) throw new Error("Session not found");

      const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000;
      const currentDate = new Date();
      const underTime =
        currentDate.getTime() - userSession.createdAt.getTime() <=
        twelveHoursInMilliseconds;

      if (!underTime) {
        await handler.logout({ sessionId });
        throw new Error("Token expired");
      }
    } catch (e) {
      return reply.code(500).send({ error: e });
    }
  }
};
