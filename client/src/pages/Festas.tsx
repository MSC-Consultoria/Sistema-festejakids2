import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { formatCurrency, formatDate } from "@/const";
import { Plus, Eye, Pencil, Trash2, Calendar, Users, DollarSign, Search, X } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

export default function Festas() {
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const [searchCodigo, setSearchCodigo] = useState<string>("");
  const [searchCpf, setSearchCpf] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [ordenacao, setOrdenacao] = useState<string>("data-desc");
  
  const { data: festas, isLoading } = trpc.festas.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();

  const festasFiltradas = useMemo(() => {
    if (!festas) return [];
    
    let resultado = festas.filter((festa) => {
      // Filtro de status
      if (statusFilter !== "todas" && festa.status !== statusFilter) return false;
      
      // Filtro de código
      if (searchCodigo && !festa.codigo.toLowerCase().includes(searchCodigo.toLowerCase())) return false;
      
      // Filtro de CPF
      if (searchCpf) {
        const cliente = clientes?.find(c => c.id === festa.clienteId);
        if (!cliente || !cliente.cpf?.includes(searchCpf)) return false;
      }
      
      // Filtro de período de datas
      if (dataInicio) {
        const dataFesta = new Date(festa.dataFesta);
        const dataInicioObj = new Date(dataInicio);
        if (dataFesta < dataInicioObj) return false;
      }
      
      if (dataFim) {
        const dataFesta = new Date(festa.dataFesta);
        const dataFimObj = new Date(dataFim);
        if (dataFesta > dataFimObj) return false;
      }
      
      return true;
    });
    
    // Aplicar ordenação
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case "data-asc":
          return new Date(a.dataFesta).getTime() - new Date(b.dataFesta).getTime();
        case "data-desc":
          return new Date(b.dataFesta).getTime() - new Date(a.dataFesta).getTime();
        case "valor-asc":
          return (a.valorTotal || 0) - (b.valorTotal || 0);
        case "valor-desc":
          return (b.valorTotal || 0) - (a.valorTotal || 0);
        case "cliente-asc":
          return (a.clienteNome || "").localeCompare(b.clienteNome || "");
        default:
          return 0;
      }
    });
    
    return resultado;
  }, [festas, statusFilter, searchCodigo, searchCpf, dataInicio, dataFim, ordenacao, clientes]);

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

        {/* Filtros Avançados */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Linha 1: Status e Busca por Código */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="agendada">Agendadas</SelectItem>
                    <SelectItem value="realizada">Realizadas</SelectItem>
                    <SelectItem value="cancelada">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código (ex: FK001)"
                    value={searchCodigo}
                    onChange={(e) => setSearchCodigo(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Linha 2: CPF e Período de Datas */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por CPF"
                    value={searchCpf}
                    onChange={(e) => setSearchCpf(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Input
                  type="date"
                  placeholder="Data início"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full sm:w-[150px]"
                />
                
                <Input
                  type="date"
                  placeholder="Data fim"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full sm:w-[150px]"
                />
              </div>
              
              {/* Linha 3: Ordenação e Botão Limpar */}
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data-desc">Data (Mais Recente)</SelectItem>
                    <SelectItem value="data-asc">Data (Mais Antiga)</SelectItem>
                    <SelectItem value="valor-desc">Valor (Maior)</SelectItem>
                    <SelectItem value="valor-asc">Valor (Menor)</SelectItem>
                    <SelectItem value="cliente-asc">Cliente (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchCodigo || searchCpf || dataInicio || dataFim || statusFilter !== "todas") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusFilter("todas");
                      setSearchCodigo("");
                      setSearchCpf("");
                      setDataInicio("");
                      setDataFim("");
                      setOrdenacao("data-desc");
                    }}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
              
              {/* Contador de resultados */}
              <div className="text-sm text-muted-foreground">
                Mostrando {festasFiltradas.length} de {festas?.length || 0} festas
              </div>
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
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(festa.dataFesta)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{festa.numeroConvidados || 0} convidados</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{formatCurrency(festa.valorTotal || 0)}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Link href={`/clientes/${festa.clienteId}`}>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Cliente
                      </Button>
                    </Link>
                    <Link href={`/festas/editar/${festa.id}`}>
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma festa encontrada com os filtros selecionados</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
