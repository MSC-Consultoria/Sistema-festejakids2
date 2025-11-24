import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/const";

interface ImportResult {
  success: boolean;
  message: string;
  totalLinhas: number;
  parseErros: Array<{ linha: number; erro: string }>;
  importadas: number;
  importErros: Array<{ codigo: string; erro: string }>;
}

export default function Importacao() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [preview, setPreview] = useState<any>(null);

  const importMutation = trpc.importacao.importar.useMutation();
  const previewMutation = trpc.importacao.preview.useMutation();

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
      setPreview(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handlePreview = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para visualizar");
      return;
    }

    setPreviewing(true);
    setPreview(null);

    try {
      const fileBase64 = await fileToBase64(file);
      const result = await previewMutation.mutateAsync({ fileBase64 });
      
      setPreview(result);
      
      if (result.success) {
        toast.success(`${result.importadas} festas encontradas no arquivo`);
      } else {
        toast.error("Nenhuma festa válida encontrada");
      }
    } catch (error: any) {
      toast.error("Erro ao processar arquivo: " + error.message);
    } finally {
      setPreviewing(false);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para importar");
      return;
    }

    if (!confirm("Confirma a importação dos dados? Esta ação não pode ser desfeita.")) {
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const fileBase64 = await fileToBase64(file);
      const result = await importMutation.mutateAsync({ fileBase64 });
      
      setResult(result);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error("Erro ao importar dados: " + error.message);
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
              Formato da Planilha
            </CardTitle>
            <CardDescription>
              A planilha deve conter as seguintes colunas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Colunas Obrigatórias:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Código do contrato</li>
                  <li>Nome do cliente</li>
                  <li>Data de Fechamento</li>
                  <li>Data da Festa</li>
                  <li>Valor (em reais)</li>
                  <li>Valor Pago (em reais)</li>
                  <li>N° de convidados</li>
                  <li>Custos (em reais)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Colunas Opcionais:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Horario</li>
                  <li>Tema</li>
                  <li>Contato 1 (telefone)</li>
                </ul>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                As datas devem estar no formato Excel (numérico). O sistema converterá automaticamente.
                Clientes serão criados automaticamente se não existirem.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Selecionar Arquivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Arquivo Excel (.xlsx ou .xls)</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={importing || previewing}
              />
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handlePreview}
                disabled={!file || importing || previewing}
                variant="outline"
              >
                {previewing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Visualizar Dados
              </Button>
              
              <Button
                onClick={handleImport}
                disabled={!file || importing || previewing}
                className="gradient-primary"
              >
                {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Importar Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {preview && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Pré-visualização
              </CardTitle>
              <CardDescription>
                {preview.importadas} festas válidas encontradas de {preview.totalLinhas} linhas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preview.erros && preview.erros.length > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Erros Encontrados ({preview.erros.length})</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm mt-2 max-h-40 overflow-y-auto">
                      {preview.erros.slice(0, 10).map((erro: any, idx: number) => (
                        <li key={idx}>
                          Linha {erro.linha}: {erro.erro}
                        </li>
                      ))}
                      {preview.erros.length > 10 && (
                        <li className="text-muted-foreground">
                          ... e mais {preview.erros.length - 10} erros
                        </li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {preview.festas && preview.festas.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Primeiras 5 festas:</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {preview.festas.slice(0, 5).map((festa: any, idx: number) => (
                      <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><strong>Código:</strong> {festa.codigo}</div>
                          <div><strong>Cliente:</strong> {festa.nomeCliente}</div>
                          <div><strong>Data Festa:</strong> {new Date(festa.dataFesta).toLocaleDateString()}</div>
                          <div><strong>Valor:</strong> {formatCurrency(festa.valorTotal)}</div>
                          <div><strong>Convidados:</strong> {festa.numeroConvidados}</div>
                          <div><strong>Tema:</strong> {festa.tema || "Não informado"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Resultado */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Resultado da Importação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertTitle>{result.message}</AlertTitle>
                <AlertDescription>
                  <div className="mt-2 space-y-1">
                    <p>Total de linhas processadas: {result.totalLinhas}</p>
                    <p>Festas importadas: {result.importadas}</p>
                    <p>Erros de parsing: {result.parseErros?.length || 0}</p>
                    <p>Erros de importação: {result.importErros?.length || 0}</p>
                  </div>
                </AlertDescription>
              </Alert>

              {result.parseErros && result.parseErros.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Erros de Parsing:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 max-h-40 overflow-y-auto">
                    {result.parseErros.map((erro, idx) => (
                      <li key={idx}>
                        Linha {erro.linha}: {erro.erro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.importErros && result.importErros.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Erros de Importação:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 max-h-40 overflow-y-auto">
                    {result.importErros.map((erro, idx) => (
                      <li key={idx}>
                        {erro.codigo}: {erro.erro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
