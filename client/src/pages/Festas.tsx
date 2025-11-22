import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatDate } from "@/const";
import { Plus, Eye, Pencil, Trash2, Calendar, Users, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Festas() {
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const { data: festas, isLoading } = trpc.festas.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();

  const festasFiltradas = festas?.filter((festa) => {
    if (statusFilter === "todas") return true;
    return festa.status === statusFilter;
  });

  const getClienteNome = (clienteId: number) => {
    const cliente = clientes?.find((c) => c.id === clienteId);
    return cliente?.nome || "Cliente não encontrado";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; color: string }> = {
      agendada: { variant: "default", color: "bg-blue-600/10 text-blue-600 border-blue-600/20" },
      realizada: { variant: "secondary", color: "bg-green-600/10 text-green-600 border-green-600/20" },
      cancelada: { variant: "outline", color: "bg-red-600/10 text-red-600 border-red-600/20" },
    };
    const config = variants[status] || variants.agendada;
    return (
      <Badge variant={config.variant} className={config.color}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Festas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie todas as festas cadastradas
            </p>
          </div>
          <Link href="/festas/nova">
            <Button className="w-full sm:w-auto" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Nova Festa
            </Button>
          </Link>
        </div>

        {/* Filtros - Mobile Optimized */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="agendada">Agendadas</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Festas - Cards Mobile */}
        <div className="space-y-3">
          {festasFiltradas && festasFiltradas.length > 0 ? (
            festasFiltradas.map((festa) => (
              <Card key={festa.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Header do Card */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold text-primary">
                          {festa.codigo}
                        </span>
                        {getStatusBadge(festa.status)}
                      </div>
                      <h3 className="font-semibold text-base">
                        {festa.clienteNome || getClienteNome(festa.clienteId)}
                      </h3>
                    </div>
                  </div>

                  {/* Informações Principais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Data da Festa</p>
                        <p className="font-medium">{formatDate(festa.dataFesta)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Convidados</p>
                        <p className="font-medium">{festa.numeroConvidados}</p>
                      </div>
                    </div>
                  </div>

                  {/* Valores Financeiros */}
                  <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Valor Total</p>
                      <p className="font-semibold text-sm">{formatCurrency(festa.valorTotal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Pago</p>
                      <p className="font-semibold text-sm text-green-600">
                        {formatCurrency(festa.valorPago)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Saldo</p>
                      <p className="font-semibold text-sm text-orange-600">
                        {formatCurrency(festa.valorTotal - festa.valorPago)}
                      </p>
                    </div>
                  </div>

                  {/* Barra de Progresso */}
                  <div className="mb-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 transition-all"
                        style={{
                          width: `${(festa.valorPago / festa.valorTotal) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {((festa.valorPago / festa.valorTotal) * 100).toFixed(0)}% pago
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Link href={`/festas/${festa.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/festas/${festa.id}/editar`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma festa encontrada</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo - Mobile Optimized */}
        {festasFiltradas && festasFiltradas.length > 0 && (
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-semibold text-foreground">{festasFiltradas.length}</span>{" "}
                {festasFiltradas.length === 1 ? "festa encontrada" : "festas encontradas"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
