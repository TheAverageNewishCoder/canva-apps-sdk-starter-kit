require("dotenv").config();
import * as express from "express";
import * as cors from "cors";
import { createBaseServer } from "./utils/backend/base_backend/create";
import { createJwtMiddleware } from "./utils/backend/jwt_middleware";

async function main() {
  const APP_ID = process.env.CANVA_APP_ID;

  if (!APP_ID) {
    throw new Error(
      `The CANVA_APP_ID environment variable is undefined. Set the variable in the project's .env file.`
    );
  }

  const router = express.Router();

  router.use(cors());

  const jwtMiddleware = createJwtMiddleware(APP_ID);
  router.use(jwtMiddleware);

  router.get("/custom-route", async (req, res) => {
    console.log("request", req.canva);
    res.status(200).send({
      appId: req.canva.appId,
      userId: req.canva.userId,
      brandId: req.canva.brandId,
    });
  });

  const server = createBaseServer(router);
  server.start(process.env.CANVA_BACKEND_PORT);
}

main();
