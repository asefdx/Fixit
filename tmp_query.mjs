import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const rows = await prisma.booking.findMany({
    take: 10,
    select: { id: true, bookingNumber: true, status: true },
  });
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await prisma.$disconnect();
}
