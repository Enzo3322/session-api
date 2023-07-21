import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../services/user.services";

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new UserService();
  try {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };

    const session = await service.signInService(username, password);

    return reply
      .code(204)
      .setCookie("sessionId", session.id, {
        httpOnly: true,
        domain: process.env.HOST_URL,
        secure: true,
        sameSite: "none",
        path: "/api",
      })
      .send();
  } catch (err) {
    reply.code(500).send();
  }
};

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new UserService();
  try {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };

    await service.signUpService(username, password);

    return reply.code(200).send({ message: "USER HAS BEEN CREATED" });
  } catch (err) {
    reply.code(500).send();
  }
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new UserService();
  try {
    const { sessionId } = request?.cookies;

    if (!sessionId)
      return reply.code(400).send({ error: "SessionId must be provided" });

    await service.logoutService(sessionId);

    return reply
      .code(204)
      .setCookie("sessionId", sessionId, {
        maxAge: 0,
        httpOnly: true,
        domain: process.env.HOST_URL,
        secure: true,
        sameSite: "none",
        path: "/api",
      })
      .send();
  } catch (err) {
    reply.code(500).send({ error: JSON.stringify(err) });
  }
};

export const whoami = async (request: FastifyRequest, reply: FastifyReply) => {
  const service = new UserService();
  try {
    const { sessionId } = request?.cookies;

    if (!sessionId)
      return reply.code(400).send({ error: "SessionId must be provided" });

    await service.sessionService(sessionId);

    return reply.code(200).send();
  } catch (err) {
    return reply.code(500).send("INTERNAL SERVER ERROR");
  }
};
