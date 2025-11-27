import { z } from "zod";
import { router } from "../_core/trpc";
import { adminProcedure } from "../_core/roleMiddleware";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq, like, or, desc } from "drizzle-orm";

export const usuariosRouter = router({
  // Listar todos os usuários (apenas admin)
  list: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.enum(["admin", "gerente", "atendente", "cliente", "all"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Buscar todos os usuários
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

      // Aplicar filtros em memória
      let result = allUsers;

      if (input.search) {
        const searchLower = input.search.toLowerCase();
        result = result.filter(
          (u) =>
            u.name?.toLowerCase().includes(searchLower) ||
            u.email?.toLowerCase().includes(searchLower)
        );
      }

      if (input.role && input.role !== "all") {
        result = result.filter((u) => u.role === input.role);
      }
      return result;
    }),

  // Buscar usuário por ID
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  // Criar novo usuário
  create: adminProcedure
    .input(
      z.object({
        openId: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
        loginMethod: z.string().optional(),
        role: z.enum(["admin", "gerente", "atendente", "cliente"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verificar se já existe usuário com mesmo openId ou email
      const existing = await db
        .select()
        .from(users)
        .where(or(eq(users.openId, input.openId), eq(users.email, input.email)))
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Usuário com este openId ou email já existe");
      }

      await db.insert(users).values({
        openId: input.openId,
        name: input.name,
        email: input.email,
        loginMethod: input.loginMethod || "manual",
        role: input.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      });

      return {
        success: true,
      };
    }),

  // Atualizar usuário
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        role: z.enum(["admin", "gerente", "atendente", "cliente"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updateData } = input;

      await db
        .update(users)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, id));

      return { success: true };
    }),

  // Deletar usuário
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Não permitir deletar o próprio usuário
      if (ctx.user.id === input.id) {
        throw new Error("Você não pode deletar seu próprio usuário");
      }

      await db.delete(users).where(eq(users.id, input.id));

      return { success: true };
    }),

  // Estatísticas de usuários
  stats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allUsers = await db.select().from(users);

    return {
      total: allUsers.length,
      porRole: {
        admin: allUsers.filter((u) => u.role === "admin").length,
        gerente: allUsers.filter((u) => u.role === "gerente").length,
        atendente: allUsers.filter((u) => u.role === "atendente").length,
        cliente: allUsers.filter((u) => u.role === "cliente").length,
      },
    };
  }),
});
