import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function createAdmin() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const email = 'admin@portfolio.com';
    const password = 'admin123';
    
    console.log('🔄 Checking if admin user already exists...');
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', email);
      console.log('🔑 You can login with:');
      console.log('   Email:', email);
      console.log('   Password: admin123');
      return;
    }

    console.log('🔄 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('🔄 Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('🌐 You can now login at: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    
    if (error.code === 'P1001') {
      console.log('');
      console.log('🔧 Database connection failed. Please check:');
      console.log('1. MySQL server is running');
      console.log('2. Database "portfolio_db" exists');
      console.log('3. DATABASE_URL in .env.local is correct');
      console.log('');
      console.log('Current DATABASE_URL format should be:');
      console.log('DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"');
    }
    
    if (error.code === 'P2002') {
      console.log('');
      console.log('⚠️  User with this email already exists');
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdmin().catch((error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});