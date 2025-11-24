import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatCurrency } from "@/const";
import { Calendar, DollarSign, PartyPopper, TrendingUp, FileCheck, CheckCircle, UserPlus, CalendarCheck, ShoppingCart } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.festas.stats.useQuery();
  const { data: visitacoesStats } = trpc.visitacoes.stats.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu negócio
          </p>
        </div>

        {/* Cards principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contratos Fechados
              </CardTitle>
              <FileCheck className="h-4 w-4 text-chart-1" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitacoesStats?.fechado || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Visitações convertidas em clientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Festas Realizadas
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.realizadas || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Festas já concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Visitas Realizadas
              </CardTitle>
              <UserPlus className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitacoesStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de visitações registradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conversão
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visitacoesStats?.taxaConversao.toFixed(1) || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Visitas convertidas em contratos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards do Mês Corrente */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Festas Realizadas (Mês)
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.festasRealizadasMes || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Festas concluídas no mês corrente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Festas Vendidas (Mês)
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.festasVendidasMes || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Contratos fechados no mês corrente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cards de faturamento */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Festas
              </CardTitle>
              <PartyPopper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.agendadas || 0} agendadas, {stats?.realizadas || 0} realizadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.valorTotal || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor total de todas as festas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor a Receber
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.valorAReceber || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Saldo pendente de pagamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ticket Médio
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.ticketMedio || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor médio por festa realizada
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use o menu lateral para navegar pelas funcionalidades:
              </p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li>Gerencie suas festas em <strong>Festas</strong></li>
                <li>Cadastre e consulte clientes em <strong>Clientes</strong></li>
                <li>Controle custos em <strong>Custos</strong></li>
                <li>Visualize relatórios em <strong>Relatórios</strong></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor Recebido</span>
                <span className="font-semibold">{formatCurrency(stats?.valorPago || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Valor a Receber</span>
                <span className="font-semibold">{formatCurrency(stats?.valorAReceber || 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm font-medium">Total</span>
                <span className="font-bold">{formatCurrency(stats?.valorTotal || 0)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
