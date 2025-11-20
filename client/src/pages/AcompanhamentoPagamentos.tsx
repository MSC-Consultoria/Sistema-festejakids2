import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
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
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Clock, Loader2, TrendingUp, XCircle, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const STATUS_CONFIG = {
  quitado: {
    label: "Quitado",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    borderColor: "border-green-600/20",
  },
  em_dia: {
    label: "Em Dia",
    icon: CheckCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
  },
  atrasado: {
    label: "Atrasado",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-600/10",
    borderColor: "border-red-600/20",
  },
  alerta_quitacao: {
    label: "Alerta Quitação",
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/20",
  },
  nao_quitado: {
    label: "Não Quitado",
    icon: XCircle,
    color: "text-red-800",
    bgColor: "bg-red-800/10",
    borderColor: "border-red-800/20",
  },
};

export default function AcompanhamentoPagamentos() {
  const { user, loading: authLoading } = useAuth();
  const { data: festasComStatus, isLoading } = trpc.acompanhamento.listarComStatus.useQuery();

  const estatisticas = useMemo(() => {
    if (!festasComStatus) return null;

    const quitadas = festasComStatus.filter(f => f.status === "quitado").length;
    const emDia = festasComStatus.filter(f => f.status === "em_dia").length;
    const atrasadas = festasComStatus.filter(f => f.status === "atrasado").length;
    const alertaQuitacao = festasComStatus.filter(f => f.status === "alerta_quitacao").length;
    const naoQuitadas = festasComStatus.filter(f => f.status === "nao_quitado").length;

    const totalReceber = festasComStatus.reduce((sum, f) => sum + f.saldo, 0);

    return {
      quitadas,
      emDia,
      atrasadas,
      alertaQuitacao,
      naoQuitadas,
      totalReceber,
      total: festasComStatus.length,
    };
  }, [festasComStatus]);

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
            <TrendingUp className="h-8 w-8" />
            Acompanhamento de Pagamentos
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Controle de parcelas mínimas (R$ 500/mês) e quitação 10 dias antes do evento
            </p>
            <Link href="/projecao">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Ver Projeção 12 Meses
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : estatisticas && festasComStatus ? (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                </CardContent>
              </Card>

              <Card className="border-green-600/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-600">Quitadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{estatisticas.quitadas}</div>
                </CardContent>
              </Card>

              <Card className="border-blue-600/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-600">Em Dia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{estatisticas.emDia}</div>
                </CardContent>
              </Card>

              <Card className="border-red-600/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-600">Atrasadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{estatisticas.atrasadas}</div>
                </CardContent>
              </Card>

              <Card className="border-orange-600/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-600">Alerta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{estatisticas.alertaQuitacao}</div>
                </CardContent>
              </Card>

              <Card className="border-red-800/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-800">Não Quitadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-800">{estatisticas.naoQuitadas}</div>
                </CardContent>
              </Card>
            </div>

            {/* Card de Total a Receber */}
            <Card>
              <CardHeader>
                <CardTitle>Total a Receber</CardTitle>
                <CardDescription>Saldo pendente de todas as festas não quitadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  R$ {(estatisticas.totalReceber / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Festas */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento por Festa</CardTitle>
                <CardDescription>Status de pagamento de cada festa</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data Festa</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                      <TableHead className="text-right">Pago</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                      <TableHead className="text-right">Mínimo Esperado</TableHead>
                      <TableHead className="text-center">Dias p/ Evento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {festasComStatus
                      .sort((a, b) => {
                        // Ordenar por status (mais urgente primeiro)
                        const ordem = ["nao_quitado", "alerta_quitacao", "atrasado", "em_dia", "quitado"];
                        return ordem.indexOf(a.status) - ordem.indexOf(b.status);
                      })
                      .map((festa) => {
                        const config = STATUS_CONFIG[festa.status];
                        const Icon = config.icon;

                        return (
                          <TableRow key={festa.id} className={`${config.bgColor} ${config.borderColor} border-l-4`}>
                            <TableCell className="font-medium">{festa.codigo}</TableCell>
                            <TableCell>{festa.clienteNome}</TableCell>
                            <TableCell>
                              {new Date(festa.dataFesta).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {(festa.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-green-600 font-semibold">
                              R$ {(festa.totalPago / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              <span className={festa.saldo > 0 ? "text-orange-600" : "text-green-600"}>
                                R$ {(festa.saldo / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </span>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              R$ {(festa.valorMinimoEsperado / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={festa.diasParaEvento <= 10 ? "destructive" : "secondary"}>
                                {festa.diasParaEvento} dias
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className={`flex items-center gap-2 ${config.color}`}>
                                <Icon className="h-4 w-4" />
                                <span className="font-medium">{config.label}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Legenda */}
            <Card>
              <CardHeader>
                <CardTitle>Legenda de Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <div key={key} className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border-l-4`}>
                        <div className={`flex items-center gap-2 ${config.color} font-medium mb-2`}>
                          <Icon className="h-5 w-5" />
                          {config.label}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {key === "quitado" && "Festa totalmente paga"}
                          {key === "em_dia" && "Pagando R$ 500/mês ou mais"}
                          {key === "atrasado" && "Pagamento abaixo do mínimo"}
                          {key === "alerta_quitacao" && "Faltam 10 dias ou menos"}
                          {key === "nao_quitado" && "Passou da data limite"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Nenhuma festa cadastrada
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
