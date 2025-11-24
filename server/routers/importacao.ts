import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { parseExcelFestas, importarFestas } from "../importacao";

export const importacaoRouter = router({
  /**
   * Preview de importação - apenas parseia o arquivo sem salvar no banco
   */
  preview: protectedProcedure
    .input(
      z.object({
        fileBase64: z.string(), // Arquivo em base64
      })
    )
    .mutation(async ({ input }) => {
      // Converter base64 para buffer
      const fileBuffer = Buffer.from(input.fileBase64, 'base64');
      
      // Parsear arquivo
      const result = await parseExcelFestas(fileBuffer);
      
      return {
        success: result.success,
        totalLinhas: result.totalLinhas,
        importadas: result.importadas,
        erros: result.erros,
        festas: result.festas.map(f => ({
          codigo: f.codigo,
          nomeCliente: f.nomeCliente,
          dataFechamento: f.dataFechamento.getTime(),
          dataFesta: f.dataFesta.getTime(),
          horario: f.horario,
          tema: f.tema,
          valorTotal: f.valorTotal,
          valorPago: f.valorPago,
          numeroConvidados: f.numeroConvidados,
          custos: f.custos,
          telefone: f.telefone,
        })),
      };
    }),

  /**
   * Importar festas - parseia e salva no banco de dados
   */
  importar: protectedProcedure
    .input(
      z.object({
        fileBase64: z.string(), // Arquivo em base64
      })
    )
    .mutation(async ({ input }) => {
      // Converter base64 para buffer
      const fileBuffer = Buffer.from(input.fileBase64, 'base64');
      
      // Parsear arquivo
      const parseResult = await parseExcelFestas(fileBuffer);
      
      if (!parseResult.success || parseResult.festas.length === 0) {
        return {
          success: false,
          message: 'Nenhuma festa válida encontrada no arquivo',
          totalLinhas: parseResult.totalLinhas,
          parseErros: parseResult.erros,
          importadas: 0,
          importErros: [],
        };
      }
      
      // Importar festas para o banco
      const importResult = await importarFestas(parseResult.festas);
      
      return {
        success: importResult.importadas > 0,
        message: `${importResult.importadas} festas importadas com sucesso`,
        totalLinhas: parseResult.totalLinhas,
        parseErros: parseResult.erros,
        importadas: importResult.importadas,
        importErros: importResult.erros,
      };
    }),
});
