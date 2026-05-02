import "dotenv/config";
import mongoose from "mongoose";
import prisma from "../src/prisma.js";

import User from "../models/User.js";
import JobPosition from "../models/JobPosition.js";

function validRole(role) {
  if (["user", "dealer", "admin"].includes(role)) return role;
  return "user";
}

async function migrateUsers() {
  const users = await User.find({}).lean();
  console.log(`Found ${users.length} Mongo users.`);

  for (const oldUser of users) {
    if (!oldUser.email || !oldUser.username || !oldUser.password) {
      console.warn("Skipping user with missing required fields:", oldUser.email || oldUser._id);
      continue;
    }

    await prisma.user.upsert({
      where: {
        email: String(oldUser.email).toLowerCase(),
      },
      update: {
        username: oldUser.username,
        password: oldUser.password,
        companyname: oldUser.companyname ?? null,
        telephone: oldUser.telephone ?? null,
        address: oldUser.address ?? null,
        role: validRole(oldUser.role),
      },
      create: {
        username: oldUser.username,
        email: String(oldUser.email).toLowerCase(),
        password: oldUser.password,
        companyname: oldUser.companyname ?? null,
        telephone: oldUser.telephone ?? null,
        address: oldUser.address ?? null,
        role: validRole(oldUser.role),
        createdAt: oldUser.createdAt ?? undefined,
        updatedAt: oldUser.updatedAt ?? undefined,
      },
    });

    console.log(`Migrated user: ${oldUser.email}`);
  }
}

async function migrateJobPositions() {
  const positions = await JobPosition.find({}).lean();
  console.log(`Found ${positions.length} Mongo job positions.`);

  for (const oldPosition of positions) {
    if (!oldPosition.title || !oldPosition.department || !oldPosition.summary) {
      console.warn("Skipping job position with missing required fields:", oldPosition._id);
      continue;
    }

    await prisma.jobPosition.create({
      data: {
        title: oldPosition.title,
        department: oldPosition.department,
        locationType: oldPosition.locationType ?? "Ofis içi",
        employmentType: oldPosition.employmentType ?? "Tam zamanlı",
        summary: oldPosition.summary,
        highlights: Array.isArray(oldPosition.highlights) ? oldPosition.highlights : [],
        applicationEmail: oldPosition.applicationEmail ?? "info@tum-ex.com",
        applicationSubject: oldPosition.applicationSubject ?? "",
        sortOrder: Number.isFinite(Number(oldPosition.sortOrder))
          ? Number(oldPosition.sortOrder)
          : 0,
        isPublished: Boolean(oldPosition.isPublished),
        createdAt: oldPosition.createdAt ?? undefined,
        updatedAt: oldPosition.updatedAt ?? undefined,
      },
    });

    console.log(`Migrated job position: ${oldPosition.title}`);
  }
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);

  await migrateUsers();
  await migrateJobPositions();

  console.log("Users and job positions migration finished.");
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
