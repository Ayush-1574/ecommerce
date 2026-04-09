import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

async function createSuperAdmin() {
  const email = process.env.SUPERADMIN_EMAIL || "superadmin@shopverse.com";
  const password = process.env.SUPERADMIN_PASSWORD || "SuperAdmin@123";
  const userName = process.env.SUPERADMIN_USERNAME || "superadmin";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role !== "superadmin") {
      // Upgrade existing user to superadmin
      const updated = await prisma.user.update({
        where: { email },
        data: { role: "superadmin" },
      });
      console.log(`✓ Upgraded existing user to superadmin: ${updated.email}`);
    } else {
      console.log(`ℹ  Superadmin already exists: ${existing.email}`);
    }
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      userName,
      email,
      password: hashed,
      role: "superadmin",
    },
  });

  console.log("\n✅ Superadmin created successfully!");
  console.log("─────────────────────────────────");
  console.log(`  Email    : ${user.email}`);
  console.log(`  Username : ${user.userName}`);
  console.log(`  Password : ${password}`);
  console.log(`  Role     : ${user.role}`);
  console.log("─────────────────────────────────");
  console.log("⚠  Change the password after first login!\n");
}

createSuperAdmin()
  .catch((e) => {
    console.error("❌ Error creating superadmin:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
