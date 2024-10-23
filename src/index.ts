import "reflect-metadata";
import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { createSchema } from "./schema/schema";
import { createContext } from "./middleware/auth";
import { loggingPlugin } from "./middleware/logging";

async function bootstrap() {
  const schema = await createSchema();

  const yoga = createYoga({
    schema,
    context: createContext,
    plugins: [loggingPlugin],
    graphiql: true,
  });

  const server = createServer(yoga);

  const PORT = process.env.PORT || 4000;

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
  });
}

bootstrap().catch(console.error);
