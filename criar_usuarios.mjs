import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

async function criarUsuarios() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('✅ Conectado ao banco de dados\n');
  
  // Hash da senha "123"
  const passwordHash = await bcrypt.hash('123', 10);
  
  // Criar Moises (ADMIN)
  await connection.execute(
    `INSERT INTO users (username, passwordHash, name, email, role, loginMethod) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['moises', passwordHash, 'Moises', 'moises@festejakids.com', 'admin', 'local']
  );
  console.log('✅ Usuário MOISES (admin) criado');
  
  // Criar Gabriel (SUPERVISOR)
  await connection.execute(
    `INSERT INTO users (username, passwordHash, name, email, role, loginMethod) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['gabriel', passwordHash, 'Gabriel', 'gabriel@festejakids.com', 'supervisor', 'local']
  );
  console.log('✅ Usuário GABRIEL (supervisor) criado');
  
  await connection.end();
  console.log('\n🎉 Usuários criados com sucesso!');
  console.log('\nCredenciais:');
  console.log('  Moises: username=moises, senha=123, role=admin');
  console.log('  Gabriel: username=gabriel, senha=123, role=supervisor');
}

criarUsuarios().catch(error => {
  console.error('❌ Erro:', error);
  process.exit(1);
});
