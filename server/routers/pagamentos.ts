import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const pagamentosRouter = router({
  listAll: protectedProcedure.query(async () => {
    return db.getAllPagamentos();
  }),

  byFesta: protectedProcedure
    .input(z.object({ festaId: z.number() }))
    .query(async ({ input }) => {
      return db.getPagamentosByFesta(input.festaId);
    }),

  create: protectedProcedure
    .input(
      z.object({
        codigo: z.string(),
        festaId: z.number().optional(),
        valor: z.number().min(1), // em centavos
        dataPagamento: z.number(), // timestamp em ms
        metodoPagamento: z.string().optional(),
        pagador: z.string().optional(),
        comprovanteUrl: z.string().optional(),
        comprovanteFileKey: z.string().optional(),
        observacoes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Criar o pagamento
      const id = await db.createPagamento({
        codigo: input.codigo,
        festaId: input.festaId || null,
        valor: input.valor,
        dataPagamento: new Date(input.dataPagamento),
        metodoPagamento: input.metodoPagamento || null,
        pagador: input.pagador || null,
        comprovanteUrl: input.comprovanteUrl || null,
        comprovanteFileKey: input.comprovanteFileKey || null,
        observacoes: input.observacoes || null,
      });

      // Atualizar o valor pago na festa (se associado)
      if (input.festaId) {
        const festa = await db.getFestaById(input.festaId);
        if (festa) {
          const novoValorPago = festa.valorPago + input.valor;
          await db.updateFesta(input.festaId, { valorPago: novoValorPago });
        }
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

  importarLote: protectedProcedure
    .input(
      z.object({
        pagamentos: z.array(
          z.object({
            codigo: z.string(),
            data: z.string(), // YYYY-MM-DD
            pagador: z.string(),
            valor: z.number(), // em reais
            formaPagamento: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      let inserted = 0;
      let errors = 0;
      const results = [];

      for (const pag of input.pagamentos) {
        try {
          const id = await db.createPagamento({
            codigo: pag.codigo,
            festaId: null,
            valor: Math.round(pag.valor * 100), // Converter para centavos
            dataPagamento: new Date(pag.data),
            metodoPagamento: pag.formaPagamento,
            pagador: pag.pagador,
            comprovanteUrl: null,
            comprovanteFileKey: null,
            observacoes: 'Pagamento de novembro/2025 - Importado automaticamente',
          });
          inserted++;
          results.push({ codigo: pag.codigo, status: 'success', id });
        } catch (error: any) {
          errors++;
          results.push({ codigo: pag.codigo, status: 'error', error: error.message });
        }
      }

      return {
        inserted,
        errors,
        total: input.pagamentos.length,
        results,
      };
    }),

  associarFesta: protectedProcedure
    .input(
      z.object({
        pagamentoId: z.number(),
        festaId: z.number().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      const pagamento = await db.getPagamentoById(input.pagamentoId);
      if (!pagamento) {
        throw new Error("Pagamento não encontrado");
      }

      // Se tinha festa anterior, remover o valor
      if (pagamento.festaId) {
        const festaAnterior = await db.getFestaById(pagamento.festaId);
        if (festaAnterior) {
          const novoValor = Math.max(0, festaAnterior.valorPago - pagamento.valor);
          await db.updateFesta(pagamento.festaId, { valorPago: novoValor });
        }
      }

      // Atualizar o pagamento
      await db.updatePagamento(input.pagamentoId, { festaId: input.festaId });

      // Se tem nova festa, adicionar o valor
      if (input.festaId) {
        const novaFesta = await db.getFestaById(input.festaId);
        if (novaFesta) {
          const novoValor = novaFesta.valorPago + pagamento.valor;
          await db.updateFesta(input.festaId, { valorPago: novoValor });
        }
      }

      return { success: true };
    }),
});
