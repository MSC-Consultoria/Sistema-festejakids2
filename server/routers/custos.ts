import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const custosRouter = router({
  // ============ CUSTOS VARIÁVEIS ============
  
  variaveis: router({
    list: protectedProcedure.query(async () => {
      return db.getAllCustosVariaveis();
    }),

    active: protectedProcedure.query(async () => {
      return db.getActiveCustosVariaveis();
    }),

    create: protectedProcedure
      .input(
        z.object({
          descricao: z.string().min(1),
          valor: z.number().min(0), // em centavos
          percentual: z.number().min(0).max(100).optional(),
          ordem: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await db.createCustoVariavel({
          descricao: input.descricao,
          valor: input.valor,
          percentual: input.percentual || 0,
          ativo: 1,
          ordem: input.ordem || 0,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          descricao: z.string().min(1).optional(),
          valor: z.number().min(0).optional(),
          percentual: z.number().min(0).max(100).optional(),
          ativo: z.number().min(0).max(1).optional(),
          ordem: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCustoVariavel(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCustoVariavel(input.id);
        return { success: true };
      }),

    calcularTotal: protectedProcedure
      .input(z.object({ valorFesta: z.number() }))
      .query(async ({ input }) => {
        return db.calcularCustoTotalVariavel(input.valorFesta);
      }),
  }),

  // ============ CUSTOS FIXOS ============

  fixos: router({
    list: protectedProcedure.query(async () => {
      return db.getAllCustosFixos();
    }),

    active: protectedProcedure.query(async () => {
      return db.getActiveCustosFixos();
    }),

    create: protectedProcedure
      .input(
        z.object({
          descricao: z.string().min(1),
          valor: z.number().min(0), // em centavos
          ordem: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const id = await db.createCustoFixo({
          descricao: input.descricao,
          valor: input.valor,
          ativo: 1,
          ordem: input.ordem || 0,
        });
        return { id };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          descricao: z.string().min(1).optional(),
          valor: z.number().min(0).optional(),
          ativo: z.number().min(0).max(1).optional(),
          ordem: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCustoFixo(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCustoFixo(input.id);
        return { success: true };
      }),

    calcularTotalMensal: protectedProcedure.query(async () => {
      return db.calcularCustoTotalFixoMensal();
    }),
  }),

  // ============ CÁLCULOS ============

  calcularMargemLucro: protectedProcedure
    .input(z.object({ valorFesta: z.number() }))
    .query(async ({ input }) => {
      return db.calcularMargemLucro(input.valorFesta);
    }),

  resumoCompleto: protectedProcedure.query(async () => {
    const custosVariaveis = await db.getActiveCustosVariaveis();
    const custosFixos = await db.getActiveCustosFixos();
    const totalFixoMensal = await db.calcularCustoTotalFixoMensal();
    
    // Calcula custo variável base (sem considerar percentuais)
    const custoVariavelBase = custosVariaveis
      .filter((c) => !c.percentual || c.percentual === 0)
      .reduce((sum, c) => sum + c.valor, 0);

    return {
      custosVariaveis,
      custosFixos,
      custoVariavelBase,
      totalFixoMensal,
    };
  }),
});
