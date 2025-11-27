import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ConverterVisitacao() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  
  const { data: visitacao, isLoading } = trpc.visitacoes.getById.useQuery(
    { id: parseInt(id!) },
    { enabled: !!id }
  );

  const createFestaMutation = trpc.festas.create.useMutation();

  const [formData, setFormData] = useState({
    cpf: "",
    endereco: "",
    dataFechamento: new Date().toISOString().split("T")[0],
    dataFesta: "",
    horario: "",
    numeroConvidados: "",
    tema: "",
    nomeAniversariante: "",
    idadeAniversariante: "",
    brinde: "",
    refeicao: "",
    massaType: "",
    molhoType: "",
    bolo: "",
    valorTotal: "",
    observacoes: "",
  });

  useEffect(() => {
    if (visitacao) {
      setFormData({
        cpf: visitacao.cpf || "",
        endereco: visitacao.endereco || "",
        dataFechamento: new Date().toISOString().split("T")[0],
        dataFesta: visitacao.dataPretendida ? new Date(visitacao.dataPretendida).toISOString().split("T")[0] : "",
        horario: visitacao.horario || "",
        numeroConvidados: visitacao.numeroConvidados?.toString() || "",
        tema: visitacao.tema || "",
        nomeAniversariante: visitacao.nomeAniversariante || "",
        idadeAniversariante: visitacao.idadeAniversariante?.toString() || "",
        brinde: visitacao.brinde || "",
        refeicao: visitacao.refeicao || "",
        massaType: visitacao.massaType || "",
        molhoType: visitacao.molhoType || "",
        bolo: visitacao.bolo || "",
        valorTotal: "",
        observacoes: visitacao.observacoes || "",
      });
    }
  }, [visitacao]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cpf) {
      toast.error("CPF é obrigatório para fechar o contrato");
      return;
    }

    if (!formData.dataFesta) {
      toast.error("Data do Evento é obrigatória para fechar o contrato");
      return;
    }

    if (!formData.valorTotal) {
      toast.error("Valor Total é obrigatório");
      return;
    }

    try {
      // Criar cliente se não existir
      let clienteId = visitacao?.clienteId;
      
      if (!clienteId) {
        const createClienteMutation = trpc.clientes.create.useMutation();
        const clienteResult = await createClienteMutation.mutateAsync({
          nome: visitacao!.nome,
          telefone: visitacao!.telefone,
          email: visitacao!.email || undefined,
          cpf: formData.cpf,
          endereco: formData.endereco || undefined,
        });
        clienteId = clienteResult.id;
      }

      if (!clienteId) {
        throw new Error("Erro ao criar cliente");
      }

      // Criar festa
      await createFestaMutation.mutateAsync({
        clienteId,
        dataFechamento: new Date(formData.dataFechamento).getTime(),
        dataFesta: new Date(formData.dataFesta).getTime(),
        horario: formData.horario || undefined,
        numeroConvidados: formData.numeroConvidados ? parseInt(formData.numeroConvidados) : undefined,
        tema: formData.tema || undefined,
        nomeAniversariante: formData.nomeAniversariante || undefined,
        idadeAniversariante: formData.idadeAniversariante ? parseInt(formData.idadeAniversariante) : undefined,
        brinde: formData.brinde || undefined,
        refeicao: formData.refeicao || undefined,
        massaType: formData.massaType || undefined,
        molhoType: formData.molhoType || undefined,
        bolo: formData.bolo || undefined,
        valorTotal: parseFloat(formData.valorTotal),
        observacoes: formData.observacoes || undefined,
      });

      // Atualizar status da visitação
      const updateVisitacaoMutation = trpc.visitacoes.update.useMutation();
      await updateVisitacaoMutation.mutateAsync({
        id: parseInt(id!),
        status: "fechou_contrato",
      });

      toast.success("Contrato fechado e festa cadastrada com sucesso!");
      setLocation("/festas");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fechar contrato");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Carregando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!visitacao) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-white text-xl">Visitação não encontrada</div>
          <Button onClick={() => setLocation("/visitacoes")}>
            Voltar para Visitações
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/visitacoes")}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Fechar Contrato</h1>
            <p className="text-slate-400">Complete as informações para cadastrar a festa</p>
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Informações do Cliente</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Nome</p>
              <p className="text-white">{visitacao.nome}</p>
            </div>
            <div>
              <p className="text-slate-400">Telefone</p>
              <p className="text-white">{visitacao.telefone}</p>
            </div>
            {visitacao.email && (
              <div>
                <p className="text-slate-400">E-mail</p>
                <p className="text-white">{visitacao.email}</p>
              </div>
            )}
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Informações Obrigatórias</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">CPF *</Label>
                <Input
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  placeholder="000.000.000-00"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-slate-300">Data do Evento *</Label>
                <Input
                  type="date"
                  value={formData.dataFesta}
                  onChange={(e) => setFormData({ ...formData, dataFesta: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">Data de Fechamento *</Label>
                <Input
                  type="date"
                  value={formData.dataFechamento}
                  onChange={(e) => setFormData({ ...formData, dataFechamento: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-slate-300">Valor Total *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.valorTotal}
                  onChange={(e) => setFormData({ ...formData, valorTotal: e.target.value })}
                  placeholder="0.00"
                  className="bg-slate-700 border-slate-600 text-white"
                  required
                />
              </div>
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
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Detalhes da Festa</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">Horário</Label>
                <Input
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  placeholder="14h às 18h"
                  className="bg-slate-700 border-slate-600 text-white"
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

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">Tema</Label>
                <Input
                  value={formData.tema}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                  placeholder="Frozen, Super-heróis..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Nome do Aniversariante</Label>
                <Input
                  value={formData.nomeAniversariante}
                  onChange={(e) => setFormData({ ...formData, nomeAniversariante: e.target.value })}
                  placeholder="Nome completo"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
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
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Ficha de Degustação</h3>
            
            <div className="mb-4">
              <Label className="text-slate-300">Brinde</Label>
              <Select value={formData.brinde} onValueChange={(value) => setFormData({ ...formData, brinde: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione o brinde" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="acai">Açaí</SelectItem>
                  <SelectItem value="sorvete">Sorvete</SelectItem>
                  <SelectItem value="picole">Picolé</SelectItem>
                  <SelectItem value="mousse">Mousse</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label className="text-slate-300">Refeição</Label>
              <Textarea
                value={formData.refeicao}
                onChange={(e) => setFormData({ ...formData, refeicao: e.target.value })}
                placeholder="Descrição da refeição"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-slate-300">Tipo de Massa</Label>
                <Select value={formData.massaType} onValueChange={(value) => setFormData({ ...formData, massaType: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="penne">Penne</SelectItem>
                    <SelectItem value="fusilli">Fusilli</SelectItem>
                    <SelectItem value="talharim">Talharim</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
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
                    <SelectItem value="outro">Outro</SelectItem>
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
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <Label className="text-slate-300">Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Notas adicionais..."
              className="bg-slate-700 border-slate-600 text-white"
            />
          </Card>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/visitacoes")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createFestaMutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {createFestaMutation.isPending ? "Cadastrando..." : "Fechar Contrato e Cadastrar Festa"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
