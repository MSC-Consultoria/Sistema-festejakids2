import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { DollarSign, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Custos() {
  const { user, loading: authLoading } = useAuth();
  const [novoCustoVariavel, setNovoCustoVariavel] = useState({ descricao: "", valor: "" });
  const [novoCustoFixo, setNovoCustoFixo] = useState({ descricao: "", valor: "", mesReferencia: "" });

  const { data: custosVariaveis, isLoading: loadingVariaveis } = trpc.custos.variaveis.list.useQuery();
  const { data: custosFixos, isLoading: loadingFixos } = trpc.custos.fixos.list.useQuery();

  const createCustoVariavel = trpc.custos.variaveis.create.useMutation({
    onSuccess: () => {
      toast.success("Custo variável cadastrado!");
      setNovoCustoVariavel({ descricao: "", valor: "" });
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const createCustoFixo = trpc.custos.fixos.create.useMutation({
    onSuccess: () => {
      toast.success("Custo fixo cadastrado!");
      setNovoCustoFixo({ descricao: "", valor: "", mesReferencia: "" });
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteCustoVariavel = trpc.custos.variaveis.delete.useMutation({
    onSuccess: () => {
      toast.success("Custo variável excluído!");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteCustoFixo = trpc.custos.fixos.delete.useMutation({
    onSuccess: () => {
      toast.success("Custo fixo excluído!");
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSubmitVariavel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCustoVariavel.descricao || !novoCustoVariavel.valor) {
      toast.error("Preencha todos os campos");
      return;
    }
    const valorEmCentavos = Math.round(parseFloat(novoCustoVariavel.valor.replace(/[^\d,]/g, "").replace(",", ".")) * 100);
    createCustoVariavel.mutate({
      descricao: novoCustoVariavel.descricao,
      valor: valorEmCentavos,
    });
  };

  const handleSubmitFixo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCustoFixo.descricao || !novoCustoFixo.valor || !novoCustoFixo.mesReferencia) {
      toast.error("Preencha todos os campos");
      return;
    }
    const valorEmCentavos = Math.round(parseFloat(novoCustoFixo.valor.replace(/[^\d,]/g, "").replace(",", ".")) * 100);
    const [ano, mes] = novoCustoFixo.mesReferencia.split("-");
    const mesRef = new Date(parseInt(ano), parseInt(mes) - 1, 1).getTime();
    
    createCustoFixo.mutate({
      descricao: novoCustoFixo.descricao,
      valor: valorEmCentavos,
      mesReferencia: mesRef,
    });
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Gestão de Custos
          </h1>
          <p className="text-muted-foreground">Gerencie os custos variáveis e fixos do negócio</p>
        </div>

        <Tabs defaultValue="variaveis" className="space-y-4">
          <TabsList>
            <TabsTrigger value="variaveis">Custos Variáveis</TabsTrigger>
            <TabsTrigger value="fixos">Custos Fixos</TabsTrigger>
          </TabsList>

          {/* Custos Variáveis */}
          <TabsContent value="variaveis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Novo Custo Variável</CardTitle>
                <CardDescription>Custos que variam de acordo com cada festa</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitVariavel} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="descricaoVariavel">Descrição *</Label>
                      <Input
                        id="descricaoVariavel"
                        value={novoCustoVariavel.descricao}
                        onChange={(e) => setNovoCustoVariavel(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Ex: Decoração, Buffet, Equipe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorVariavel">Valor (R$) *</Label>
                      <Input
                        id="valorVariavel"
                        value={novoCustoVariavel.valor}
                        onChange={(e) => setNovoCustoVariavel(prev => ({ ...prev, valor: e.target.value }))}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={createCustoVariavel.isPending}>
                    {createCustoVariavel.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Custo Variável
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custos Variáveis Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingVariaveis ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : custosVariaveis && custosVariaveis.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {custosVariaveis.map((custo: any) => (
                        <TableRow key={custo.id}>
                          <TableCell>{custo.descricao}</TableCell>
                          <TableCell className="text-right font-semibold">
                            R$ {(custo.valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Deseja realmente excluir este custo?")) {
                                  deleteCustoVariavel.mutate({ id: custo.id });
                                }
                              }}
                              disabled={deleteCustoVariavel.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum custo variável cadastrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custos Fixos */}
          <TabsContent value="fixos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Novo Custo Fixo</CardTitle>
                <CardDescription>Custos mensais fixos do negócio</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFixo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="descricaoFixo">Descrição *</Label>
                      <Input
                        id="descricaoFixo"
                        value={novoCustoFixo.descricao}
                        onChange={(e) => setNovoCustoFixo(prev => ({ ...prev, descricao: e.target.value }))}
                        placeholder="Ex: Aluguel, Salários"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorFixo">Valor (R$) *</Label>
                      <Input
                        id="valorFixo"
                        value={novoCustoFixo.valor}
                        onChange={(e) => setNovoCustoFixo(prev => ({ ...prev, valor: e.target.value }))}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mesReferencia">Mês de Referência *</Label>
                      <Input
                        id="mesReferencia"
                        type="month"
                        value={novoCustoFixo.mesReferencia}
                        onChange={(e) => setNovoCustoFixo(prev => ({ ...prev, mesReferencia: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={createCustoFixo.isPending}>
                    {createCustoFixo.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Custo Fixo
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custos Fixos Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingFixos ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : custosFixos && custosFixos.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Mês de Referência</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {custosFixos.map((custo: any) => (
                        <TableRow key={custo.id}>
                          <TableCell>{custo.descricao}</TableCell>
                          <TableCell>
                            {new Date(custo.mesReferencia).toLocaleDateString("pt-BR", { 
                              month: "long", 
                              year: "numeric" 
                            })}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            R$ {(custo.valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm("Deseja realmente excluir este custo?")) {
                                  deleteCustoFixo.mutate({ id: custo.id });
                                }
                              }}
                              disabled={deleteCustoFixo.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum custo fixo cadastrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
