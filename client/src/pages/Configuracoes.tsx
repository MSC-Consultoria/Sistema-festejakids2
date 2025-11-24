import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, Database, Loader2, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Configuracoes() {
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [resetting, setResetting] = useState(false);

  const resetMutation = trpc.system.resetDatabase.useMutation();

  const handleResetDatabase = async () => {
    if (confirmText !== "RESETAR BANCO") {
      toast.error("Digite 'RESETAR BANCO' para confirmar");
      return;
    }

    setResetting(true);

    try {
      const result = await resetMutation.mutateAsync({
        confirmacao: "RESETAR BANCO",
      });

      if (result.success) {
        toast.success(result.message);
        setShowResetDialog(false);
        setConfirmText("");
        
        // Recarregar página após 2 segundos
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error: any) {
      toast.error("Erro ao resetar banco: " + error.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie configurações do sistema
          </p>
        </div>

        {/* Aviso de Desenvolvimento */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ambiente de Desenvolvimento</AlertTitle>
          <AlertDescription>
            Estas configurações são apenas para fase de implementação e testes.
            Em produção, estas opções devem ser removidas ou restritas.
          </AlertDescription>
        </Alert>

        {/* Reset do Banco de Dados */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Database className="h-5 w-5" />
              Resetar Banco de Dados
            </CardTitle>
            <CardDescription>
              Deleta TODOS os dados e recria 3 usuários padrão (Moises, Gabriel, Adriano)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                Esta ação é <strong>irreversível</strong> e irá:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Deletar todas as festas</li>
                  <li>Deletar todos os clientes</li>
                  <li>Deletar todos os pagamentos</li>
                  <li>Deletar todos os custos</li>
                  <li>Deletar todas as visitações</li>
                  <li>Deletar todos os usuários</li>
                  <li>Recriar 3 usuários padrão com senha "123"</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button
              variant="destructive"
              onClick={() => setShowResetDialog(true)}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Resetar Banco de Dados
            </Button>
          </CardContent>
        </Card>

        {/* Dialog de Confirmação */}
        <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirmar Reset do Banco de Dados
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>
                  Esta ação é <strong>irreversível</strong> e irá deletar TODOS os dados do sistema.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm">
                    Digite <strong>RESETAR BANCO</strong> para confirmar:
                  </Label>
                  <Input
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="RESETAR BANCO"
                    disabled={resetting}
                  />
                </div>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Após o reset, você será desconectado e precisará fazer login novamente
                    com um dos usuários padrão (senha: 123).
                  </AlertDescription>
                </Alert>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={resetting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetDatabase}
                disabled={confirmText !== "RESETAR BANCO" || resetting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {resetting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirmar Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
