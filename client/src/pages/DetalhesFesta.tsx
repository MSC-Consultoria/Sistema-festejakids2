import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, DollarSign, Download, Edit, Loader2, Users, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Link, useParams } from "wouter";

export default function DetalhesFesta() {
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  const festaId = params.id ? parseInt(params.id) : 0;
  const [gerandoContrato, setGerandoContrato] = useState(false);

  const { data: festa, isLoading } = trpc.festas.byId.useQuery({ id: festaId });
  const { data: pagamentos } = trpc.pagamentos.byFesta.useQuery({ festaId });
  const { data: contratos } = trpc.festas.contratosGerados.useQuery({ festaId });
  const gerarContratoMutation = trpc.festas.gerarContrato.useMutation();

  const handleGerarContrato = async () => {
    if (!festa) return;
    
    setGerandoContrato(true);
    try {
      const resultado = await gerarContratoMutation.mutateAsync({ festaId: festa.id });
      toast.success("Contrato gerado com sucesso!");
      // Abrir o contrato em nova aba
      window.open(resultado.url, "_blank");
    } catch (error) {
      toast.error("Erro ao gerar contrato");
      console.error(error);
    } finally {
      setGerandoContrato(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/festas">
              <Button variant="ghost" className="gap-2 mb-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar para Festas
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Detalhes da Festa</h1>
          </div>
          {festa && (
            <div className="flex gap-2">
              <Button
                onClick={handleGerarContrato}
                disabled={gerandoContrato}
                variant="outline"
                className="gap-2"
              >
                {gerandoContrato ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Gerar Contrato
              </Button>
              <Link href={`/festas/${festa.id}/editar`}>
                <Button className="gap-2">
                  <Edit className="h-4 w-4" />
                  Editar Festa
                </Button>
              </Link>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : festa ? (
          <div className="space-y-6">
            {/* Informações Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Festa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Código do Contrato</p>
                    <p className="text-lg font-semibold">{festa.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="text-lg font-semibold">{festa.nomeCliente || 'Cliente não encontrado'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data da Festa</p>
                      <p className="font-medium">
                        {new Date(festa.dataFesta).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Convidados</p>
                      <p className="font-medium">{festa.numeroConvidados}</p>
                    </div>
                  </div>
                  {festa.tema && (
                    <div>
                      <p className="text-sm text-muted-foreground">Tema</p>
                      <p className="font-medium">{festa.tema}</p>
                    </div>
                  )}
                  {festa.horario && (
                    <div>
                      <p className="text-sm text-muted-foreground">Horário</p>
                      <p className="font-medium">{festa.horario}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        festa.status === "realizada"
                          ? "bg-green-600/10 text-green-600"
                          : festa.status === "cancelada"
                          ? "bg-red-600/10 text-red-600"
                          : "bg-blue-600/10 text-blue-600"
                      }`}
                    >
                      {festa.status}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-600/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="text-2xl font-bold text-blue-600">
                        R$ {(festa.valorTotal / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-600/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Pago</p>
                      <p className="text-2xl font-bold text-green-600">
                        R$ {(festa.valorPago / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-orange-600/10 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo Devedor</p>
                      <p className="text-2xl font-bold text-orange-600">
                        R${" "}
                        {((festa.valorTotal - festa.valorPago) / 100).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">Progresso de Pagamento</p>
                    <div className="mt-2 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 transition-all"
                        style={{
                          width: `${(festa.valorPago / festa.valorTotal) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {((festa.valorPago / festa.valorTotal) * 100).toFixed(1)}% pago
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Histórico de Contratos */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Contratos Gerados</CardTitle>
              </CardHeader>
              <CardContent>
                {contratos && contratos.length > 0 ? (
                  <div className="space-y-3">
                    {contratos.map((contrato) => (
                      <div
                        key={contrato.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">
                              Versão {contrato.versao}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(contrato.createdAt).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(contrato.url, "_blank")}
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Abrir PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum contrato gerado ainda
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Timeline de Pagamentos */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </CardHeader>
              <CardContent>
                {pagamentos && pagamentos.length > 0 ? (
                  <div className="space-y-3">
                    {pagamentos.map((pag, index) => (
                      <div
                        key={pag.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                      >
                        {/* @ts-ignore */}
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600/10">
                            <span className="text-sm font-semibold text-green-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Pagamento {index + 1}
                              {pag.metodoPagamento && ` - ${pag.metodoPagamento}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(pag.dataPagamento).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          R$ {(pag.valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum pagamento registrado ainda
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Observações */}
            {festa.observacoes && (
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{festa.observacoes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">Festa não encontrada</p>
        )}
      </div>
    </DashboardLayout>
  );
}
