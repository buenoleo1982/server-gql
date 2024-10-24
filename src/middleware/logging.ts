import { parse, print } from 'graphql';
import { createLogger, format, transports } from 'winston';

interface ResponseInfo {
  response: Response;
  executionResult: {
    errors?: Array<{ message: string }>;
  };
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message, ...metadata }) => {
      let msg = `${timestamp} ${level}: ${message} `;
      if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata, null, 2);
      }
      return msg;
    }),
  ),
  transports: [new transports.Console()],
});

const sensitiveFields = ['password', 'token', 'authorization'];

const maskSensitiveData = (obj: unknown): unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const maskedObj: Record<string, unknown> | unknown[] = Array.isArray(obj) ? [] : {};

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item));
  }

  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      (maskedObj as Record<string, unknown>)[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      (maskedObj as Record<string, unknown>)[key] = maskSensitiveData(value);
    } else {
      (maskedObj as Record<string, unknown>)[key] = value;
    }
  }

  return maskedObj;
};

const maskSensitiveQuery = (query: string): string => {
  const sensitiveRegex = new RegExp(`(${sensitiveFields.join('|')}):\\s*"([^"]*)"`, 'gi');
  return query.replace(sensitiveRegex, (_, field) => `${field}: "[REDACTED]"`);
};

const extractOperationName = (query?: string): string | undefined => {
  if (!query) return undefined;
  const match = query.match(/^\s*(query|mutation|subscription)\s+(\w+)/);
  return match ? match[2] : undefined;
};

export const loggingPlugin = {
  async onRequest({ request }: { request: Request }) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(2, 15);

    let operationName: string | undefined;
    let query: string | undefined;
    let variables: Record<string, unknown> | undefined;
    let datasource: string | null = null;

    if (request.headers.get('content-type')?.includes('application/json')) {
      try {
        const clonedRequest = request.clone();
        const body = await clonedRequest.json();
        operationName = body.operationName;
        query = body.query;
        variables = body.variables;
        datasource = clonedRequest.headers.get('x-datasource');
      } catch (error) {
        console.error('Error parsing request body:', error);
      }
    }

    operationName = operationName || extractOperationName(query) || 'UnknownOperation';

    logger.info('Incoming request', {
      requestId,
      url: request.url,
      operation: operationName,
      datasource,
      query: query
        ? (() => {
            try {
              const parsedQuery = parse(query);
              const printedQuery = print(parsedQuery);
              return maskSensitiveQuery(printedQuery);
            } catch (error) {
              console.error('Invalid GraphQL query:', error);
              return 'Invalid GraphQL query';
            }
          })()
        : undefined,
      variables: variables ? maskSensitiveData(variables) : undefined,
    });

    return {
      async onResponse({ response, executionResult }: ResponseInfo) {
        const duration = Date.now() - startTime;

        logger.info('Request completed', {
          requestId,
          status: response.status,
          duration: `${duration}ms`,
          operation: operationName,
          errors: executionResult.errors?.map((e) => e.message),
        });
      },
    };
  },
};
