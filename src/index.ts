import { createYoga, YogaServerOptions } from 'graphql-yoga';
import { createServer } from 'node:http';
import 'reflect-metadata';
import { createContext } from './middleware/auth';
import { loggingPlugin } from './middleware/logging';
import { createSchema } from './schema/schema';
import type { GraphQLContext } from './types/context';
import { prismaClient } from './utils/prisma';

const isProduction = process.env.NODE_ENV === 'production';

const serverUrl = isProduction ? process.env.NODE_ENV : 'http://localhost:3000';

async function bootstrap() {
  const schema = await createSchema();

  const yogaConfig: YogaServerOptions<object, GraphQLContext> = {
    schema,
    context: async (ctx) => {
      const context = await createContext(ctx);
      return {
        ...context,
        prisma: prismaClient,
      };
    },
    plugins: [loggingPlugin],
    graphiql: !isProduction,
  };

  if (isProduction) {
    yogaConfig.cors = {
      origin: serverUrl,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
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
