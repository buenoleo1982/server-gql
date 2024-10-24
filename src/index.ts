import "reflect-metadata";
import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { createSchema } from "./schema/schema";
import { createContext } from "./middleware/auth";
import { loggingPlugin } from "./middleware/logging";

const isProduction = process.env.NODE_ENV === "production";

const serverUrl = isProduction ? process.env.NODE_ENV : "http://localhost:3000";

async function bootstrap() {
  const schema = await createSchema();

  const yogaConfig: any = {
    schema,
    context: createContext,
    plugins: [loggingPlugin],
    graphiql: !isProduction,
  };

  if (isProduction) {
    yogaConfig.cors = {
      origin: serverUrl,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      credentials: true,
    };
  }

  const yoga = createYoga(yogaConfig);

  const server = createServer(yoga);

  const PORT = process.env.PORT || 4000;

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(console.error);
