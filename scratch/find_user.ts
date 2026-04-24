import { PrismaClient } from '../backend/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 1,
    include: {
      _count: {
        select: { jobs: true }
      }
    }
  });
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
