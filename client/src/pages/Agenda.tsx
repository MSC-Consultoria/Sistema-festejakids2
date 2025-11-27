import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { CalendarDays, Loader2, PartyPopper, DollarSign, Users, Filter, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

type EventoAgenda = {
  id: number;
  tipo: "festa" | "pagamento" | "visitacao";
  data: Date;
  titulo: string;
  subtitulo?: string;
  valor?: number;
  detalhes: any;
};

export default function Agenda() {
  const { user, loading: authLoading } = useAuth();
  const { data: festas, isLoading: loadingFestas } = trpc.festas.list.useQuery();
  const { data: pagamentos, isLoading: loadingPagamentos } = trpc.pagamentos.listAll.useQuery();
  const { data: visitacoes, isLoading: loadingVisitacoes } = trpc.visitacoes.list.useQuery();
  
  const [mesAtual, setMesAtual] = useState(() => {
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  });
  
  const [filtros, setFiltros] = useState({
    festas: true,
    pagamentos: true,
    visitacoes: true,
  });
  
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoAgenda | null>(null);
  const [, setLocation] = useLocation();

  const handleEditar = () => {
    if (!eventoSelecionado) return;
    
    if (eventoSelecionado.tipo === "festa") {
      setLocation(`/festas/${eventoSelecionado.id}`);
    } else if (eventoSelecionado.tipo === "pagamento") {
      setLocation(`/financeiro/registrar?id=${eventoSelecionado.id}`);
    } else if (eventoSelecionado.tipo === "visitacao") {
      setLocation(`/visitacoes?edit=${eventoSelecionado.id}`);
    }
    setEventoSelecionado(null);
  };

  // Consolidar todos os eventos
  const eventos = useMemo((): EventoAgenda[] => {
    const todosEventos: EventoAgenda[] = [];

    if (filtros.festas && festas) {
      festas.forEach((festa) => {
        todosEventos.push({
          id: festa.id,
          tipo: "festa",
          data: new Date(festa.dataFesta),
          titulo: festa.codigo,
          valor: festa.valorTotal,
          detalhes: festa,
        });
      });
    }

    if (filtros.pagamentos && pagamentos) {
      pagamentos.forEach((pag) => {
        todosEventos.push({
          id: pag.id,
          tipo: "pagamento",
          data: new Date(pag.dataPagamento),
          titulo: pag.codigo,
          valor: pag.valor,
          detalhes: pag,
        });
      });
    }

    if (filtros.visitacoes && visitacoes) {
      visitacoes.forEach((vis) => {
        if (vis.dataVisita) {
          todosEventos.push({
            id: vis.id,
            tipo: "visitacao",
            data: new Date(vis.dataVisita),
            titulo: vis.codigo || `VIS-${vis.id}`,
            detalhes: vis,
          });
        }
      });
    }

    return todosEventos;
  }, [festas, pagamentos, visitacoes, filtros]);

  // Gerar dias do mês
  const diasDoMes = useMemo(() => {
    const [ano, mes] = mesAtual.split("-").map(Number);
    const dias: Date[] = [];
    const ultimoDia = new Date(ano, mes, 0);
    
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(new Date(ano, mes - 1, dia));
    }
    
    return dias;
  }, [mesAtual]);

  // Agrupar eventos por dia
  const eventosPorDia = useMemo(() => {
    const grupos: Record<string, EventoAgenda[]> = {};
    
    eventos.forEach((evento) => {
      const diaKey = `${evento.data.getFullYear()}-${String(evento.data.getMonth() + 1).padStart(2, "0")}-${String(evento.data.getDate()).padStart(2, "0")}`;
      
      if (!grupos[diaKey]) {
        grupos[diaKey] = [];
      }
      grupos[diaKey].push(evento);
    });
    
    return grupos;
  }, [eventos]);

  const formatarMesAno = (mesAno: string) => {
    const [ano, mes] = mesAno.split("-");
    const data = new Date(parseInt(ano), parseInt(mes) - 1);
    return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const mudarMes = (direcao: number) => {
    const [ano, mes] = mesAtual.split("-").map(Number);
    const novaData = new Date(ano, mes - 1 + direcao, 1);
    setMesAtual(`${novaData.getFullYear()}-${String(novaData.getMonth() + 1).padStart(2, "0")}`);
  };

  const getCorEvento = (tipo: EventoAgenda["tipo"]) => {
    switch (tipo) {
      case "festa":
        return "border-purple-500 bg-purple-50 dark:bg-purple-950";
      case "pagamento":
        return "border-green-500 bg-green-50 dark:bg-green-950";
      case "visitacao":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950";
    }
  };

  const getIconeEvento = (tipo: EventoAgenda["tipo"]) => {
    switch (tipo) {
      case "festa":
        return <PartyPopper className="h-4 w-4" />;
      case "pagamento":
        return <DollarSign className="h-4 w-4" />;
      case "visitacao":
        return <Users className="h-4 w-4" />;
    }
  };

  const toggleFiltro = (tipo: keyof typeof filtros) => {
    setFiltros((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
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

  const isLoading = loadingFestas || loadingPagamentos || loadingVisitacoes;

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarDays className="h-8 w-8" />
              Agenda Integrada
            </h1>
            <p className="text-muted-foreground">Festas, Pagamentos e Visitações</p>
          </div>
          
          {/* Filtros */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={filtros.festas ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFiltro("festas")}
              className="gap-2"
            >
              <PartyPopper className="h-4 w-4" />
              Festas
            </Button>
            <Button
              variant={filtros.pagamentos ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFiltro("pagamentos")}
              className="gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Pagamentos
            </Button>
            <Button
              variant={filtros.visitacoes ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFiltro("visitacoes")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Visitações
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => mudarMes(-1)}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  ← Anterior
                </button>
                <CardTitle className="capitalize">{formatarMesAno(mesAtual)}</CardTitle>
                <button
                  onClick={() => mudarMes(1)}
                  className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  Próximo →
                </button>
              </div>
              <CardDescription>
                {eventos.filter(e => {
                  const [ano, mes] = mesAtual.split("-").map(Number);
                  return e.data.getFullYear() === ano && e.data.getMonth() === mes - 1;
                }).length} eventos neste mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {diasDoMes.map((dia) => {
                  const diaKey = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;
                  const eventosNoDia = eventosPorDia[diaKey] || [];
                  const hoje = new Date();
                  const ehHoje = dia.toDateString() === hoje.toDateString();
                  
                  return (
                    <div
                      key={diaKey}
                      className={`border rounded-lg p-4 ${ehHoje ? "border-primary bg-primary/5" : ""} ${eventosNoDia.length > 0 ? "bg-accent/30" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold">
                            {dia.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit" })}
                            {ehHoje && <Badge className="ml-2" variant="default">Hoje</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {eventosNoDia.length > 0 ? `${eventosNoDia.length} ${eventosNoDia.length === 1 ? "evento" : "eventos"}` : "Sem eventos"}
                          </div>
                        </div>
                      </div>
                      
                      {eventosNoDia.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {eventosNoDia.map((evento) => (
                            <button
                              key={`${evento.tipo}-${evento.id}`}
                              onClick={() => setEventoSelecionado(evento)}
                              className={`w-full border-l-4 pl-3 py-2 rounded-r text-left hover:opacity-80 transition-opacity ${getCorEvento(evento.tipo)}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 font-medium">
                                    {getIconeEvento(evento.tipo)}
                                    <span>{evento.titulo}</span>
                                  </div>
                                  {evento.subtitulo && (
                                    <div className="text-sm text-muted-foreground mt-1">
                                      {evento.subtitulo}
                                    </div>
                                  )}
                                </div>
                                {evento.valor !== undefined && (
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-sm">
                                      R$ {(evento.valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal de Detalhes */}
        <Dialog open={!!eventoSelecionado} onOpenChange={() => setEventoSelecionado(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {eventoSelecionado && getIconeEvento(eventoSelecionado.tipo)}
                {eventoSelecionado?.titulo}
              </DialogTitle>
              <DialogDescription>
                {eventoSelecionado?.data.toLocaleDateString("pt-BR", { 
                  weekday: "long", 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </DialogDescription>
            </DialogHeader>
            
            {eventoSelecionado && (
              <div className="space-y-4">
                {eventoSelecionado.tipo === "festa" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Código</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.codigo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Cliente</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.clienteNome}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tema</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.tema || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Horário</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.horario || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Valor Total</div>
                      <div className="font-medium">
                        R$ {(eventoSelecionado.detalhes.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge>{eventoSelecionado.detalhes.status}</Badge>
                    </div>
                  </div>
                )}

                {eventoSelecionado.tipo === "pagamento" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Código</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.codigo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pagador</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.pagador || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Valor</div>
                      <div className="font-medium text-green-600">
                        R$ {(eventoSelecionado.detalhes.valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Método</div>
                      <Badge variant="outline">{eventoSelecionado.detalhes.metodoPagamento || "PIX"}</Badge>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">Festa Associada</div>
                      <div className="font-medium">
                        {eventoSelecionado.detalhes.festaId ? `Festa #${eventoSelecionado.detalhes.festaId}` : "Sem festa associada"}
                      </div>
                    </div>
                    {eventoSelecionado.detalhes.observacoes && (
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground">Observações</div>
                        <div className="text-sm">{eventoSelecionado.detalhes.observacoes}</div>
                      </div>
                    )}
                  </div>
                )}

                {eventoSelecionado.tipo === "visitacao" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Cliente</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.nomeCliente}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Telefone</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.telefone || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{eventoSelecionado.detalhes.email || "-"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <Badge>{eventoSelecionado.detalhes.status}</Badge>
                    </div>
                    {eventoSelecionado.detalhes.observacoes && (
                      <div className="col-span-2">
                        <div className="text-sm text-muted-foreground">Observações</div>
                        <div className="text-sm">{eventoSelecionado.detalhes.observacoes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setEventoSelecionado(null)}>
                Fechar
              </Button>
              <Button onClick={handleEditar} className="gap-2">
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
