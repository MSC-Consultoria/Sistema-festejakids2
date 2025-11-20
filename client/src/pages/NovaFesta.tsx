import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
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
    observacoes: "",
  });
  
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    endereco: "",
  });
  
  const [mostrarNovoCliente, setMostrarNovoCliente] = useState(false);

  const { data: clientes, isLoading: loadingClientes } = trpc.clientes.list.useQuery();
  
  const createCliente = trpc.clientes.create.useMutation({
    onSuccess: (data) => {
      toast.success("Cliente cadastrado com sucesso!");
      setFormData(prev => ({ ...prev, clienteId: data.id.toString() }));
      setMostrarNovoCliente(false);
      setNovoCliente({ nome: "", telefone: "", cpf: "", endereco: "" });
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar cliente: ${error.message}`);
    },
  });
  
  const createFesta = trpc.festas.create.useMutation({
    onSuccess: () => {
      toast.success("Festa cadastrada com sucesso!");
      setLocation("/festas");
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar festa: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.clienteId || !formData.dataFechamento || !formData.dataFesta || 
        !formData.valorTotal || !formData.numeroConvidados) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    // Converter valor para centavos
    const valorEmCentavos = Math.round(parseFloat(formData.valorTotal.replace(/[^\d,]/g, "").replace(",", ".")) * 100);
    
    createFesta.mutate({
      clienteId: parseInt(formData.clienteId),
      dataFechamento: new Date(formData.dataFechamento + "T00:00:00").getTime(),
      dataFesta: new Date(formData.dataFesta + "T00:00:00").getTime(),
      valorTotal: valorEmCentavos,
      numeroConvidados: parseInt(formData.numeroConvidados),
      tema: formData.tema || undefined,
      horario: formData.horario || undefined,
      observacoes: formData.observacoes || undefined,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Nova Festa</h1>
          <p className="text-muted-foreground">Cadastre uma nova festa no sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Festa</CardTitle>
            <CardDescription>Preencha os dados da festa a ser cadastrada</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cliente */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="clienteId">Cliente *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarNovoCliente(!mostrarNovoCliente)}
                  >
                    {mostrarNovoCliente ? "Selecionar Existente" : "+ Novo Cliente"}
                  </Button>
                </div>
                
                {mostrarNovoCliente ? (
                  <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="nomeCliente">Nome *</Label>
                      <Input
                        id="nomeCliente"
                        value={novoCliente.nome}
                        onChange={(e) => setNovoCliente(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Nome completo do cliente"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefoneCliente">Telefone *</Label>
                        <Input
                          id="telefoneCliente"
                          value={novoCliente.telefone}
                          onChange={(e) => setNovoCliente(prev => ({ ...prev, telefone: e.target.value }))}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpfCliente">CPF</Label>
                        <Input
                          id="cpfCliente"
                          value={novoCliente.cpf}
                          onChange={(e) => setNovoCliente(prev => ({ ...prev, cpf: e.target.value }))}
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enderecoCliente">Endereço</Label>
                      <Input
                        id="enderecoCliente"
                        value={novoCliente.endereco}
                        onChange={(e) => setNovoCliente(prev => ({ ...prev, endereco: e.target.value }))}
                        placeholder="Endereço completo"
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!novoCliente.nome || !novoCliente.telefone) {
                          toast.error("Preencha nome e telefone do cliente");
                          return;
                        }
                        createCliente.mutate(novoCliente);
                      }}
                      disabled={createCliente.isPending}
                    >
                      {createCliente.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cadastrando...
                        </>
                      ) : (
                        "Cadastrar Cliente"
                      )}
                    </Button>
                  </div>
                ) : (
                  loadingClientes ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Carregando clientes...</span>
                    </div>
                  ) : (
                    <Select value={formData.clienteId} onValueChange={(value) => handleChange("clienteId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes?.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.nome} {cliente.telefone ? `- ${cliente.telefone}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                )}
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataFechamento">Data de Fechamento *</Label>
                  <Input
                    id="dataFechamento"
                    type="date"
                    value={formData.dataFechamento}
                    onChange={(e) => handleChange("dataFechamento", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataFesta">Data da Festa *</Label>
                  <Input
                    id="dataFesta"
                    type="date"
                    value={formData.dataFesta}
                    onChange={(e) => handleChange("dataFesta", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Valor e Convidados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorTotal">Valor Total (R$) *</Label>
                  <Input
                    id="valorTotal"
                    type="text"
                    placeholder="5.290,00"
                    value={formData.valorTotal}
                    onChange={(e) => handleChange("valorTotal", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroConvidados">Número de Convidados *</Label>
                  <Input
                    id="numeroConvidados"
                    type="number"
                    placeholder="100"
                    value={formData.numeroConvidados}
                    onChange={(e) => handleChange("numeroConvidados", e.target.value)}
                    required
                    min="1"
                  />
                </div>
              </div>

              {/* Tema e Horário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tema">Tema</Label>
                  <Input
                    id="tema"
                    type="text"
                    placeholder="Ex: Frozen, Super-Heróis..."
                    value={formData.tema}
                    onChange={(e) => handleChange("tema", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário</Label>
                  <Input
                    id="horario"
                    type="text"
                    placeholder="Ex: 14h às 18h"
                    value={formData.horario}
                    onChange={(e) => handleChange("horario", e.target.value)}
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre a festa..."
                  value={formData.observacoes}
                  onChange={(e) => handleChange("observacoes", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <Button type="submit" disabled={createFesta.isPending}>
                  {createFesta.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cadastrar Festa
                </Button>
                <Button type="button" variant="outline" onClick={() => setLocation("/festas")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
