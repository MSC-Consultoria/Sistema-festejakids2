import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Phone, Mail, Calendar, TrendingUp, Users, CheckCircle2, XCircle, Clock, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Visitacoes() {
  const [, setLocation] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { data: visitacoes = [], refetch } = trpc.visitacoes.list.useQuery();
  const { data: stats } = trpc.visitacoes.stats.useQuery();
  const createMutation = trpc.visitacoes.create.useMutation();
  const updateMutation = trpc.visitacoes.update.useMutation();
  const deleteMutation = trpc.visitacoes.delete.useMutation();
  const converterMutation = trpc.visitacoes.converterEmCliente.useMutation();

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    dataVisita: new Date().toISOString().split("T")[0],
    interesse: "",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          dataVisita: new Date(formData.dataVisita).getTime(),
        });
        toast.success("Visitação atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          dataVisita: new Date(formData.dataVisita).getTime(),
        });
        toast.success("Visitação cadastrada com sucesso!");
      }
      
      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        dataVisita: new Date().toISOString().split("T")[0],
        interesse: "",
        observacoes: "",
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar visitação");
    }
  };

  const handleEdit = (visitacao: any) => {
    setEditingId(visitacao.id);
    setFormData({
      nome: visitacao.nome,
      telefone: visitacao.telefone,
      email: visitacao.email || "",
      dataVisita: new Date(visitacao.dataVisita).toISOString().split("T")[0],
      interesse: visitacao.interesse || "",
      observacoes: visitacao.observacoes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta visitação?")) return;
    
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Visitação excluída com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir visitação");
    }
  };

  const handleConverterEmCliente = async (visitacaoId: number) => {
    if (!confirm("Converter esta visitação em cliente?")) return;
    
    try {
      await converterMutation.mutateAsync({ visitacaoId });
      toast.success("Visitação convertida em cliente com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao converter em cliente");
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateMutation.mutateAsync({ id, status: status as any });
      toast.success("Status atualizado!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar status");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      visitou: { label: "Visitou", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Users },
      aguardando: { label: "Aguardando", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
      proposta_enviada: { label: "Proposta Enviada", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: Send },
      fechado: { label: "Fechado", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
      perdido: { label: "Perdido", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
    };
    
    const badge = badges[status] || badges.visitou;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        <Icon className="h-3.5 w-3.5" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Controle de Visitações
              </h1>
              <p className="text-gray-400 mt-1">Gerencie leads e acompanhe conversões</p>
            </div>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Nova Visitação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {editingId ? "Editar Visitação" : "Nova Visitação"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-gray-300">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-gray-300">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataVisita" className="text-gray-300">Data da Visita *</Label>
                    <Input
                      id="dataVisita"
                      type="date"
                      value={formData.dataVisita}
                      onChange={(e) => setFormData({ ...formData, dataVisita: e.target.value })}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interesse" className="text-gray-300">Interesse</Label>
                  <Input
                    id="interesse"
                    value={formData.interesse}
                    onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                    placeholder="Ex: Festa infantil tema Frozen"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-gray-300">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      setEditingId(null);
                    }}
                    className="border-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="gradient-primary">
                    {editingId ? "Atualizar" : "Cadastrar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-gray-400">Total</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.aguardando}</p>
                  <p className="text-xs text-gray-400">Aguardando</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 p-4">
              <div className="flex items-center gap-3">
                <Send className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.propostaEnviada}</p>
                  <p className="text-xs text-gray-400">Propostas</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.fechado}</p>
                  <p className="text-xs text-gray-400">Fechados</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20 p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.perdido}</p>
                  <p className="text-xs text-gray-400">Perdidos</p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/20 p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.taxaConversao}%</p>
                  <p className="text-xs text-gray-400">Conversão</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Visitações List */}
        <div className="space-y-4">
          {visitacoes.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800 p-12 text-center">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Nenhuma visitação cadastrada</p>
              <p className="text-gray-500 text-sm mt-2">Clique em "Nova Visitação" para começar</p>
            </Card>
          ) : (
            visitacoes.map((visitacao: any) => (
              <Card key={visitacao.id} className="bg-gray-900/50 border-gray-800 p-4 md:p-6 card-hover">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{visitacao.nome}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-4 w-4" />
                            {visitacao.telefone}
                          </span>
                          {visitacao.email && (
                            <span className="flex items-center gap-1.5">
                              <Mail className="h-4 w-4" />
                              {visitacao.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(visitacao.dataVisita).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(visitacao.status)}
                    </div>

                    {visitacao.interesse && (
                      <p className="text-sm text-gray-300">
                        <span className="font-medium">Interesse:</span> {visitacao.interesse}
                      </p>
                    )}

                    {visitacao.observacoes && (
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Obs:</span> {visitacao.observacoes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Select
                      value={visitacao.status}
                      onValueChange={(value) => handleUpdateStatus(visitacao.id, value)}
                    >
                      <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="visitou">Visitou</SelectItem>
                        <SelectItem value="aguardando">Aguardando</SelectItem>
                        <SelectItem value="proposta_enviada">Proposta Enviada</SelectItem>
                        <SelectItem value="fechado">Fechado</SelectItem>
                        <SelectItem value="perdido">Perdido</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(visitacao)}
                        className="flex-1 border-gray-700"
                      >
                        Editar
                      </Button>
                      
                      {visitacao.status !== "fechado" && !visitacao.clienteId && (
                        <Button
                          size="sm"
                          onClick={() => handleConverterEmCliente(visitacao.id)}
                          className="flex-1 gradient-success"
                        >
                          Converter
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(visitacao.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
