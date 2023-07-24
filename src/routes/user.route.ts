import { FastifyInstance } from "fastify";
import * as controllers from "../controllers";

async function userRouter(fastify: FastifyInstance) {
  fastify.post("/signin", {
    handler: controllers.signIn,
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 1,
      },
    },
  });

  fastify.post("/signup", {
    handler: controllers.signUp,
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 1,
      },
    },
  });

  fastify.post("/logout", {
    handler: controllers.logout,
  });

  fastify.get("/whoami", {
    handler: controllers.whoami,
  });
}

export default userRouter;
