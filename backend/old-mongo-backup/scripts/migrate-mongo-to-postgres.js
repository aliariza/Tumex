import "dotenv/config";
import mongoose from "mongoose";
import prisma from "../src/prisma.js";
import Machine from "../models/Machine.js";

function toPrismaCategory(category) {
  if (category === "laser-cutting") return "laser_cutting";
  if (category === "laser-welding") return "laser_welding";
  if (category === "abkant") return "abkant";

  throw new Error(`Unknown category: ${category}`);
}

function normalizeSpecs(specs = []) {
  return specs
    .filter((spec) => spec && (spec.key || spec.label || spec.value))
    .map((spec, index) => ({
      key: String(spec.key || spec.label || `spec_${index + 1}`),
      label: String(spec.label || spec.key || `Spec ${index + 1}`),
      value: String(spec.value ?? ""),
      order: Number.isFinite(Number(spec.order)) ? Number(spec.order) : index + 1,
    }));
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);

  console.log("Reading MongoDB machines...");
  const mongoMachines = await Machine.find({}).lean();

  console.log(`Found ${mongoMachines.length} machines in MongoDB.`);

  for (const oldMachine of mongoMachines) {
    const category = toPrismaCategory(oldMachine.category);
    const specs = normalizeSpecs(oldMachine.specs);

    if (!oldMachine.series || !oldMachine.model) {
      console.warn("Skipping machine with missing series/model:", oldMachine);
      continue;
    }

    const data = {
      category,
      brand: oldMachine.brand ?? null,
      family: oldMachine.family ?? null,
      series: String(oldMachine.series),
      model: String(oldMachine.model),
      title: oldMachine.title ?? null,
      description: oldMachine.description ?? null,
      price: oldMachine.price != null ? Number(oldMachine.price) : null,
      image: oldMachine.image ?? null,
      gallery: Array.isArray(oldMachine.gallery) ? oldMachine.gallery : [],

      pressForceTon:
        oldMachine.pressForceTon != null ? Number(oldMachine.pressForceTon) : null,

      bendingLengthMm:
        oldMachine.bendingLengthMm != null ? Number(oldMachine.bendingLengthMm) : null,

      powerKw:
        oldMachine.powerKw != null ? Number(oldMachine.powerKw) : null,

      workingAreaCode: oldMachine.workingAreaCode ?? null,
    };

    await prisma.machine.upsert({
      where: {
        category_series_model: {
          category: data.category,
          series: data.series,
          model: data.model,
        },
      },
      update: {
        ...data,
        specs: {
          deleteMany: {},
          create: specs,
        },
      },
      create: {
        ...data,
        specs: {
          create: specs,
        },
      },
    });

    console.log(
      `Migrated: ${oldMachine.category} / ${oldMachine.series} / ${oldMachine.model}`
    );
  }

  console.log("Migration finished.");
}

main()
  .catch((error) => {
    console.error("Migration failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    await prisma.$disconnect();
  });
