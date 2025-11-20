import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, Loader2, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProjecaoFinanceira() {
  const { user, loading: authLoading } = useAuth();
  const { data: projecao, isLoading } = trpc.acompanhamento.projecaoRecebimentos.useQuery();

  const resumo = useMemo(() => {
    if (!projecao) return null;

    const totalEsperado = projecao.reduce((sum, p) => sum + p.recebimentoEsperado, 0);
    const totalRealizado = projecao.reduce((sum, p) => sum + p.recebimentoRealizado, 0);
    const totalFestasAQuitar = projecao.reduce((sum, p) => sum + p.festasAQuitar, 0);

    return {
      totalEsperado,
      totalRealizado,
      totalFestasAQuitar,
      mediaEsperadaMensal: totalEsperado / 12,
    };
  }, [projecao]);

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
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Projeção Financeira - Próximos 12 Meses
          </h1>
          <p className="text-muted-foreground">
            Fluxo de recebimento esperado vs realizado
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : resumo && projecao ? (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Esperado (12 meses)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {resumo.totalEsperado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Média Mensal Esperada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {resumo.mediaEsperadaMensal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Realizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {resumo.totalRealizado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Festas a Quitar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {resumo.totalFestasAQuitar}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Área - Comparativo */}
            <Card>
              <CardHeader>
                <CardTitle>Recebimento Esperado vs Realizado</CardTitle>
                <CardDescription>Comparativo mensal de recebimentos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={projecao}>
                    <defs>
                      <linearGradient id="colorEsperado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      }
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="recebimentoEsperado"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorEsperado)"
                      name="Esperado"
                    />
                    <Area
                      type="monotone"
                      dataKey="recebimentoRealizado"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRealizado)"
                      name="Realizado"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Linha - Evolução */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Recebimentos</CardTitle>
                <CardDescription>Tendência de recebimentos ao longo dos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={projecao}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="recebimentoEsperado"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Esperado"
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="recebimentoRealizado"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Realizado"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Barras - Festas a Quitar */}
            <Card>
              <CardHeader>
                <CardTitle>Festas a Quitar por Mês</CardTitle>
                <CardDescription>Quantidade de festas que precisam ser quitadas em cada mês</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projecao}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mes" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => `${value} festas`}
                    />
                    <Legend />
                    <Bar dataKey="festasAQuitar" fill="#f97316" name="Festas a Quitar" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tabela Detalhada */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento Mensal</CardTitle>
                <CardDescription>Valores detalhados por mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Mês</th>
                        <th className="text-right p-2">Recebimento Esperado</th>
                        <th className="text-right p-2">Recebimento Realizado</th>
                        <th className="text-right p-2">Diferença</th>
                        <th className="text-center p-2">Festas a Quitar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projecao.map((item, index) => {
                        const diferenca = item.recebimentoRealizado - item.recebimentoEsperado;
                        return (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-2 font-medium">{item.mesCompleto}</td>
                            <td className="text-right p-2 text-blue-600">
                              R$ {item.recebimentoEsperado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="text-right p-2 text-green-600">
                              R$ {item.recebimentoRealizado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className={`text-right p-2 font-semibold ${diferenca >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {diferenca >= 0 ? "+" : ""}R$ {Math.abs(diferenca).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="text-center p-2">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-orange-600/10 text-orange-600 font-semibold">
                                {item.festasAQuitar}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhum dado disponível para projeção
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
