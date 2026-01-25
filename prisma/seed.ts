import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@ecom.com' },
        update: {},
        create: {
            email: 'admin@ecom.com',
            name: 'Super Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('Admin user created: admin@ecom.com');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());