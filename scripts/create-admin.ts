import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Criando usuário administrador padrão...');

    // E-mail e senha padrão (altere após o primeiro login)
    const adminEmail = process.env.ADMIN_LOGIN_USER || 'admin@jovemaprendizvagas.com.br';
    const adminPassword = process.env.ADMIN_SECRET_KEY || 'admin123456';

    // Verificar se usuário já existe
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminEmail.toLowerCase() }
    });

    if (existingAdmin) {
      console.log('✅ Usuário administrador já existe:', existingAdmin.email);
      console.log('🔄 Atualizando senha para o padrão...');
      
      // Atualizar senha
      const hashedPassword = await hashPassword(adminPassword);
      await prisma.adminUser.update({
        where: { id: existingAdmin.id },
        data: { 
          passwordHash: hashedPassword,
          isActive: true,
          updatedAt: new Date()
        }
      });
      
      console.log('✅ Senha do administrador atualizada com sucesso!');
      console.log(`📧 E-mail: ${adminEmail}`);
      console.log(`🔑 Senha: ${adminPassword}`);
      console.log('⚠️  Altere a senha após o primeiro login!');
      return;
    }

    // Criar novo usuário administrador
    const hashedPassword = await hashPassword(adminPassword);
    
    const adminUser = await prisma.adminUser.create({
      data: {
        email: adminEmail.toLowerCase(),
        passwordHash: hashedPassword,
        name: 'Administrador',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📋 Dados de acesso:');
    console.log(`📧 E-mail: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminPassword}`);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    console.log(`🆔 ID do usuário: ${adminUser.id}`);

  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar criação do admin
createAdminUser()
  .then(() => {
    console.log('🎉 Script de criação de admin concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha no script:', error);
    process.exit(1);
  });
