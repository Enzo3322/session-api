import { FastifyInstance } from "fastify";
import * as controllers from "../controllers";

async function userRouter(fastify: FastifyInstance) {
  fastify.post("/signin", {
    handler: controllers.signIn,
  });

  fastify.post("/signup", {
    handler: controllers.signUp,
  });

  fastify.post("/logout", {
    handler: controllers.logout,
  });

  fastify.get("/whoami", {
    handler: controllers.whoami,
  });
}

export default userRouter;
