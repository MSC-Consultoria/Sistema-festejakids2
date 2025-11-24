#!/usr/bin/env node

/**
 * Script para resetar completamente o banco de dados
 * e criar 3 usuários padrão: Moises, Gabriel, Adriano
 * 
 * Uso: node scripts/reset-database.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL não configurada!");
  console.error("Configure a variável de ambiente DATABASE_URL antes de executar este script.");
  process.exit(1);
}

console.log("🔄 Conectando ao banco de dados...");
const db = drizzle(DATABASE_URL);

async function resetDatabase() {
  try {
    console.log("\n⚠️  ATENÇÃO: Este script irá DELETAR TODOS OS DADOS do banco!");
    console.log("Aguardando 5 segundos antes de continuar...\n");
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("🗑️  Deletando todos os dados...\n");
    
    // Deletar dados de todas as tabelas (ordem importa por causa de foreign keys)
    console.log("  - Deletando pagamentos...");
    await db.execute(sql`DELETE FROM pagamentos`);
    
    console.log("  - Deletando custos variáveis...");
    await db.execute(sql`DELETE FROM custosVariaveis`);
    
    console.log("  - Deletando custos fixos...");
    await db.execute(sql`DELETE FROM custosFixos`);
    
    console.log("  - Deletando festas...");
    await db.execute(sql`DELETE FROM festas`);
    
    console.log("  - Deletando visitações...");
    await db.execute(sql`DELETE FROM visitacoes`);
    
    console.log("  - Deletando clientes...");
    await db.execute(sql`DELETE FROM clientes`);
    
    console.log("  - Deletando usuários...");
    await db.execute(sql`DELETE FROM users`);
    
    console.log("\n✅ Banco de dados limpo com sucesso!");
    
    // Criar 3 usuários padrão
    console.log("\n👥 Criando usuários padrão...\n");
    
    const usuarios = [
      {
        openId: "moises-festeja-kids",
        name: "Moises",
        email: "moises@festejakids.com",
        loginMethod: "password",
        role: "admin"
      },
      {
        openId: "gabriel-festeja-kids",
        name: "Gabriel",
        email: "gabriel@festejakids.com",
        loginMethod: "password",
        role: "admin"
      },
      {
        openId: "adriano-festeja-kids",
        name: "Adriano",
        email: "adriano@festejakids.com",
        loginMethod: "password",
        role: "admin"
      }
    ];
    
    for (const usuario of usuarios) {
      console.log(`  - Criando usuário: ${usuario.name}`);
      await db.execute(sql`
        INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
        VALUES (
          ${usuario.openId},
          ${usuario.name},
          ${usuario.email},
          ${usuario.loginMethod},
          ${usuario.role},
          NOW(),
          NOW(),
          NOW()
        )
      `);
    }
    
    console.log("\n✅ Usuários criados com sucesso!");
    console.log("\n📋 Usuários padrão:");
    console.log("  1. Moises (moises@festejakids.com) - Admin");
    console.log("  2. Gabriel (gabriel@festejakids.com) - Admin");
    console.log("  3. Adriano (adriano@festejakids.com) - Admin");
    console.log("\n⚠️  Senha padrão: 123");
    console.log("⚠️  Todos os usuários deverão trocar a senha no primeiro login\n");
    
    console.log("✨ Reset do banco de dados concluído!");
    
  } catch (error) {
    console.error("\n❌ Erro ao resetar banco de dados:", error);
    process.exit(1);
  }
}

// Executar reset
resetDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
