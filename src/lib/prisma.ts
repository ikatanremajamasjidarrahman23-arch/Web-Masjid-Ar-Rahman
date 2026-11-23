import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Creates a safe Proxy fallback for Prisma during build / static prerender phases
 * when process.env.DATABASE_URL is not yet defined in the environment.
 * Ensures queries resolve safely to empty arrays / null / 0 instead of throwing.
 */
function createPrismaProxy(): PrismaClient {
  const createModelHandler = (_modelName: string): any => {
    return new Proxy({}, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        return (..._args: any[]) => {
          const methodName = String(prop).toLowerCase();
          if (methodName.includes("count")) return Promise.resolve(0);
          if (methodName.includes("findmany") || methodName.includes("groupby")) return Promise.resolve([]);
          // Default for findFirst, findUnique, create, update, delete, upsert, etc.
          return Promise.resolve(null);
        };
      },
    });
  };

  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (prop === "then") return undefined;
      if (prop === "$connect" || prop === "$disconnect") return () => Promise.resolve();
      if (prop === "$queryRaw" || prop === "$queryRawUnsafe") return () => Promise.resolve([]);
      if (prop === "$executeRaw" || prop === "$executeRawUnsafe") return () => Promise.resolve(0);
      if (prop === "$transaction") {
        return (fn: any) =>
          typeof fn === "function" ? fn(createPrismaProxy()) : Promise.resolve([]);
      }
      return createModelHandler(String(prop));
    },
  });
}

function getPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[prisma] DATABASE_URL is not set. Using safe fallback proxy during build/prerender.");
    }
    return createPrismaProxy();
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
