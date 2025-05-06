import { PrismaClient } from "@prisma/client";

class PrismaClientSignleton {
  private static prisma: PrismaClient;

  private constructor() {}

  public static getInstance() {
    if (!PrismaClientSignleton.prisma) {
      PrismaClientSignleton.prisma = new PrismaClient({
        log: ["query", "info", "warn", "error"],
        errorFormat: "pretty",
      });
    }
    return PrismaClientSignleton.prisma;
  }
}

const prisma = PrismaClientSignleton.getInstance();
export default prisma;
