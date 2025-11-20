import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const clientesRouter = router({
  list: protectedProcedure.query(async () => {
    return db.getAllClientes();
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getClienteById(input.id);
    }),

  search: protectedProcedure
    .input(z.object({ searchTerm: z.string() }))
    .query(async ({ input }) => {
      if (!input.searchTerm || input.searchTerm.trim() === "") {
        return db.getAllClientes();
      }
      return db.searchClientes(input.searchTerm);
    }),

  create: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1),
        telefone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      const id = await db.createCliente({
        nome: input.nome,
        telefone: input.telefone || null,
        email: input.email || null,
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().min(1).optional(),
        telefone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: any = {};
      
      if (data.nome !== undefined) updateData.nome = data.nome;
      if (data.telefone !== undefined) updateData.telefone = data.telefone || null;
      if (data.email !== undefined) updateData.email = data.email || null;
      
      await db.updateCliente(id, updateData);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Verificar se existem festas associadas
      const festas = await db.getFestasByCliente(input.id);
      if (festas.length > 0) {
        throw new Error("Não é possível excluir cliente com festas cadastradas");
      }
      
      await db.deleteCliente(input.id);
      return { success: true };
    }),

  withFestas: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const cliente = await db.getClienteById(input.id);
      if (!cliente) return null;
      
      const festas = await db.getFestasByCliente(input.id);
      
      return {
        ...cliente,
        festas,
        totalFestas: festas.length,
        valorTotal: festas.reduce((sum, f) => sum + f.valorTotal, 0),
      };
    }),
});
