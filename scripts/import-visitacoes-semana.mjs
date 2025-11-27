import mysql from 'mysql2/promise';

const visitacoes = [
  {
    nome: 'Nadia Araujo',
    telefone: '97018-2224',
    email: 'nadiaaraujo870@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2025-08-15'),
    horario: '18:00',
    tema: 'Jardim encantado ou minie',
  },
  {
    nome: 'Suzane Oliveira',
    telefone: '21974511990',
    email: 'laramarcela0222@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2025-06-02'),
    horario: '20:30',
    tema: 'A definir',
  },
  {
    nome: 'Marcelaine Borges',
    telefone: '21994047374',
    email: 'marcelaine.bs@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2026-06-22'),
    horario: '19:00',
    tema: 'Homem aranha',
  },
  {
    nome: 'Caryne Pacheco',
    telefone: '21974394287',
    email: 'carynedacosta@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2025-09-26'),
    horario: '20:00',
    tema: 'Princesas',
  },
  {
    nome: 'Thais e Cassia',
    telefone: '21967610525',
    email: 'tatarsantos1992@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2026-06-20'),
    horario: '20:00',
    tema: 'Boiadeira',
  },
  {
    nome: 'Jenifer',
    telefone: '21980680221',
    email: 'jeniferqueltrin1@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2026-03-15'),
    horario: '19:00',
    tema: 'Homem aranha',
  },
  {
    nome: 'Karien Soares',
    telefone: '+55 21 98663-5264',
    email: 'Karien.s.Ferreira@gmail.com',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2026-08-15'),
    horario: '21:00',
    tema: 'Não escolhido',
  },
  {
    nome: 'Valzenir',
    telefone: '21997486299',
    email: 'costavalzenir@hotmail.com.br',
    dataVisita: new Date('2025-11-27'),
    dataPretendida: new Date('2026-08-01'),
    horario: '21:30',
    tema: 'Miny',
  },
];

async function importVisitacoes() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const visitacao of visitacoes) {
      try {
        await connection.execute(
          `INSERT INTO visitacoes (
            nome, telefone, email, dataVisita, dataPretendida, 
            horario, tema, status, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'aguardando', NOW(), NOW())`,
          [
            visitacao.nome,
            visitacao.telefone,
            visitacao.email,
            visitacao.dataVisita,
            visitacao.dataPretendida,
            visitacao.horario,
            visitacao.tema,
          ]
        );
        console.log(`✓ Importado: ${visitacao.nome}`);
        successCount++;
      } catch (error) {
        console.error(`✗ Erro ao importar ${visitacao.nome}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Resumo: ${successCount} importadas, ${errorCount} erros`);
  } finally {
    await connection.end();
  }
}

importVisitacoes().catch(console.error);
