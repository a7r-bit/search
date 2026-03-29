import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const roles = ["User", "Technician", "Admin", "Owner"];
    await prisma.$transaction(async (tx) => {
        for (const role of roles) {
            await tx.role.upsert({
                where: { name: role },
                create: { name: role },
                update: {}
            })
        }
    })

    console.log("Roles Seeded");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})