import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { DollarSign, Loader2, Plus, TrendingDown, TrendingUp, Wallet, Receipt } from "lucide-react";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"];

export default function Financeiro() {
  const { user, loading: authLoading } = useAuth();
  const { data: festas, isLoading: loadingFestas } = trpc.festas.list.useQuery();
  const { data: pagamentos, isLoading: loadingPagamentos } = trpc.pagamentos.listAll.useQuery();

  const estatisticas = useMemo(() => {
    if (!festas || !pagamentos) return null;

    const totalFaturamento = festas.reduce((sum, f) => sum + f.valorTotal, 0);
    const totalRecebido = pagamentos.reduce((sum, p) => sum + p.valor, 0);
    const totalAReceber = totalFaturamento - totalRecebido;
    
    // Agrupar pagamentos por mês
    const pagamentosPorMes: Record<string, number> = {};
    pagamentos.forEach((p) => {
      const mes = new Date(p.dataPagamento).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      pagamentosPorMes[mes] = (pagamentosPorMes[mes] || 0) + p.valor;
    });

    // Converter para array para gráficos
    const dadosGraficoMensal = Object.entries(pagamentosPorMes)
      .sort(([a], [b]) => {
        const dateA = new Date(a.split(" de ").reverse().join(" "));
        const dateB = new Date(b.split(" de ").reverse().join(" "));
        return dateA.getTime() - dateB.getTime();
      })
      .map(([mes, valor]) => ({
        mes: mes.split(" de ")[0].substring(0, 3), // Abreviar mês
        valor: valor / 100,
        valorFormatado: `R$ ${(valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      }));

    // Dados para gráfico de pizza
    const dadosGraficoPizza = [
      { name: "Recebido", value: totalRecebido / 100 },
      { name: "A Receber", value: totalAReceber / 100 },
    ];

    // Festas com saldo devedor
    const festasComSaldo = festas.filter(f => f.valorPago < f.valorTotal);
    
    // Festas por mês
    const festasPorMes: Record<string, number> = {};
    festas.forEach((f) => {
      const mes = new Date(f.dataFesta).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
      festasPorMes[mes] = (festasPorMes[mes] || 0) + 1;
    });

    const dadosGraficoFestas = Object.entries(festasPorMes)
      .sort(([a], [b]) => {
        const dateA = new Date(a.split(" de ").reverse().join(" "));
        const dateB = new Date(b.split(" de ").reverse().join(" "));
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6) // Últimos 6 meses
      .map(([mes, quantidade]) => ({
        mes: mes.split(" de ")[0].substring(0, 3),
        quantidade,
      }));
    
    return {
      totalFaturamento,
      totalRecebido,
      totalAReceber,
      pagamentosPorMes,
      festasComSaldo,
      percentualRecebido: totalFaturamento > 0 ? (totalRecebido / totalFaturamento) * 100 : 0,
      dadosGraficoMensal,
      dadosGraficoPizza,
      dadosGraficoFestas,
    };
  }, [festas, pagamentos]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Wallet className="h-8 w-8" />
              Financeiro
            </h1>
            <p className="text-muted-foreground">Visão completa do fluxo de caixa e recebimentos</p>
          </div>
          <Button onClick={() => window.location.href = "/financeiro/registrar"} className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Pagamento
          </Button>
        </div>

        {loadingFestas || loadingPagamentos ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : estatisticas ? (
          <Tabs defaultValue="resumo" className="space-y-6">
            <TabsList>
              <TabsTrigger value="resumo" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Resumo
              </TabsTrigger>
              <TabsTrigger value="pagamentos" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Pagamentos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumo" className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Faturamento Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {(estatisticas.totalFaturamento / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valor total de todas as festas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    Total Recebido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {(estatisticas.totalRecebido / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {estatisticas.percentualRecebido.toFixed(1)}% do faturamento total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-600">
                    <TrendingDown className="h-4 w-4" />
                    A Receber
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    R$ {(estatisticas.totalAReceber / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {estatisticas.festasComSaldo.length} festas com saldo pendente
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Linha - Evolução Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Mensal de Recebimentos</CardTitle>
                  <CardDescription>Valores recebidos por mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250} className="text-xs md:text-sm">
                    <LineChart data={estatisticas.dadosGraficoMensal}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="mes" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                        labelStyle={{ color: "#f3f4f6" }}
                        formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Valor Recebido"
                        dot={{ fill: "#10b981", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Pizza - Recebido vs A Receber */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Financeira</CardTitle>
                  <CardDescription>Proporção de valores recebidos e pendentes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250} className="text-xs md:text-sm">
                    <PieChart>
                      <Pie
                        data={estatisticas.dadosGraficoPizza}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {estatisticas.dadosGraficoPizza.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#f59e0b"} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                        formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras - Festas por Mês */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Festas por Mês</CardTitle>
                  <CardDescription>Quantidade de festas agendadas nos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250} className="text-xs md:text-sm">
                    <BarChart data={estatisticas.dadosGraficoFestas}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="mes" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                        labelStyle={{ color: "#f3f4f6" }}
                      />
                      <Legend />
                      <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade de Festas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Festas com Saldo Devedor */}
            <Card>
              <CardHeader>
                <CardTitle>Festas com Saldo Devedor</CardTitle>
                <CardDescription>
                  {estatisticas.festasComSaldo.length} festas com pagamento pendente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data da Festa</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">Pago</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estatisticas.festasComSaldo
                      .sort((a, b) => new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime())
                      .map((festa) => {
                        const saldo = festa.valorTotal - festa.valorPago;
                        return (
                          <TableRow key={festa.id}>
                            <TableCell className="font-medium">{festa.codigo}</TableCell>
                            <TableCell>{festa.clienteNome}</TableCell>
                            <TableCell>
                              {new Date(festa.dataFesta).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {(festa.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              R$ {(festa.valorPago / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-orange-600">
                              R$ {(saldo / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              <Badge variant={festa.status === "agendada" ? "default" : "secondary"}>
                                {festa.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="pagamentos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Todos os Pagamentos</CardTitle>
                  <CardDescription>
                    {pagamentos?.length || 0} pagamentos registrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Pagador</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Forma</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead>Festa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagamentos && pagamentos.length > 0 ? (
                        pagamentos.map((pag) => (
                          <TableRow key={pag.id}>
                            <TableCell className="font-medium">{pag.codigo}</TableCell>
                            <TableCell>{pag.pagador || "-"}</TableCell>
                            <TableCell>
                              {new Date(pag.dataPagamento).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{pag.metodoPagamento || "PIX"}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              R$ {(pag.valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                              {pag.festaId ? (
                                <Badge variant="secondary">
                                  {festas?.find(f => f.id === pag.festaId)?.codigo || `Festa #${pag.festaId}`}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-sm">Sem festa</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            Nenhum pagamento registrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhum dado financeiro disponível
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
