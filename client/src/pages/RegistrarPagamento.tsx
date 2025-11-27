import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function RegistrarPagamento() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: festas, isLoading: loadingFestas } = trpc.festas.list.useQuery();
  const createPagamento = trpc.pagamentos.create.useMutation();

  const [formData, setFormData] = useState({
    codigo: "",
    valor: "",
    dataPagamento: new Date().toISOString().split("T")[0],
    metodoPagamento: "",
    observacoes: "",
  });

  const festasSelecionaveis = festas?.filter(f => f.valorPago < f.valorTotal) || [];
  const festaSelecionada = festas?.find(f => f.codigo === formData.codigo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo) {
      toast.error("Selecione uma festa");
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast.error("Informe um valor válido");
      return;
    }

    const festa = festas?.find(f => f.codigo === formData.codigo);
    if (!festa) {
      toast.error("Festa não encontrada");
      return;
    }

    const valorEmCentavos = Math.round(parseFloat(formData.valor) * 100);
    const saldoDevedor = festa.valorTotal - festa.valorPago;

    if (valorEmCentavos > saldoDevedor) {
      toast.error(`Valor excede o saldo devedor de R$ ${(saldoDevedor / 100).toFixed(2)}`);
      return;
    }

    // Gerar código PADDMMAA-XXX
    const dataPag = new Date(formData.dataPagamento);
    const dia = String(dataPag.getDate()).padStart(2, '0');
    const mes = String(dataPag.getMonth() + 1).padStart(2, '0');
    const ano = String(dataPag.getFullYear()).slice(-2);
    const nomeCliente = festa.clienteNome || "XXX";
    const iniciais = nomeCliente.split(' ')[0].substring(0, 3).toUpperCase();
    const codigoPagamento = `PA${dia}${mes}${ano}-${iniciais}`;

    try {
      await createPagamento.mutateAsync({
        codigo: codigoPagamento,
        festaId: festa.id,
        valor: valorEmCentavos,
        dataPagamento: new Date(formData.dataPagamento).getTime(),
        metodoPagamento: formData.metodoPagamento || undefined,
        pagador: festa.clienteNome || undefined,
        observacoes: formData.observacoes || undefined,
      });

      toast.success("Pagamento registrado com sucesso!");
      setLocation("/financeiro");
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Erro ao registrar pagamento");
    }
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
      <div className="container max-w-2xl py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Registrar Pagamento
          </h1>
          <p className="text-muted-foreground">Registre um novo pagamento recebido</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Pagamento</CardTitle>
            <CardDescription>
              Preencha as informações do pagamento recebido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código do Contrato *</Label>
                {loadingFestas ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Carregando festas...</span>
                  </div>
                ) : (
                  <Select
                    value={formData.codigo}
                    onValueChange={(value) => setFormData({ ...formData, codigo: value })}
                  >
                    <SelectTrigger id="codigo">
                      <SelectValue placeholder="Selecione uma festa" />
                    </SelectTrigger>
                    <SelectContent>
                      {festasSelecionaveis.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhuma festa com saldo devedor
                        </SelectItem>
                      ) : (
                        festasSelecionaveis.map((festa) => (
                          <SelectItem key={festa.id} value={festa.codigo}>
                            {festa.codigo} - {festa.clienteNome} (Saldo: R${" "}
                            {((festa.valorTotal - festa.valorPago) / 100).toFixed(2)})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                {festaSelecionada && (
                  <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted rounded-md">
                    <p>
                      <strong>Cliente:</strong> {festaSelecionada.clienteNome}
                    </p>
                    <p>
                      <strong>Valor Total:</strong> R${" "}
                      {(festaSelecionada.valorTotal / 100).toFixed(2)}
                    </p>
                    <p>
                      <strong>Já Pago:</strong> R${" "}
                      {(festaSelecionada.valorPago / 100).toFixed(2)}
                    </p>
                    <p className="text-orange-600 font-semibold">
                      <strong>Saldo Devedor:</strong> R${" "}
                      {((festaSelecionada.valorTotal - festaSelecionada.valorPago) / 100).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor Recebido (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
                <Input
                  id="dataPagamento"
                  type="date"
                  value={formData.dataPagamento}
                  onChange={(e) => setFormData({ ...formData, dataPagamento: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPagamento">Forma de Pagamento</Label>
                <Select
                  value={formData.metodoPagamento}
                  onValueChange={(value) => setFormData({ ...formData, metodoPagamento: value })}
                >
                  <SelectTrigger id="metodoPagamento">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                    <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Informações adicionais sobre o pagamento..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={createPagamento.isPending}
                  className="flex-1"
                >
                  {createPagamento.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar Pagamento"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/financeiro")}
                >
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
