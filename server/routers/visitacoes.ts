import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const visitacoesRouter = router({
  // Listar todas as visitações
  list: protectedProcedure.query(async () => {
    return await db.getAllVisitacoes();
  }),

  // Buscar visitação por ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.getVisitacaoById(input.id);
    }),

  // Criar nova visitação
  create: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        telefone: z.string().min(1, "Telefone é obrigatório"),
        email: z.string().email("Email inválido").optional(),
        dataVisita: z.number(), // timestamp
        interesse: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await db.createVisitacao({
        ...input,
        dataVisita: new Date(input.dataVisita),
        status: "aguardando",
      });
    }),

  // Atualizar visitação
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().optional(),
        telefone: z.string().optional(),
        email: z.string().email("Email inválido").optional().nullable(),
        dataVisita: z.number().optional(),
        interesse: z.string().optional().nullable(),
        status: z.enum(["visitou", "aguardando", "proposta_enviada", "fechado", "perdido"]).optional(),
        observacoes: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, dataVisita, ...rest } = input;
      const updateData: any = { ...rest };
      
      if (dataVisita) {
        updateData.dataVisita = new Date(dataVisita);
      }
      
      return await db.updateVisitacao(id, updateData);
    }),

  // Deletar visitação
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db.deleteVisitacao(input.id);
    }),

  // Converter visitação em cliente
  converterEmCliente: protectedProcedure
    .input(z.object({ 
      visitacaoId: z.number(),
      cpf: z.string().optional(),
      endereco: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const visitacao = await db.getVisitacaoById(input.visitacaoId);
      if (!visitacao) {
        throw new Error("Visitação não encontrada");
      }

      // Criar cliente
      const clienteId = await db.createCliente({
        nome: visitacao.nome,
        telefone: visitacao.telefone,
        email: visitacao.email || undefined,
        cpf: input.cpf,
        endereco: input.endereco,
      });

      // Atualizar visitação com clienteId e status fechou_contrato
      await db.updateVisitacao(input.visitacaoId, {
        clienteId,
        status: "fechou_contrato",
      });

      return { clienteId, success: true };
    }),

  // Estatísticas de visitações
  stats: protectedProcedure.query(async () => {
    return await db.getVisitacoesStats();
  }),
});
