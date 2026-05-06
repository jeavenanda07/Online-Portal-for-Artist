import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
// Update the path to match your custom output folder
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };