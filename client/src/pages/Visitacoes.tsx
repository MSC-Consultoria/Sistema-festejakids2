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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Phone, Mail, Calendar, TrendingUp, Users, CheckCircle2, XCircle, Clock, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Visitacoes() {
  const [, setLocation] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("contrato");
  
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
    cpf: "",
    endereco: "",
    dataVisita: new Date().toISOString().split("T")[0],
    dataPretendida: "",
    horario: "",
    interesse: "",
    tema: "",
    numeroConvidados: "",
    brinde: "",
    refeicao: "",
    massaType: "",
    molhoType: "",
    bolo: "",
    nomeAniversariante: "",
    idadeAniversariante: "",
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        cpf: formData.cpf || undefined,
        endereco: formData.endereco || undefined,
        dataVisita: new Date(formData.dataVisita).getTime(),
        dataPretendida: formData.dataPretendida ? new Date(formData.dataPretendida).getTime() : undefined,
        horario: formData.horario || undefined,
        interesse: formData.interesse || undefined,
        tema: formData.tema || undefined,
        numeroConvidados: formData.numeroConvidados ? parseInt(formData.numeroConvidados) : undefined,
        brinde: formData.brinde || undefined,
        refeicao: formData.refeicao || undefined,
        massaType: formData.massaType || undefined,
        molhoType: formData.molhoType || undefined,
        bolo: formData.bolo || undefined,
        nomeAniversariante: formData.nomeAniversariante || undefined,
        idadeAniversariante: formData.idadeAniversariante ? parseInt(formData.idadeAniversariante) : undefined,
        observacoes: formData.observacoes || undefined,
      };

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...payload,
        });
        toast.success("Visitação atualizada com sucesso!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Visitação cadastrada com sucesso!");
      }
      
      setDialogOpen(false);
      setEditingId(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar visitação");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      cpf: "",
      endereco: "",
      dataVisita: new Date().toISOString().split("T")[0],
      dataPretendida: "",
      horario: "",
      interesse: "",
      tema: "",
      numeroConvidados: "",
      brinde: "",
      refeicao: "",
      massaType: "",
      molhoType: "",
      bolo: "",
      nomeAniversariante: "",
      idadeAniversariante: "",
      observacoes: "",
    });
  };

  const handleEdit = (visitacao: any) => {
    setEditingId(visitacao.id);
    setFormData({
      nome: visitacao.nome,
      telefone: visitacao.telefone,
      email: visitacao.email || "",
      cpf: visitacao.cpf || "",
      endereco: visitacao.endereco || "",
      dataVisita: new Date(visitacao.dataVisita).toISOString().split("T")[0],
      dataPretendida: visitacao.dataPretendida ? new Date(visitacao.dataPretendida).toISOString().split("T")[0] : "",
      horario: visitacao.horario || "",
      interesse: visitacao.interesse || "",
      tema: visitacao.tema || "",
      numeroConvidados: visitacao.numeroConvidados?.toString() || "",
      brinde: visitacao.brinde || "",
      refeicao: visitacao.refeicao || "",
      massaType: visitacao.massaType || "",
      molhoType: visitacao.molhoType || "",
      bolo: visitacao.bolo || "",
      nomeAniversariante: visitacao.nomeAniversariante || "",
      idadeAniversariante: visitacao.idadeAniversariante?.toString() || "",
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

  const handleConverter = async (id: number) => {
    try {
      await converterMutation.mutateAsync({ visitacaoId: id });
      toast.success("Visitação convertida em cliente com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao converter visitação");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="hover:bg-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-white">Visitações</h1>
              <p className="text-slate-400">Gerencie leads e degustações</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Visitações</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Aguardando</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.aguardando || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Fechados</p>
                  <p className="text-3xl font-bold text-green-400">{stats.fechado || 0}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Perdidos</p>
                  <p className="text-3xl font-bold text-red-400">{stats.perdido || 0}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
            </Card>
          </div>
        )}

        {/* Dialog para nova visitação */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={() => {
                setEditingId(null);
                resetForm();
                setActiveTab("contrato");
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nova Visitação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingId ? "Editar Visitação" : "Nova Visitação"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="contrato" className="data-[state=active]:bg-blue-600">
                    Ficha de Contrato
                  </TabsTrigger>
                  <TabsTrigger value="degustacao" className="data-[state=active]:bg-blue-600">
                    Ficha de Degustação
                  </TabsTrigger>
                </TabsList>

                {/* Aba Contrato */}
                <TabsContent value="contrato" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Nome *</Label>
                      <Input
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Nome do cliente"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">CPF</Label>
                      <Input
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Endereço</Label>
                    <Textarea
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      placeholder="Rua, número, bairro..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Telefone *</Label>
                      <Input
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="(21) 9999-9999"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Quantidade de Convidados</Label>
                      <Input
                        type="number"
                        value={formData.numeroConvidados}
                        onChange={(e) => setFormData({ ...formData, numeroConvidados: e.target.value })}
                        placeholder="80"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Data do Evento</Label>
                      <Input
                        type="date"
                        value={formData.dataPretendida}
                        onChange={(e) => setFormData({ ...formData, dataPretendida: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Horário</Label>
                      <Input
                        type="time"
                        value={formData.horario}
                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Tema</Label>
                    <Input
                      value={formData.tema}
                      onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                      placeholder="Pintando o 7 - formatura"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Nome do Aniversariante</Label>
                    <Input
                      value={formData.nomeAniversariante}
                      onChange={(e) => setFormData({ ...formData, nomeAniversariante: e.target.value })}
                      placeholder="Nome"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-slate-300">Idade do Aniversariante</Label>
                    <Input
                      type="number"
                      value={formData.idadeAniversariante}
                      onChange={(e) => setFormData({ ...formData, idadeAniversariante: e.target.value })}
                      placeholder="7"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </TabsContent>

                {/* Aba Degustação */}
                <TabsContent value="degustacao" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-slate-300">Brinde</Label>
                    <Select value={formData.brinde} onValueChange={(value) => setFormData({ ...formData, brinde: value })}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Selecione o brinde" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="acai">Açaí</SelectItem>
                        <SelectItem value="sorvete">Sorvete</SelectItem>
                        <SelectItem value="picolé">Picolé</SelectItem>
                        <SelectItem value="doce">Doce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-slate-300">Refeição</Label>
                    <Textarea
                      value={formData.refeicao}
                      onChange={(e) => setFormData({ ...formData, refeicao: e.target.value })}
                      placeholder="Descrição da refeição"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Tipo de Massa</Label>
                      <Select value={formData.massaType} onValueChange={(value) => setFormData({ ...formData, massaType: value })}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="pene">Pene</SelectItem>
                          <SelectItem value="fusilli">Fusilli</SelectItem>
                          <SelectItem value="talharim">Talharim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Tipo de Molho</Label>
                      <Select value={formData.molhoType} onValueChange={(value) => setFormData({ ...formData, molhoType: value })}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="bolonhesa">Bolonhesa</SelectItem>
                          <SelectItem value="calabresa">Calabresa</SelectItem>
                          <SelectItem value="sugo">Ao Sugo</SelectItem>
                          <SelectItem value="branco">Molho Branco</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-300">Bolo</Label>
                    <Textarea
                      value={formData.bolo}
                      onChange={(e) => setFormData({ ...formData, bolo: e.target.value })}
                      placeholder="Massa de chocolate e recheio de brigadeiro"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div>
                <Label className="text-slate-300">Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Notas adicionais..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Listagem */}
        <div className="space-y-4">
          {visitacoes.map((visitacao) => (
            <Card key={visitacao.id} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-white">{visitacao.nome}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      visitacao.status === "fechado" ? "bg-green-900 text-green-200" :
                      visitacao.status === "aguardando" ? "bg-yellow-900 text-yellow-200" :
                      visitacao.status === "perdido" ? "bg-red-900 text-red-200" :
                      "bg-blue-900 text-blue-200"
                    }`}>
                      {visitacao.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {visitacao.telefone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {visitacao.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(visitacao.dataVisita).toLocaleDateString("pt-BR")}
                    </div>
                    {visitacao.tema && (
                      <div className="text-slate-400">
                        Tema: {visitacao.tema}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(visitacao)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Editar
                  </Button>
                  {visitacao.status === "fechado" && !visitacao.clienteId && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConverter(visitacao.id)}
                      className="border-green-600 text-green-400 hover:bg-green-900"
                    >
                      Converter
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(visitacao.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
