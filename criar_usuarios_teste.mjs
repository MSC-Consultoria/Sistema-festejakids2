import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function criarUsuariosTeste() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('✅ Conectado ao banco de dados\n');
  
  // Hash da senha "123"
  const passwordHash = await bcrypt.hash('123', 10);
  
  const usuarios = [
    { username: 'decoradora', name: 'Decoradora', email: 'decoradora@festejakids.com', role: 'atendente' },
    { username: 'dono', name: 'Dono', email: 'dono@festejakids.com', role: 'gerente' },
    { username: 'fornecedor', name: 'Fornecedor', email: 'fornecedor@festejakids.com', role: 'cliente' },
    { username: 'assistente1', name: 'Assistente 1', email: 'assistente1@festejakids.com', role: 'atendente' },
    { username: 'assistente2', name: 'Assistente 2', email: 'assistente2@festejakids.com', role: 'atendente' },
  ];
  
  for (const user of usuarios) {
    await connection.execute(
      `INSERT INTO users (username, passwordHash, name, email, role, loginMethod) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.username, passwordHash, user.name, user.email, user.role, 'local']
    );
    console.log(`✅ Usuário ${user.name.toUpperCase()} (${user.role}) criado`);
  }
  
  await connection.end();
  console.log('\n🎉 Todos os usuários de teste criados com sucesso!');
  console.log('\nCredenciais (senha: 123 para todos):');
  console.log('  decoradora (atendente)');
  console.log('  dono (gerente)');
  console.log('  fornecedor (cliente)');
  console.log('  assistente1 (atendente)');
  console.log('  assistente2 (atendente)');
}

criarUsuariosTeste().catch(error => {
  console.error('❌ Erro:', error);
  process.exit(1);
});
