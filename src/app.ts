import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";
import cookie, { FastifyCookieOptions } from "@fastify/cookie";
import userRouter from "./routes/user.route";
import { checkValidUser } from "./middlewares/auth";

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.addHook("preValidation", checkValidUser);

  await fastify.register(import("@fastify/rate-limit"), {
    global: false,
  });

  void fastify.setErrorHandler(function (error, request, reply) {
    if (error.statusCode === 429) {
      reply.code(429);
      error.message = "You hit the rate limit! Slow down please!";
    }
    reply.send(error);
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  void fastify.register(cookie, {
    parseOptions: {},
  } as FastifyCookieOptions);

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  void fastify.register(userRouter, { prefix: "/api" });
};

export default app;
export { app, options };
