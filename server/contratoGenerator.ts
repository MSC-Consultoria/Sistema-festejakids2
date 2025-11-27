import PDFDocument from "pdfkit";
import type { Readable } from "stream";

interface ContratoData {
  codigo: string;
  dataFechamento: Date;
  dataEvento: Date;
  horario: string;
  numeroConvidados: number;
  tema: string;
  nomeAniversariante?: string;
  idadeAniversariante?: number;
  clienteNome: string;
  clienteCPF?: string;
  clienteEndereco?: string;
  clienteTelefone: string;
  brinde?: string;
  refeicao?: string;
  bolo?: string;
  valorTotal: number;
}

/**
 * Gera um contrato em PDF baseado nos dados da festa
 * Retorna um stream que pode ser salvo ou enviado
 */
export async function gerarContratoPDF(data: ContratoData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Cabeçalho
      doc
        .fontSize(20)
        .fillColor("#FF6B35")
        .text("FESTEJA KIDS", { align: "center" });
      doc
        .fontSize(12)
        .fillColor("#333")
        .text("Sua MELHOR opção de festas da Zona Norte", { align: "center" });
      doc.text("whats 9725-30586", { align: "center" });
      doc
        .fillColor("#0066CC")
        .text("www.festejakids.com.br", { align: "center", link: "https://www.festejakids.com.br" });

      doc.moveDown(2);

      // Título
      doc
        .fontSize(18)
        .fillColor("#00AA00")
        .text("CONTRATO BUFFET INFANTIL", { align: "center" });

      doc.moveDown(1);

      // Data de fechamento
      doc
        .fontSize(12)
        .fillColor("#333")
        .text(`DATA DO FECHAMENTO: ${formatarData(data.dataFechamento)}`, { align: "right" });

      doc.moveDown(1);

      // 1. DADOS DO EVENTO
      doc.fontSize(14).fillColor("#000").text("1. DADOS DO EVENTO:");
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor("#333");
      doc.text(`ENDEREÇO DO SALÃO: Rua Sirici, 644 – Marechal Hermes`);
      doc.text(`DURAÇÃO DO EVENTO: 4h`);
      doc.text(`NÚMERO DE CONVIDADOS: ${data.numeroConvidados} – ${data.horario}`);
      doc.text(`DATA DO EVENTO: ${formatarData(data.dataEvento)}`);
      doc.text(`TEMA: ${data.tema}`);
      if (data.nomeAniversariante) {
        doc.text(`ANIVERSARIANTE: ${data.nomeAniversariante}${data.idadeAniversariante ? ` - ${data.idadeAniversariante} anos` : ""}`);
      }

      doc.moveDown(0.5);
      doc
        .fillColor("#FF0000")
        .text("❖  Reserva da data  somente mediante ao pagamento do sinal.", { indent: 20 });

      doc.moveDown(1);

      // 1.1 DADOS DO CLIENTE
      doc.fontSize(14).fillColor("#000").text("1.1 DADOS DO CLIENTE:");
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor("#333");
      doc.text(`NOME: ${data.clienteNome}`);
      if (data.clienteCPF) {
        doc.text(`CPF: ${data.clienteCPF}`);
      }
      if (data.clienteEndereco) {
        doc.text(`ENDEREÇO: ${data.clienteEndereco}`);
      }
      doc.text(`TEL: ${data.clienteTelefone}`);

      doc.moveDown(1);

      // 2. SERVIÇOS INCLUÍDOS
      doc.fontSize(14).fillColor("#000").text("2. SERVIÇOS INCLUÍDOS:");
      doc.moveDown(0.5);

      doc.fontSize(12).fillColor("#000").text("2.1 Festa:");
      doc.moveDown(0.3);

      const servicosIncluidos = [
        "Decoração provençal (As fotos são apenas demonstração, podendo ter itens não inclusos)",
        "Brinquedos e eletrônicos",
        "   Podendo algum estar inutilizado sem responsabilidade do salão",
        "Som e Iluminação",
        "Equipe de Apoio Completa: recepcionista, monitores, garçons, copeiros, faxineira, gerente",
        "28 mesas com 4 cadeiras",
        "Animação",
        "DJ",
      ];

      doc.fontSize(10).fillColor("#333");
      servicosIncluidos.forEach((servico) => {
        doc.text(`✓  ${servico}`, { indent: 20 });
      });

      doc.addPage();

      // 2.2 SERVIÇO BUFFET ADULTO
      doc.fontSize(12).fillColor("#000").text("2.2-SERVIÇO BUFFET ADULTO");
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor("#333");
      doc.text(
        "✓  Entrada: Gurjão de frango, ovo de codorna, queijo com presunto, salame com azeitona, batata calabresa temperada e calabresa acebolada"
      );
      doc.text("✓  Mini refeição (servida por até 01h): Pene a bolonhesa");
      doc.text("✓  Sopa de ervilha");
      doc.text("✓  Caldo de feijão");
      doc.text("✓  Cachorro quente");
      doc.text("✓  Salgados fritos e assados");
      doc.text("✓  Refrigerantes linha coca cola e pepsi, refresco, guaraná natural e água.");
      doc.text("✓  Bolo: massa mista com recheio de ninho e brigadeiro com gotinhas");
      doc.text("✓  Docinhos: todos da casa");
      doc.text("✓  Cerveja: em aberto");

      doc.moveDown(1);

      // 2.2-SERVIÇO BUFFET INFANTIL: SOMENTE CRIANÇA
      doc.fontSize(12).fillColor("#000").text("2.2-SERVIÇO BUFFET INFANTIL: SOMENTE CRIANÇA");
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor("#000").text("➔Hora do Lanchinho");
      doc.moveDown(0.3);

      doc.fontSize(10).fillColor("#333");
      const lanchinho = ["Gelatina", "Pipoca", "Batata-Frita", "Mini-Pizza"];
      lanchinho.forEach((item) => {
        doc.text(`✓  ${item}`, { indent: 20 });
      });

      doc.moveDown(1);

      // 3.0 - BRINDES
      doc.fontSize(14).fillColor("#000").text("3.0 – BRINDES:");
      doc.moveDown(0.5);

      doc.fontSize(10).fillColor("#333");
      doc.text("✓  Crianças entram como pagantes a partir de 8 anos");
      doc.text("✓  Cortesias pais e irmãos");
      if (data.brinde) {
        doc.text(`✓  ${data.brinde}`);
      } else {
        doc.text("✓  Festival de açaí 10L");
      }

      doc.addPage();

      // ITEM 4.0 LER COM BASTANTE ATENÇÃO!!!
      doc
        .fontSize(14)
        .fillColor("#FF0000")
        .text("ITEM 4.0 LER COM BASTANTE ATENÇÃO!!!");
      doc.moveDown(1);

      // 4.0- OBSERVAÇÕES GERAIS
      doc.fontSize(14).fillColor("#000").text("4.0- OBSERVAÇÕES GERAIS:");
      doc.moveDown(0.5);

      const observacoes = [
        "Pagamento sinal mínimo R$ 500,00 (reserva da data)",
        "Parcela fixa mínima 200,00 Mês",
        "As parcelas do contrato bem como qualquer outro pagamento, deverão ser quitadas até dez dias antes do início da realização do evento; Caso fique faltando algum valor:",
        "   O mesmo poderá ser parcelado em até 12x, com acréscimo da taxa administrativa da maquininha!",
        "   Ou:  Sendo o pagamento à vista no cartão de débito acréscimo de 5% e no crédito a vista  de 10%.",
        "Para mudanças do dia da festa e tema deverá ser passado para FesteJA Kids com antecedência e verificar a disponibilidade com a casa; assim como a tabela de preços.",
        "Todo serviço fora do contrato após a assinatura do mesmo será cobrado a parte.",
        "Convidado excedente R$ 90,00",
        "Refrigerantes, sucos e água são servidos em copos plásticos; exceto cerveja que é servida em tulipa de acrílico. Isso nos garante a segurança das crianças.",
        "Docinhos saem junto com o bolo.",
        "Fica a critério dos responsáveis da festa trazer algum tipo de alimento que complemente o buffet, sendo assim cobramos uma taxa referente ao serviço adicional da cozinha de : R$ 150,00.",
        "Cortesia para 05  colaboradores que trabalharão na festa. A partir do sexto entra como convidado.",
        "A cada 05 convidados extras, será cobrado o pgto.",
        "Não permitimos entrada de animais irracionais no salão",
        "No dia do evento presença de um gerente.",
        "Todo tema provençal requer lembranças para mesa da decoração;",
        "A casa ainda não disponibiliza de gerador.",
        "Não nos responsabilizamos por adultos nos brinquedos, principalmente na guerra de cotonete.",
        "Fica proibido uso de vela com faisca, bolão para estourar e chuva de prata.",
        "Não disponibilizamos mesas e cadeiras a mais do pacote. Caso seja necessário é cobrado R$ 10,00 por kit. Exemplo: 02 mesas com 4 cadeiras cada = R$ 20,00.",
        "Toda lembrança personalizada precisa vir pronta para que possamos decorar a mesa.",
        "Bolas para tema inclusas na decoração.",
        "Todo pertence deixado na casa, exceto os brindes personalizado, nós não nos responsabilizamos.",
      ];

      doc.fontSize(10).fillColor("#333");
      observacoes.forEach((obs) => {
        doc.text(`✓  ${obs}`, { indent: 20 });
      });

      doc.addPage();

      // Continuação das observações
      const observacoes2 = [
        "Trazer os brindes personalizados antes da festa. Isso garante que a decoração esteja pronta ao início da festa.",
        "Todo e qualquer utensílio do salão quebrado e/ou danificado no dia da festa será cobrado a parte.",
        "Vela, enfeite da mesa dos convidados, prendas da animação e os personalizados da mesa provençal NÃO INCLUSOS.",
        "Vela precisa vir com suporte.",
        "Decoração pode sofrer algum tipo de alteração em relação a móveis e etc; porém não foge da proposta oferecida.Consultar a decoradora pois há itens nas fotos pagos como opcional!",
        "Em caso de cancelamento da festa por parte do FesteJA Kids é devolvido todo e qualquer valor já pago.",
        "Caso no dia do evento não puder ser realizada a festa por conta da COVID 19 NÃO será devolvido nenhum valor e sim reagendamento da data.",
        "Em CASO DE CANCELAMENTO DA FESTA PELO CONTRATANTE é retido 35% de multa rescisória sobre o valor total do contrato.",
        "Não devolvemos valor do sinal pago.",
        "Caso seja contratado de fora alguma estação, é necessário informar a casa de festas antes de fechar essa parceria. Se for estação que ligue na luz, precisamos da amperagem da máquina e cobramos uma taxa de R$ 180,00 até 150 pessoas e R$ 250,00 até 200 pessoas.",
        "Estação como batata goumert, pastel, hambúrguer e outras que precise de óleo ou faça fumaça não são autizadas.",
        "Oferecemos 15 minutos de tolerância para saída dos convidados. Caso o tempo seja excedido será cobrada uma multa de 5% ao valor total do contrato.",
      ];

      doc.fontSize(10).fillColor("#333");
      observacoes2.forEach((obs) => {
        doc.text(`✓  ${obs}`, { indent: 20 });
      });

      doc.moveDown(1);

      // 5.0 – PAGAMENTO
      doc.fontSize(14).fillColor("#000").text("5.0 – PAGAMENTO:");
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor("#333");
      doc.text(`Valor integral para festa de ${data.numeroConvidados} pessoas: R$ ${data.valorTotal.toFixed(2).replace(".", ",")}`);

      doc.moveDown(1);

      // 5.1 – FORMA DE PAGAMENTO
      doc.fontSize(12).fillColor("#000").text("5.1 – FORMA DE PAGAMENTO:");
      doc.moveDown(1);

      doc.fontSize(10).fillColor("#333");
      doc.text("Dados Bancários:  Itaú 8188  // C.C 20901-2 // Chave PIX: 21964504141");

      doc.moveDown(2);

      // Assinatura
      doc.text("_________________________________________");
      doc.moveDown(0.5);
      doc.fontSize(11).text("FTJ KIDS FESTAS LTDA");

      doc.moveDown(2);

      doc.text("_________________________________________");
      doc.moveDown(0.5);
      doc.text("1.   De Acordo (contratante)");

      doc.moveDown(2);

      // Rodapé
      doc
        .fontSize(9)
        .fillColor("#666")
        .text("FesteJA Kids Festas", { align: "center" });
      doc.text("Rua Sirici, 644 – Marechal Hermes", { align: "center" });
      doc.text("CNPJ 34.295.387/0001-72", { align: "center" });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function formatarData(data: Date): string {
  return new Date(data).toLocaleDateString("pt-BR");
}
