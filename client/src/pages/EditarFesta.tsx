import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { toast } from "sonner";

export default function EditarFesta() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const festaId = params.id ? parseInt(params.id) : null;
  
  const [formData, setFormData] = useState({
    clienteId: "",
    dataFechamento: "",
    dataFesta: "",
    valorTotal: "",
    numeroConvidados: "",
    tema: "",
    horario: "",
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

  const { data: festa, isLoading: loadingFesta } = trpc.festas.byId.useQuery(
    { id: festaId! },
    { enabled: !!festaId }
  );

  const { data: clientes, isLoading: loadingClientes } = trpc.clientes.list.useQuery();

  // Preencher formulário com dados da festa
  useEffect(() => {
    if (festa) {
      setFormData({
        clienteId: festa.clienteId.toString(),
        dataFechamento: festa.dataFechamento ? new Date(festa.dataFechamento).toISOString().split('T')[0] : "",
        dataFesta: festa.dataFesta ? new Date(festa.dataFesta).toISOString().split('T')[0] : "",
        valorTotal: festa.valorTotal ? (festa.valorTotal / 100).toString() : "",
        numeroConvidados: festa.numeroConvidados?.toString() || "",
        tema: festa.tema || "",
        horario: festa.horario || "",
        cpfCliente: festa.cpfCliente || "",
        endereco: festa.endereco || "",
        brinde: festa.brinde || "",
        refeicao: festa.refeicao || "",
        massaType: festa.massaType || "",
        molhoType: festa.molhoType || "",
        bolo: festa.bolo || "",
        nomeAniversariante: festa.nomeAniversariante || "",
        idadeAniversariante: festa.idadeAniversariante?.toString() || "",
        observacoes: festa.observacoes || "",
      });
    }
  }, [festa]);

  const updateFesta = trpc.festas.update.useMutation({
    onSuccess: () => {
      toast.success("Festa atualizada com sucesso!");
      setLocation("/festas");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar festa: ${error.message}`);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!festaId) {
      toast.error("ID da festa não encontrado");
      return;
    }

    if (!formData.clienteId || !formData.dataFesta || !formData.valorTotal) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const dataFechaTimestamp = formData.dataFechamento 
      ? new Date(formData.dataFechamento + "T00:00:00").getTime()
      : undefined;
    const dataFestaTimestamp = new Date(formData.dataFesta + "T00:00:00").getTime();
    const valorTotalCentavos = Math.round(parseFloat(formData.valorTotal) * 100);

    await updateFesta.mutateAsync({
      id: festaId,
      clienteId: parseInt(formData.clienteId),
      dataFechamento: dataFechaTimestamp,
      dataFesta: dataFestaTimestamp,
      valorTotal: valorTotalCentavos,
      numeroConvidados: formData.numeroConvidados ? parseInt(formData.numeroConvidados) : undefined,
      tema: formData.tema || undefined,
      horario: formData.horario || undefined,
      cpfCliente: formData.cpfCliente || undefined,
      endereco: formData.endereco || undefined,
      brinde: formData.brinde || undefined,
      refeicao: formData.refeicao || undefined,
      massaType: formData.massaType || undefined,
      molhoType: formData.molhoType || undefined,
      bolo: formData.bolo || undefined,
      nomeAniversariante: formData.nomeAniversariante || undefined,
      idadeAniversariante: formData.idadeAniversariante ? parseInt(formData.idadeAniversariante) : undefined,
      observacoes: formData.observacoes || undefined,
    });
  };

  if (authLoading || loadingFesta || loadingClientes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!festa) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Festa não encontrada</CardTitle>
            <CardDescription>A festa que você está tentando editar não existe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/festas")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Festas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/festas")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold">Editar Festa</h1>
        <p className="text-muted-foreground">Atualize os detalhes da festa {festa.codigo}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clienteId">Selecione um cliente</Label>
              <Select
                value={formData.clienteId}
                onValueChange={(value) => handleSelectChange("clienteId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nome} ({cliente.telefone})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contrato" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contrato">Ficha de Contrato</TabsTrigger>
          <TabsTrigger value="degustacao">Ficha de Degustação</TabsTrigger>
        </TabsList>

        <TabsContent value="contrato">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Contrato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpfCliente">CPF do Cliente</Label>
                  <Input
                    id="cpfCliente"
                    name="cpfCliente"
                    placeholder="000.000.000-00"
                    value={formData.cpfCliente}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={clientes?.find(c => c.id === parseInt(formData.clienteId))?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  placeholder="Rua, número, complemento"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataFechamento">Data de Fechamento *</Label>
                  <Input
                    id="dataFechamento"
                    name="dataFechamento"
                    type="date"
                    value={formData.dataFechamento}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dataFesta">Data do Evento *</Label>
                  <Input
                    id="dataFesta"
                    name="dataFesta"
                    type="date"
                    value={formData.dataFesta}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="horario">Horário do Evento</Label>
                  <Input
                    id="horario"
                    name="horario"
                    placeholder="19h"
                    value={formData.horario}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="numeroConvidados">Quantidade de Convidados</Label>
                  <Input
                    id="numeroConvidados"
                    name="numeroConvidados"
                    type="number"
                    placeholder="80"
                    value={formData.numeroConvidados}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tema">Tema</Label>
                <Input
                  id="tema"
                  name="tema"
                  placeholder="Pintando o 7 - formatura"
                  value={formData.tema}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeAniversariante">Nome do Aniversariante</Label>
                  <Input
                    id="nomeAniversariante"
                    name="nomeAniversariante"
                    placeholder="Nome completo"
                    value={formData.nomeAniversariante}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="idadeAniversariante">Idade do Aniversariante</Label>
                  <Input
                    id="idadeAniversariante"
                    name="idadeAniversariante"
                    type="number"
                    placeholder="7"
                    value={formData.idadeAniversariante}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="degustacao">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Degustação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brinde">Brinde</Label>
                <Select
                  value={formData.brinde}
                  onValueChange={(value) => handleSelectChange("brinde", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha o brinde..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Açaí">Açaí</SelectItem>
                    <SelectItem value="Sorvete">Sorvete</SelectItem>
                    <SelectItem value="Picolé">Picolé</SelectItem>
                    <SelectItem value="Mousse">Mousse</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="refeicao">Refeição</Label>
                <Textarea
                  id="refeicao"
                  name="refeicao"
                  placeholder="Ex: Penne à bolonhesa"
                  value={formData.refeicao}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="massaType">Tipo de Massa</Label>
                  <Select
                    value={formData.massaType}
                    onValueChange={(value) => handleSelectChange("massaType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha a massa..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Penne">Penne</SelectItem>
                      <SelectItem value="Fusilli">Fusilli</SelectItem>
                      <SelectItem value="Talharim">Talharim</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="molhoType">Tipo de Molho</Label>
                  <Select
                    value={formData.molhoType}
                    onValueChange={(value) => handleSelectChange("molhoType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha o molho..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bolonhesa">Bolonhesa</SelectItem>
                      <SelectItem value="Calabresa">Calabresa</SelectItem>
                      <SelectItem value="Ao Sugo">Ao Sugo</SelectItem>
                      <SelectItem value="Molho Branco">Molho Branco</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bolo">Bolo</Label>
                <Textarea
                  id="bolo"
                  name="bolo"
                  placeholder="Ex: Massa de chocolate com recheio de brigadeiro"
                  value={formData.bolo}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Informações Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valorTotal">Valor Total da Festa (R$) *</Label>
            <Input
              id="valorTotal"
              name="valorTotal"
              type="number"
              step="0.01"
              placeholder="5000.00"
              value={formData.valorTotal}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais sobre a festa"
              value={formData.observacoes}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleSubmit}
          disabled={updateFesta.isPending}
          className="flex-1"
        >
          {updateFesta.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            "Atualizar Festa"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setLocation("/festas")}
          disabled={updateFesta.isPending}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
