import { createLogger, format, transports } from "winston";
import { YogaInitialContext } from "graphql-yoga";
import { GraphQLContext } from "../types/context";

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/api.log" }),
  ],
});

export const loggingPlugin = {
  async onRequest({ request }: { request: Request }) {
    const startTime = Date.now();

    logger.info("Incoming request", {
      method: request.method,
      url: request.url,
      timestamp: new Date().toISOString(),
    });

    return {
      onResponse({ response }: { response: Response }) {
        const duration = Date.now() - startTime;

        logger.info("Request completed", {
          status: response.status,
          duration: `${duration}ms`,
        });
      },
    };
  },
};
