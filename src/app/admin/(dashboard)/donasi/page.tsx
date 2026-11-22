import { prisma } from "@/lib/prisma";
import DonasiAdminClient from "./DonasiAdminClient";

export const revalidate = 0;

export default async function AdminDonasiPage() {
  const finances = await prisma.finance.findMany({
    orderBy: { date: "desc" },
  });

  const totalIn = finances.filter(f => f.type === "IN").reduce((acc, curr) => acc + curr.amount, 0);
  const totalOut = finances.filter(f => f.type === "OUT").reduce((acc, curr) => acc + curr.amount, 0);
  const saldo = totalIn - totalOut;

  return (
    <DonasiAdminClient
      initialFinances={finances.map(f => ({
        ...f,
        date: f.date.toISOString(),
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
      }))}
      totalIn={totalIn}
      totalOut={totalOut}
      saldo={saldo}
    />
  );
}

