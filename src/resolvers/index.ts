import { readdirSync, statSync } from "fs";
import path from "path";
import { NonEmptyArray } from "type-graphql";

const importResolversRecursively = (dir: string): Function[] => {
  const resolvers: Function[] = [];

  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      resolvers.push(...importResolversRecursively(filePath));
    } else if (file.endsWith("Resolver.ts") || file.endsWith("Resolver.js")) {
      console.log("Importing resolver from file:", filePath);
      const resolver = require(filePath);
      const resolverClass =
        resolver.default || resolver[Object.keys(resolver)[0]];

      if (
        typeof resolverClass === "function" &&
        /^\s*class\s+/.test(resolverClass.toString())
      ) {
        console.log("Is resolver a class?", true);
        resolvers.push(resolverClass);
      } else {
        console.log("Is resolver a class?", false);
      }
    }
  }

  return resolvers;
};

const importResolvers = (): NonEmptyArray<Function> => {
  const resolversPath = path.join(__dirname);
  console.log("Resolvers path:", resolversPath);

  const resolvers = importResolversRecursively(resolversPath);

  console.log("Number of resolvers found:", resolvers.length);

  if (resolvers.length === 0) {
    throw new Error("No resolver found. At least one resolver is required.");
  }

  return resolvers as NonEmptyArray<Function>;
};

export { importResolvers };
