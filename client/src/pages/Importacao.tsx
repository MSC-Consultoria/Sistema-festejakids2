import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Users, PartyPopper, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Importacao() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar tipo de arquivo
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        toast.error("Por favor, selecione um arquivo Excel (.xlsx ou .xls)");
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para importar");
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      // TODO: Implementar upload e processamento do arquivo
      // Por enquanto, simular sucesso
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        success: true,
        message: "Importação concluída com sucesso!",
        details: {
          festas: 10,
          clientes: 8,
          erros: 0,
        },
      });
      
      toast.success("Dados importados com sucesso!");
    } catch (error: any) {
      setResult({
        success: false,
        message: "Erro ao importar dados: " + error.message,
      });
      toast.error("Erro ao importar dados");
    } finally {
      setImporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
            Importação de Dados
          </h1>
          <p className="text-muted-foreground mt-1">
            Importe festas e clientes a partir de planilhas Excel
          </p>
        </div>

        {/* Instruções */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Como importar dados
            </CardTitle>
            <CardDescription>
              Siga as instruções abaixo para importar seus dados corretamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Formato da Planilha</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>O arquivo deve estar no formato Excel (.xlsx ou .xls)</li>
                <li>A primeira linha deve conter os cabeçalhos das colunas</li>
                <li>Colunas obrigatórias: Código, Cliente, Data da Festa, Valor Total, Número de Convidados</li>
                <li>Colunas opcionais: Tema, Horário, Observações, Telefone, Email</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Exemplo de Estrutura</h3>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <table className="text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Código</th>
                      <th className="px-4 py-2 text-left">Cliente</th>
                      <th className="px-4 py-2 text-left">Telefone</th>
                      <th className="px-4 py-2 text-left">Data da Festa</th>
                      <th className="px-4 py-2 text-left">Valor Total</th>
                      <th className="px-4 py-2 text-left">Convidados</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">FK001</td>
                      <td className="px-4 py-2">Maria Silva</td>
                      <td className="px-4 py-2">(11) 98765-4321</td>
                      <td className="px-4 py-2">15/01/2026</td>
                      <td className="px-4 py-2">R$ 5.000,00</td>
                      <td className="px-4 py-2">50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Selecionar Arquivo
            </CardTitle>
            <CardDescription>
              Escolha o arquivo Excel com os dados a serem importados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Arquivo Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={importing}
              />
              {file && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <Button
              onClick={handleImport}
              disabled={!file || importing}
              className="w-full gradient-primary"
              size="lg"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {result.success ? "Sucesso!" : "Erro"}
            </AlertTitle>
            <AlertDescription>
              {result.message}
              {result.details && (
                <div className="mt-2 space-y-1">
                  <p className="flex items-center gap-2">
                    <PartyPopper className="h-4 w-4" />
                    {result.details.festas} festas importadas
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {result.details.clientes} clientes importados
                  </p>
                  {result.details.erros > 0 && (
                    <p className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {result.details.erros} erros encontrados
                    </p>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Histórico de Importações (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Importações</CardTitle>
            <CardDescription>
              Últimas importações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              Nenhuma importação realizada ainda
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
