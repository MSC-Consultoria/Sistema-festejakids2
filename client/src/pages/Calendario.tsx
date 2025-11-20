import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function Calendario() {
  const { user, loading: authLoading } = useAuth();
  const { data: festas, isLoading } = trpc.festas.list.useQuery();

  // Agrupar festas por mês
  const festasPorMes = useMemo(() => {
    if (!festas) return {};

    const grupos: Record<string, typeof festas> = {};
    
    festas.forEach((festa) => {
      const data = new Date(festa.dataFesta);
      const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
      
      if (!grupos[mesAno]) {
        grupos[mesAno] = [];
      }
      grupos[mesAno].push(festa);
    });

    return grupos;
  }, [festas]);

  // Ordenar meses
  const mesesOrdenados = useMemo(() => {
    return Object.keys(festasPorMes).sort();
  }, [festasPorMes]);

  const formatarMes = (mesAno: string) => {
    const [ano, mes] = mesAno.split("-");
    const data = new Date(parseInt(ano), parseInt(mes) - 1);
    return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const calcularTotais = (festasDoMes: typeof festas) => {
    if (!festasDoMes) return { total: 0, valorTotal: 0, valorPago: 0, valorAReceber: 0 };
    
    const valorTotal = festasDoMes.reduce((sum, f) => sum + f.valorTotal, 0);
    const valorPago = festasDoMes.reduce((sum, f) => sum + f.valorPago, 0);
    
    return {
      total: festasDoMes.length,
      valorTotal,
      valorPago,
      valorAReceber: valorTotal - valorPago,
    };
  };

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
            <CalendarIcon className="h-8 w-8" />
            Calendário de Festas
          </h1>
          <p className="text-muted-foreground">Visualize a quantidade de festas por mês</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : mesesOrdenados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma festa cadastrada
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesesOrdenados.map((mesAno) => {
              const festasDoMes = festasPorMes[mesAno];
              const totais = calcularTotais(festasDoMes);
              
              return (
                <Card key={mesAno} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="capitalize">{formatarMes(mesAno)}</CardTitle>
                    <CardDescription>
                      {totais.total} {totais.total === 1 ? "festa" : "festas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quantidade:</span>
                      <span className="text-2xl font-bold">{totais.total}</span>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Valor Total:</span>
                        <span className="font-semibold">
                          R$ {(totais.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Valor Pago:</span>
                        <span className="font-semibold text-green-600">
                          R$ {(totais.valorPago / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">A Receber:</span>
                        <span className="font-semibold text-orange-600">
                          R$ {(totais.valorAReceber / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="text-xs text-muted-foreground mb-1">Status:</div>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-600">
                          {festasDoMes?.filter(f => f.status === "agendada").length || 0} agendadas
                        </span>
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-600">
                          {festasDoMes?.filter(f => f.status === "realizada").length || 0} realizadas
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
