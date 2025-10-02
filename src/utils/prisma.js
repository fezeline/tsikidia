const prismaClient = require ("../generated/prisma/client");

const prisma = new prismaClient.PrismaClient();

module.exports = prisma;