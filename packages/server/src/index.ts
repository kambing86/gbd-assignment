import express from "express";
import logger from "./logger";

const port = 8010;

(async () => {
  const application = express();

  application.listen(port, () => {
    logger.info(`App started and listening on port ${port}`);
  });
})();
