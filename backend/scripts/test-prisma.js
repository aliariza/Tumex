import prisma from "../src/prisma.js";

async function main() {
  const machine = await prisma.machine.create({
    data: {
      category: "laser_cutting",
      brand: "Tumex",
      family: "Laser Cutting",
      series: "TEST",
      model: "TEST-3015",
      title: "Test Laser Cutting Machine",
      description: "Temporary test machine from Prisma/Postgres setup",
      price: 0,
      powerKw: 3,
      workingAreaCode: "3015",
      specs: {
        create: [
          {
            key: "power",
            label: "Lazer Gücü",
            value: "3KW",
            order: 1,
          },
          {
            key: "workingArea",
            label: "Çalışma Alanı",
            value: "3015",
            order: 2,
          },
        ],
      },
    },
    include: {
      specs: true,
    },
  });

  console.log("Created machine:");
  console.log(machine);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
