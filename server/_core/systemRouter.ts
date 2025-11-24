import { z } from "zod";
import { sql } from "drizzle-orm";
import { notifyOwner } from "./notification";
import { adminProcedure, publicProcedure, router } from "./trpc";
import { getDb } from "../db";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),

  /**
   * Resetar banco de dados (apenas para fase de implementação)
   * ATENÇÃO: Deleta TODOS os dados e recria usuários padrão
   */
  resetDatabase: adminProcedure
    .input(
      z.object({
        confirmacao: z.literal("RESETAR BANCO"),
      })
    )
    .mutation(async () => {
      const db = await getDb();
      if (!db) {
        throw new Error("Banco de dados não disponível");
      }

      try {
        // Deletar dados de todas as tabelas (ordem importa por causa de foreign keys)
        await db.execute(sql`DELETE FROM pagamentos`);
        await db.execute(sql`DELETE FROM custosVariaveis`);
        await db.execute(sql`DELETE FROM custosFixos`);
        await db.execute(sql`DELETE FROM festas`);
        await db.execute(sql`DELETE FROM visitacoes`);
        await db.execute(sql`DELETE FROM clientes`);
        await db.execute(sql`DELETE FROM users`);

        // Criar 3 usuários padrão
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

        return {
          success: true,
          message: "Banco de dados resetado com sucesso. 3 usuários criados: Moises, Gabriel, Adriano",
        };
      } catch (error: any) {
        throw new Error(`Erro ao resetar banco: ${error.message}`);
      }
    }),
});
