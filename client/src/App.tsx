import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Festas from "./pages/Festas";
import NovaFesta from "./pages/NovaFesta";
import EditarFesta from "./pages/EditarFesta";
import Clientes from "./pages/Clientes";
import Calendario from "./pages/Calendario";
import Custos from "./pages/Custos";
import Agenda from "./pages/Agenda";
import Financeiro from "./pages/Financeiro";
import RegistrarPagamento from "./pages/RegistrarPagamento";
import Relatorios from "./pages/Relatorios";
import AcompanhamentoPagamentos from "./pages/AcompanhamentoPagamentos";
import ProjecaoFinanceira from "./pages/ProjecaoFinanceira";
import Visitacoes from "./pages/Visitacoes";
import DetalhesFesta from "./pages/DetalhesFesta";
import Importacao from "./pages/Importacao";
import Configuracoes from "./pages/Configuracoes";
import Usuarios from "./pages/Usuarios";
import DetalhesCliente from "./pages/DetalhesCliente";
import ConverterVisitacao from "./pages/ConverterVisitacao";
import ImportarPagamentosNovembro from "./pages/ImportarPagamentosNovembro";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path="/festas" component={Festas} />
      <Route path="/festas/nova" component={NovaFesta} />
      <Route path="/festas/editar/:id" component={EditarFesta} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/clientes/:id" component={DetalhesCliente} />
      <Route path="/calendario" component={Calendario} />
      <Route path="/custos" component={Custos} />
      <Route path="/agenda" component={Agenda} />
      <Route path="/financeiro" component={Financeiro} />
      <Route path="/financeiro/registrar" component={RegistrarPagamento} />
      <Route path="/relatorios" component={Relatorios} />
      <Route path="/acompanhamento" component={AcompanhamentoPagamentos} />
      <Route path="/projecao-financeira" component={ProjecaoFinanceira} />
      <Route path="/visitacoes" component={Visitacoes} />
      <Route path="/visitacoes/converter/:id" component={ConverterVisitacao} />
      <Route path="/festas/:id" component={DetalhesFesta} />
      <Route path="/importacao" component={Importacao} />
      <Route path="/configuracoes" component={Configuracoes} />
      <Route path="/usuarios" component={Usuarios} />
      <Route path="/importar-pagamentos-novembro" component={ImportarPagamentosNovembro} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
