import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { formatCurrency } from "@/const";
import { 
  PartyPopper, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Users,
  BarChart3,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: stats, isLoading } = trpc.festas.stats.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  const cards = [
    {
      title: "Total de Festas",
      value: stats?.total || 0,
      subtitle: `${stats?.agendadas || 0} agendadas, ${stats?.realizadas || 0} realizadas`,
      icon: PartyPopper,
      gradient: "gradient-primary",
      link: "/festas"
    },
    {
      title: "Faturamento Total",
      value: formatCurrency(stats?.valorTotal || 0),
      subtitle: "Valor total de todas as festas",
      icon: DollarSign,
      gradient: "gradient-success",
      link: "/financeiro"
    },
    {
      title: "Valor a Receber",
      value: formatCurrency(stats?.valorAReceber || 0),
      subtitle: "Saldo pendente de pagamento",
      icon: Wallet,
      gradient: "gradient-warning",
      link: "/acompanhamento"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(stats?.ticketMedio || 0),
      subtitle: "Valor médio por festa realizada",
      icon: TrendingUp,
      gradient: "gradient-primary",
      link: "/relatorios"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Visão geral do seu negócio
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link key={index} href={card.link}>
                <Card className="card-hover cursor-pointer overflow-hidden border-2 hover:border-primary/50">
                  <div className={`h-2 ${card.gradient}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${card.gradient}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl md:text-3xl font-bold mb-1">
                      {card.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Próximas Ações */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Próximas Ações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/festas">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5">
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <PartyPopper className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Gerencie suas festas</p>
                      <p className="text-xs text-muted-foreground">
                        Visualize, edite e acompanhe todas as festas
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/clientes">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5">
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Cadastre e consulte clientes</p>
                      <p className="text-xs text-muted-foreground">
                        Gerencie informações de contato e histórico
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/custos">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5">
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Controle custos</p>
                      <p className="text-xs text-muted-foreground">
                        Registre custos variáveis e fixos mensais
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/relatorios">
                <Button variant="outline" className="w-full justify-start h-auto py-4 hover:bg-primary/5">
                  <div className="flex items-center gap-3 w-full">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold">Visualize relatórios</p>
                      <p className="text-xs text-muted-foreground">
                        Análises mensais, trimestrais e anuais
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor Recebido</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency((stats?.valorTotal || 0) - (stats?.valorAReceber || 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Valor a Receber</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats?.valorAReceber || 0)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats?.valorTotal || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
