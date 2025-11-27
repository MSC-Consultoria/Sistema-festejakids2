import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Mail, MapPin, FileText, Calendar, DollarSign } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function DetalhesCliente() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  const { data: cliente, isLoading } = trpc.clientes.byId.useQuery(
    { id: parseInt(id!) },
    { enabled: !!id }
  );

  const { data: festas } = trpc.festas.list.useQuery();
  
  // Filtrar festas do cliente
  const festasDoCliente = festas?.filter(f => f.clienteId === parseInt(id!)) || [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!cliente) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-white text-xl">Cliente não encontrado</div>
          <Button onClick={() => setLocation("/clientes")}>
            Voltar para Clientes
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/clientes")}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Detalhes do Cliente</h1>
              <p className="text-slate-400">Informações completas e histórico</p>
            </div>
          </div>
        </div>

        {/* Informações do Cliente */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{cliente.nome}</h2>
                <p className="text-slate-400">Cliente desde {new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cliente.telefone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-400">Telefone</p>
                      <p className="text-white">{cliente.telefone}</p>
                    </div>
                  </div>
                )}

                {cliente.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-400">E-mail</p>
                      <p className="text-white">{cliente.email}</p>
                    </div>
                  </div>
                )}

                {cliente.cpf && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-400">CPF</p>
                      <p className="text-white">{cliente.cpf}</p>
                    </div>
                  </div>
                )}

                {cliente.endereco && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-slate-400">Endereço</p>
                      <p className="text-white">{cliente.endereco}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Total de Festas</p>
                <p className="text-2xl font-bold text-white">{festasDoCliente.length}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Valor Total</p>
                <p className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    festasDoCliente.reduce((acc, f) => acc + (f.valorTotal || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Valor Pago</p>
                <p className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    festasDoCliente.reduce((acc, f) => acc + (f.valorPago || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Histórico de Festas */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Histórico de Festas</h3>
          
          {festasDoCliente.length === 0 ? (
            <p className="text-slate-400 text-center py-8">Nenhuma festa cadastrada para este cliente</p>
          ) : (
            <div className="space-y-4">
              {festasDoCliente.map((festa) => (
                <div
                  key={festa.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setLocation(`/festas/${festa.id}`)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-purple-400">{festa.codigo}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        festa.status === "realizada" ? "bg-green-900 text-green-200" :
                        festa.status === "cancelada" ? "bg-red-900 text-red-200" :
                        "bg-blue-900 text-blue-200"
                      }`}>
                        {festa.status === "agendada" ? "Agendada" :
                         festa.status === "realizada" ? "Realizada" :
                         festa.status === "cancelada" ? "Cancelada" : festa.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Data da Festa</p>
                        <p className="text-white">{new Date(festa.dataFesta).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Tema</p>
                        <p className="text-white">{festa.tema || "-"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Convidados</p>
                        <p className="text-white">{festa.numeroConvidados || "-"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Valor Total</p>
                        <p className="text-white">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(festa.valorTotal || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/festas/${festa.id}`);
                    }}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
