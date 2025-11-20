import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const pagamentosRouter = router({
  byFesta: protectedProcedure
    .input(z.object({ festaId: z.number() }))
    .query(async ({ input }) => {
      return db.getPagamentosByFesta(input.festaId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        festaId: z.number(),
        valor: z.number().min(1), // em centavos
        dataPagamento: z.number(), // timestamp em ms
        metodoPagamento: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Criar o pagamento
      const id = await db.createPagamento({
        festaId: input.festaId,
        valor: input.valor,
        dataPagamento: new Date(input.dataPagamento),
        metodoPagamento: input.metodoPagamento || null,
        observacoes: input.observacoes || null,
      });

      // Atualizar o valor pago na festa
      const festa = await db.getFestaById(input.festaId);
      if (festa) {
        const novoValorPago = festa.valorPago + input.valor;
        await db.updateFesta(input.festaId, { valorPago: novoValorPago });
      }

      return { id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number(), festaId: z.number(), valor: z.number() }))
    .mutation(async ({ input }) => {
      // Excluir o pagamento
      await db.deletePagamento(input.id);

      // Atualizar o valor pago na festa
      const festa = await db.getFestaById(input.festaId);
      if (festa) {
        const novoValorPago = Math.max(0, festa.valorPago - input.valor);
        await db.updateFesta(input.festaId, { valorPago: novoValorPago });
      }

      return { success: true };
    }),

  // Resumo financeiro de uma festa
  resumoFesta: protectedProcedure
    .input(z.object({ festaId: z.number() }))
    .query(async ({ input }) => {
      const festa = await db.getFestaById(input.festaId);
      if (!festa) return null;

      const pagamentos = await db.getPagamentosByFesta(input.festaId);
      const saldoDevedor = festa.valorTotal - festa.valorPago;
      const percentualPago = (festa.valorPago / festa.valorTotal) * 100;

      return {
        valorTotal: festa.valorTotal,
        valorPago: festa.valorPago,
        saldoDevedor,
        percentualPago,
        pagamentos,
      };
    }),
});
