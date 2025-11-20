import { router, protectedProcedure } from "../_core/trpc";
import { getAllFestas, getDb } from "../db";
import { pagamentos } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const PARCELA_MINIMA = 50000; // R$ 500,00 em centavos
const DIAS_ANTECEDENCIA_QUITACAO = 10;

export const acompanhamentoRouter = router({
  // Listar festas com status de pagamento detalhado
  listarComStatus: protectedProcedure.query(async () => {
    const festas = await getAllFestas();
    const database = await getDb();
    
    if (!database) {
      throw new Error("Database not available");
    }

    const agora = new Date();
    
    const festasComStatus = await Promise.all(
      festas.map(async (festa) => {
        // Buscar pagamentos da festa
        const pagamentosFesta = await database
          .select()
          .from(pagamentos)
          .where(eq(pagamentos.festaId, festa.id));

        const totalPago = pagamentosFesta.reduce((sum, p) => sum + p.valor, 0);
        const saldo = festa.valorTotal - totalPago;
        const dataFesta = new Date(festa.dataFesta);
        const dataLimiteQuitacao = new Date(dataFesta);
        dataLimiteQuitacao.setDate(dataLimiteQuitacao.getDate() - DIAS_ANTECEDENCIA_QUITACAO);

        // Calcular meses desde o fechamento
        const dataFechamento = new Date(festa.dataFechamento);
        const mesesDecorridos = Math.floor(
          (agora.getTime() - dataFechamento.getTime()) / (1000 * 60 * 60 * 24 * 30)
        );

        // Calcular valor mínimo esperado (R$ 500/mês)
        const valorMinimoEsperado = Math.max(0, mesesDecorridos * PARCELA_MINIMA);
        
        // Determinar status
        let status: "quitado" | "em_dia" | "atrasado" | "alerta_quitacao" | "nao_quitado";
        let diasParaEvento = Math.floor((dataFesta.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
        
        if (saldo <= 0) {
          status = "quitado";
        } else if (agora >= dataLimiteQuitacao) {
          status = "nao_quitado"; // Passou da data limite e não quitou
        } else if (diasParaEvento <= DIAS_ANTECEDENCIA_QUITACAO) {
          status = "alerta_quitacao"; // Faltam 10 dias ou menos
        } else if (totalPago >= valorMinimoEsperado) {
          status = "em_dia";
        } else {
          status = "atrasado";
        }

        // Calcular próxima parcela esperada
        const proximaParcelaData = new Date(dataFechamento);
        proximaParcelaData.setMonth(proximaParcelaData.getMonth() + mesesDecorridos + 1);

        return {
          ...festa,
          totalPago,
          saldo,
          status,
          valorMinimoEsperado,
          mesesDecorridos,
          diasParaEvento,
          dataLimiteQuitacao: dataLimiteQuitacao.toISOString(),
          proximaParcelaData: proximaParcelaData.toISOString(),
          pagamentos: pagamentosFesta.map(p => ({
            id: p.id,
            valor: p.valor,
            dataPagamento: p.dataPagamento,
            metodoPagamento: p.metodoPagamento,
          })),
        };
      })
    );

    return festasComStatus;
  }),

  // Projeção de recebimentos para próximos 12 meses
  projecaoRecebimentos: protectedProcedure.query(async () => {
    const festas = await getAllFestas();
    const database = await getDb();
    
    if (!database) {
      throw new Error("Database not available");
    }

    const agora = new Date();
    const projecao: Record<string, {
      mes: string,
      recebimentoEsperado: number,
      recebimentoRealizado: number,
      festasAQuitar: number,
    }> = {};

    // Inicializar próximos 12 meses
    for (let i = 0; i < 12; i++) {
      const data = new Date(agora);
      data.setMonth(data.getMonth() + i);
      const chave = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      projecao[chave] = {
        mes: chave,
        recebimentoEsperado: 0,
        recebimentoRealizado: 0,
        festasAQuitar: 0,
      };
    }

    // Processar cada festa
    for (const festa of festas) {
      const pagamentosFesta = await database
        .select()
        .from(pagamentos)
        .where(eq(pagamentos.festaId, festa.id));

      const totalPago = pagamentosFesta.reduce((sum, p) => sum + p.valor, 0);
      const saldo = festa.valorTotal - totalPago;

      if (saldo <= 0) continue; // Festa já quitada

      const dataFesta = new Date(festa.dataFesta);
      const dataFechamento = new Date(festa.dataFechamento);
      const dataLimiteQuitacao = new Date(dataFesta);
      dataLimiteQuitacao.setDate(dataLimiteQuitacao.getDate() - DIAS_ANTECEDENCIA_QUITACAO);

      // Calcular meses até a quitação
      const mesesAteQuitacao = Math.max(1, Math.ceil(
        (dataLimiteQuitacao.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24 * 30)
      ));

      // Distribuir saldo restante nos próximos meses (mínimo R$ 500/mês)
      const parcelaMensal = Math.max(PARCELA_MINIMA, Math.ceil(saldo / mesesAteQuitacao));

      let saldoRestante = saldo;
      for (let i = 0; i < mesesAteQuitacao && saldoRestante > 0; i++) {
        const data = new Date(agora);
        data.setMonth(data.getMonth() + i);
        const chave = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

        if (projecao[chave]) {
          const valorParcela = Math.min(parcelaMensal, saldoRestante);
          projecao[chave].recebimentoEsperado += valorParcela;
          saldoRestante -= valorParcela;

          // Contar festas que precisam ser quitadas neste mês
          const mesData = new Date(data.getFullYear(), data.getMonth(), 1);
          const proximoMes = new Date(mesData);
          proximoMes.setMonth(proximoMes.getMonth() + 1);

          if (dataLimiteQuitacao >= mesData && dataLimiteQuitacao < proximoMes) {
            projecao[chave].festasAQuitar++;
          }
        }
      }

      // Adicionar pagamentos já realizados
      pagamentosFesta.forEach((p) => {
        const dataPagamento = new Date(p.dataPagamento);
        if (dataPagamento >= agora) {
          const chave = dataPagamento.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
          if (projecao[chave]) {
            projecao[chave].recebimentoRealizado += p.valor;
          }
        }
      });
    }

    return Object.values(projecao).map(p => ({
      mes: p.mes.split(" de ")[0].substring(0, 3), // Abreviar
      mesCompleto: p.mes,
      recebimentoEsperado: p.recebimentoEsperado / 100,
      recebimentoRealizado: p.recebimentoRealizado / 100,
      festasAQuitar: p.festasAQuitar,
    }));
  }),
});
