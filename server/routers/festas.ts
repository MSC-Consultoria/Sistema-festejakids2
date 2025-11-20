import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const festasRouter = router({
  list: protectedProcedure.query(async () => {
    return db.getAllFestas();
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getFestaById(input.id);
    }),

  byCodigo: protectedProcedure
    .input(z.object({ codigo: z.string() }))
    .query(async ({ input }) => {
      return db.getFestaByCodigo(input.codigo);
    }),

  byStatus: protectedProcedure
    .input(z.object({ status: z.enum(["agendada", "realizada", "cancelada"]) }))
    .query(async ({ input }) => {
      return db.getFestasByStatus(input.status);
    }),

  byCliente: protectedProcedure
    .input(z.object({ clienteId: z.number() }))
    .query(async ({ input }) => {
      return db.getFestasByCliente(input.clienteId);
    }),

  byDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.number(), // timestamp em ms
        endDate: z.number(), // timestamp em ms
      })
    )
    .query(async ({ input }) => {
      return db.getFestasByDateRange(
        new Date(input.startDate),
        new Date(input.endDate)
      );
    }),

  create: protectedProcedure
    .input(
      z.object({
        codigo: z.string().min(1),
        clienteId: z.number(),
        dataFechamento: z.number(), // timestamp em ms
        dataFesta: z.number(), // timestamp em ms
        valorTotal: z.number().min(0), // em centavos
        numeroConvidados: z.number().min(1),
        tema: z.string().optional(),
        horario: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await db.createFesta({
        ...input,
        dataFechamento: new Date(input.dataFechamento),
        dataFesta: new Date(input.dataFesta),
        valorPago: 0,
        status: "agendada",
      });
      return { id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        codigo: z.string().min(1).optional(),
        clienteId: z.number().optional(),
        dataFechamento: z.number().optional(),
        dataFesta: z.number().optional(),
        valorTotal: z.number().min(0).optional(),
        numeroConvidados: z.number().min(1).optional(),
        tema: z.string().optional(),
        horario: z.string().optional(),
        status: z.enum(["agendada", "realizada", "cancelada"]).optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, dataFechamento, dataFesta, ...rest } = input;
      const updateData: any = { ...rest };
      
      if (dataFechamento) {
        updateData.dataFechamento = new Date(dataFechamento);
      }
      if (dataFesta) {
        updateData.dataFesta = new Date(dataFesta);
      }
      
      await db.updateFesta(id, updateData);
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deleteFesta(input.id);
      return { success: true };
    }),

  // Função auxiliar para gerar código de contrato
  generateCodigo: protectedProcedure
    .input(
      z.object({
        dataFechamento: z.number(),
        nomeCliente: z.string(),
      })
    )
    .query(({ input }) => {
      const date = new Date(input.dataFechamento);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      
      // Pega as duas primeiras letras do nome do cliente em maiúsculas
      const initials = input.nomeCliente
        .trim()
        .slice(0, 2)
        .toUpperCase()
        .replace(/[^A-Z]/g, "");
      
      return `${day}${month}${year}${initials}`;
    }),

  // Estatísticas
  stats: protectedProcedure.query(async () => {
    const todasFestas = await db.getAllFestas();
    const agendadas = todasFestas.filter((f) => f.status === "agendada");
    const realizadas = todasFestas.filter((f) => f.status === "realizada");
    
    const valorTotal = todasFestas.reduce((sum, f) => sum + f.valorTotal, 0);
    const valorPago = todasFestas.reduce((sum, f) => sum + f.valorPago, 0);
    const valorAReceber = valorTotal - valorPago;
    
    const ticketMedio = realizadas.length > 0
      ? realizadas.reduce((sum, f) => sum + f.valorTotal, 0) / realizadas.length
      : 0;
    
    return {
      total: todasFestas.length,
      agendadas: agendadas.length,
      realizadas: realizadas.length,
      valorTotal,
      valorPago,
      valorAReceber,
      ticketMedio,
    };
  }),
});
