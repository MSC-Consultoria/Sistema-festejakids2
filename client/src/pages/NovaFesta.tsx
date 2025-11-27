import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function NovaFesta() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const [formData, setFormData] = useState({
    clienteId: "",
    dataFechamento: "",
    dataFesta: "",
    valorTotal: "",
    numeroConvidados: "",
    tema: "",
    horario: "",
    // Campos da Ficha de Contrato
    cpfCliente: "",
    endereco: "",
    brinde: "",
    refeicao: "",
    massaType: "",
    molhoType: "",
    bolo: "",
    nomeAniversariante: "",
    idadeAniversariante: "",
    observacoes: "",
  });
  
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    endereco: "",
    email: "",
  });
  
  const [mostrarNovoCliente, setMostrarNovoCliente] = useState(false);

  const { data: clientes, isLoading: loadingClientes } = trpc.clientes.list.useQuery();
  
  const createCliente = trpc.clientes.create.useMutation({
    onSuccess: (data) => {
      toast.success("Cliente cadastrado com sucesso!");
      setFormData(prev => ({ 
        ...prev, 
        clienteId: data.id.toString(),
        cpfCliente: data.cpf || "",
        endereco: data.endereco || "",
      }));
      setMostrarNovoCliente(false);
      setNovoCliente({ nome: "", telefone: "", cpf: "", endereco: "", email: "" });
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar cliente: ${error.message}`);
    },
  });
  
  const [festaRecemCriada, setFestaRecemCriada] = useState<number | null>(null);
  const [mostrarModalSucesso, setMostrarModalSucesso] = useState(false);

  const createFesta = trpc.festas.create.useMutation({
    onSuccess: (data) => {
      setFestaRecemCriada(data.id);
      setMostrarModalSucesso(true);
      toast.success("Festa cadastrada com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar festa: ${error.message}`);
    },
  });

  const gerarContrato = trpc.festas.gerarContrato.useMutation({
    onSuccess: (data) => {
      toast.success("Contrato gerado com sucesso!");
      window.open(data.url, "_blank");
      setMostrarModalSucesso(false);
      setLocation("/festas");
    },
    onError: (error) => {
      toast.error(`Erro ao gerar contrato: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNovoClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleCadastrarCliente = async () => {
    if (!novoCliente.nome || !novoCliente.telefone) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }
    await createCliente.mutateAsync(novoCliente);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId || !formData.dataFechamento || !formData.dataFesta || !formData.valorTotal || !formData.numeroConvidados) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const clienteSelecionado = clientes?.find(c => c.id.toString() === formData.clienteId);
    if (!clienteSelecionado) {
      toast.error("Cliente inválido");
      return;
    }

    await createFesta.mutateAsync({
      clienteId: parseInt(formData.clienteId),
      dataFechamento: new Date(formData.dataFechamento).getTime(),
      dataFesta: new Date(formData.dataFesta).getTime(),
      valorTotal: Math.round(parseFloat(formData.valorTotal) * 100),
      numeroConvidados: parseInt(formData.numeroConvidados),
      tema: formData.tema,
      horario: formData.horario,
      cpfCliente: formData.cpfCliente,
      endereco: formData.endereco,
      brinde: formData.brinde,
      refeicao: formData.refeicao,
      massaType: formData.massaType,
      molhoType: formData.molhoType,
      bolo: formData.bolo,
      nomeAniversariante: formData.nomeAniversariante,
      idadeAniversariante: formData.idadeAniversariante ? parseInt(formData.idadeAniversariante) : undefined,
      observacoes: formData.observacoes,
    });
  };

  if (authLoading) {
    return <DashboardLayout><div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => setLocation("/festas")}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-slate-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Nova Festa</h1>
              <p className="text-slate-400">Cadastre uma nova festa com todos os detalhes da Ficha de Contrato</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleção/Cadastro de Cliente */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!mostrarNovoCliente ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Selecione um cliente</Label>
                      <Select value={formData.clienteId} onValueChange={(value) => {
                        const cliente = clientes?.find(c => c.id.toString() === value) as any;
                        setFormData(prev => ({
                          ...prev,
                          clienteId: value,
                          cpfCliente: cliente?.cpf || "",
                          endereco: cliente?.endereco || "",
                        }));
                      }}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Escolha um cliente..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {loadingClientes ? (
                            <SelectItem value="loading" disabled>Carregando...</SelectItem>
                          ) : clientes && clientes.length > 0 ? (
                            clientes.map(cliente => (
                              <SelectItem key={cliente.id} value={cliente.id.toString()} className="text-white">
                                {cliente.nome} ({cliente.telefone})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>Nenhum cliente encontrado</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMostrarNovoCliente(true)}
                      className="w-full text-slate-300 border-slate-600 hover:bg-slate-700"
                    >
                      + Cadastrar novo cliente
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Nome do cliente</Label>
                      <Input
                        name="nome"
                        value={novoCliente.nome}
                        onChange={handleNovoClienteChange}
                        placeholder="Nome completo"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Telefone</Label>
                      <Input
                        name="telefone"
                        value={novoCliente.telefone}
                        onChange={handleNovoClienteChange}
                        placeholder="(21) 99999-9999"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">CPF</Label>
                      <Input
                        name="cpf"
                        value={novoCliente.cpf}
                        onChange={handleNovoClienteChange}
                        placeholder="000.000.000-00"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Email</Label>
                      <Input
                        name="email"
                        type="email"
                        value={novoCliente.email}
                        onChange={handleNovoClienteChange}
                        placeholder="email@exemplo.com"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Endereço</Label>
                      <Input
                        name="endereco"
                        value={novoCliente.endereco}
                        onChange={handleNovoClienteChange}
                        placeholder="Rua, número, complemento"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleCadastrarCliente}
                        disabled={createCliente.isPending}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                      >
                        {createCliente.isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                        Cadastrar cliente
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setMostrarNovoCliente(false)}
                        className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs para Ficha de Contrato e Degustação */}
            <Tabs defaultValue="contrato" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
                <TabsTrigger value="contrato" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                  Ficha de Contrato
                </TabsTrigger>
                <TabsTrigger value="degustacao" className="text-slate-300 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                  Ficha de Degustação
                </TabsTrigger>
              </TabsList>

              {/* Ficha de Contrato */}
              <TabsContent value="contrato" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Informações do Contrato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">CPF do Cliente</Label>
                        <Input
                          name="cpfCliente"
                          value={formData.cpfCliente}
                          onChange={handleInputChange}
                          placeholder="000.000.000-00"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Email</Label>
                        <Input
                          type="email"
                          value={(clientes?.find(c => c.id.toString() === formData.clienteId) as any)?.email || ""}
                          disabled
                          className="bg-slate-700 border-slate-600 text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Endereço</Label>
                      <Input
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleInputChange}
                        placeholder="Rua, número, complemento"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Data de Fechamento *</Label>
                        <Input
                          name="dataFechamento"
                          type="date"
                          value={formData.dataFechamento}
                          onChange={handleInputChange}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Data do Evento *</Label>
                        <Input
                          name="dataFesta"
                          type="date"
                          value={formData.dataFesta}
                          onChange={handleInputChange}
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Horário do Evento</Label>
                        <Input
                          name="horario"
                          value={formData.horario}
                          onChange={handleInputChange}
                          placeholder="19h"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Quantidade de Convidados *</Label>
                        <Input
                          name="numeroConvidados"
                          type="number"
                          value={formData.numeroConvidados}
                          onChange={handleInputChange}
                          placeholder="80"
                          required
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Tema *</Label>
                      <Input
                        name="tema"
                        value={formData.tema}
                        onChange={handleInputChange}
                        placeholder="Pintando o 7 - formatura"
                        required
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Nome do Aniversariante</Label>
                        <Input
                          name="nomeAniversariante"
                          value={formData.nomeAniversariante}
                          onChange={handleInputChange}
                          placeholder="Nome completo"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Idade do Aniversariante</Label>
                        <Input
                          name="idadeAniversariante"
                          type="number"
                          value={formData.idadeAniversariante}
                          onChange={handleInputChange}
                          placeholder="7"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Ficha de Degustação */}
              <TabsContent value="degustacao" className="space-y-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Ficha de Degustação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Brinde</Label>
                      <Select value={formData.brinde} onValueChange={(value) => handleSelectChange("brinde", value)}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Escolha o brinde..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="acai" className="text-white">Açaí</SelectItem>
                          <SelectItem value="sorvete" className="text-white">Sorvete</SelectItem>
                          <SelectItem value="picolé" className="text-white">Picolé</SelectItem>
                          <SelectItem value="mousse" className="text-white">Mousse</SelectItem>
                          <SelectItem value="outro" className="text-white">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300">Refeição</Label>
                      <Textarea
                        name="refeicao"
                        value={formData.refeicao}
                        onChange={handleInputChange}
                        placeholder="Ex: Penne à bolonhesa"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Tipo de Massa</Label>
                        <Select value={formData.massaType} onValueChange={(value) => handleSelectChange("massaType", value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Escolha a massa..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="pene" className="text-white">Penne</SelectItem>
                            <SelectItem value="fusilli" className="text-white">Fusilli</SelectItem>
                            <SelectItem value="talharim" className="text-white">Talharim</SelectItem>
                            <SelectItem value="outro" className="text-white">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-slate-300">Tipo de Molho</Label>
                        <Select value={formData.molhoType} onValueChange={(value) => handleSelectChange("molhoType", value)}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Escolha o molho..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 border-slate-600">
                            <SelectItem value="bolonhesa" className="text-white">Bolonhesa</SelectItem>
                            <SelectItem value="calabresa" className="text-white">Calabresa</SelectItem>
                            <SelectItem value="sugo" className="text-white">Ao Sugo</SelectItem>
                            <SelectItem value="branco" className="text-white">Molho Branco</SelectItem>
                            <SelectItem value="outro" className="text-white">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300">Bolo</Label>
                      <Textarea
                        name="bolo"
                        value={formData.bolo}
                        onChange={handleInputChange}
                        placeholder="Ex: Massa de chocolate com recheio de brigadeiro"
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Informações Financeiras */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Valor Total da Festa (R$) *</Label>
                  <Input
                    name="valorTotal"
                    type="number"
                    step="0.01"
                    value={formData.valorTotal}
                    onChange={handleInputChange}
                    placeholder="5000.00"
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Observações</Label>
                  <Textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Observações adicionais sobre a festa"
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createFesta.isPending}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3"
              >
                {createFesta.isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                Cadastrar Festa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/festas")}
                className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <Dialog open={mostrarModalSucesso} onOpenChange={setMostrarModalSucesso}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-green-400">✅ Festa Cadastrada com Sucesso!</DialogTitle>
            <DialogDescription className="text-slate-300">
              A festa foi cadastrada no sistema. Deseja gerar o contrato agora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setMostrarModalSucesso(false);
                setLocation("/festas");
              }}
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              Gerar Depois
            </Button>
            <Button
              onClick={() => {
                if (festaRecemCriada) {
                  gerarContrato.mutate({ festaId: festaRecemCriada });
                }
              }}
              disabled={gerarContrato.isPending}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {gerarContrato.isPending ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
              Gerar Contrato Agora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
