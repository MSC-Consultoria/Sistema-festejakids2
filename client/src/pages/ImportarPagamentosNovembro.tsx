import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// Dados dos pagamentos de novembro (copiados do JSON)
const PAGAMENTOS_NOVEMBRO = [
  {"codigo":"PA041125-CHA","data":"2025-11-04","pagador":"Charlene Ignácio da Silva","valor":195,"formaPagamento":"PIX"},
  {"codigo":"PA041125-LUC","data":"2025-11-04","pagador":"Lucas Freitas Martins","valor":3000,"formaPagamento":"PIX"},
  {"codigo":"PA051125-MON","data":"2025-11-05","pagador":"Monique Barros De Vasconcelos","valor":400,"formaPagamento":"PIX"},
  {"codigo":"PA051125-TIA","data":"2025-11-05","pagador":"Tiago Vidinha Alves Pontes","valor":500,"formaPagamento":"PIX"},
  {"codigo":"PA051125-LUC","data":"2025-11-05","pagador":"Lucas Freitas Martins","valor":1790,"formaPagamento":"PIX"},
  {"codigo":"PA061125-MAR","data":"2025-11-06","pagador":"Marcos Vinicius Ferreira Cardoso","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA061125-AND","data":"2025-11-06","pagador":"Anderson Rodrigues Pereira","valor":4690,"formaPagamento":"PIX"},
  {"codigo":"PA081125-CAI","data":"2025-11-08","pagador":"Caio José Ferreira Dos Santos","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA091125-RAQ","data":"2025-11-09","pagador":"Raquel Fernandes Da Silva","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA111125-MAR","data":"2025-11-11","pagador":"Maria Eduarda Silva Dos Santos","valor":500,"formaPagamento":"PIX"},
  {"codigo":"PA111125-ANA","data":"2025-11-11","pagador":"Ana Carolina Monteiro De Oliveira","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA111125-MAR","data":"2025-11-11","pagador":"Marcos Vinicius Ferreira Cardoso","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA131125-LUC","data":"2025-11-13","pagador":"Lucas Freitas Martins","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA131125-MAR","data":"2025-11-13","pagador":"Marcos Vinicius Ferreira Cardoso","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA141125-RAQ","data":"2025-11-14","pagador":"Raquel Fernandes Da Silva","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA141125-ANA","data":"2025-11-14","pagador":"Ana Carolina Monteiro De Oliveira","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA151125-MAR","data":"2025-11-15","pagador":"Maria Eduarda Silva Dos Santos","valor":500,"formaPagamento":"PIX"},
  {"codigo":"PA161125-AND","data":"2025-11-16","pagador":"Anderson Rodrigues Pereira","valor":4690,"formaPagamento":"PIX"},
  {"codigo":"PA181125-RAQ","data":"2025-11-18","pagador":"Raquel Fernandes Da Silva","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA181125-ANA","data":"2025-11-18","pagador":"Ana Carolina Monteiro De Oliveira","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA191125-MAR","data":"2025-11-19","pagador":"Maria Eduarda Silva Dos Santos","valor":500,"formaPagamento":"PIX"},
  {"codigo":"PA201125-LUC","data":"2025-11-20","pagador":"Lucas Freitas Martins","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA201125-MAR","data":"2025-11-20","pagador":"Marcos Vinicius Ferreira Cardoso","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA211125-RAQ","data":"2025-11-21","pagador":"Raquel Fernandes Da Silva","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA211125-ANA","data":"2025-11-21","pagador":"Ana Carolina Monteiro De Oliveira","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA221125-MAR","data":"2025-11-22","pagador":"Maria Eduarda Silva Dos Santos","valor":500,"formaPagamento":"PIX"},
  {"codigo":"PA251125-RAQ","data":"2025-11-25","pagador":"Raquel Fernandes Da Silva","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA251125-ANA","data":"2025-11-25","pagador":"Ana Carolina Monteiro De Oliveira","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA261125-MAR","data":"2025-11-26","pagador":"Maria Eduarda Silva Dos Santos","valor":500,"formaPagamento":"PIX"},
  {"codigo":"PA271125-LUC","data":"2025-11-27","pagador":"Lucas Freitas Martins","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA271125-MAR","data":"2025-11-27","pagador":"Marcos Vinicius Ferreira Cardoso","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA281125-RAQ","data":"2025-11-28","pagador":"Raquel Fernandes Da Silva","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA281125-ANA","data":"2025-11-28","pagador":"Ana Carolina Monteiro De Oliveira","valor":1000,"formaPagamento":"PIX"},
  {"codigo":"PA291125-MAR","data":"2025-11-29","pagador":"Maria Eduarda Silva Dos Santos","valor":500,"formaPagamento":"PIX"}
];

export default function ImportarPagamentosNovembro() {
  const [resultado, setResultado] = useState<any>(null);
  const importar = trpc.pagamentos.importarLote.useMutation();

  const handleImportar = async () => {
    try {
      const res = await importar.mutateAsync({ pagamentos: PAGAMENTOS_NOVEMBRO });
      setResultado(res);
    } catch (error: any) {
      console.error("Erro ao importar:", error);
      setResultado({ error: error.message });
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Importar Pagamentos de Novembro/2025</CardTitle>
            <CardDescription>
              34 pagamentos totalizando R$ 38.128,00
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!resultado && (
              <Button
                onClick={handleImportar}
                disabled={importar.isPending}
                size="lg"
                className="w-full"
              >
                {importar.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  "Importar 34 Pagamentos"
                )}
              </Button>
            )}

            {resultado && !resultado.error && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Importação Concluída!</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{resultado.inserted}</div>
                    <div className="text-sm text-muted-foreground">Inseridos</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{resultado.errors}</div>
                    <div className="text-sm text-muted-foreground">Erros</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{resultado.total}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            )}

            {resultado?.error && (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>{resultado.error}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
