import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Phone, Mail, MapPin, User, Search, X } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";

export default function Clientes() {
  const [searchNome, setSearchNome] = useState("");
  const [searchCpf, setSearchCpf] = useState("");
  const [searchTelefone, setSearchTelefone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome-asc");
  
  const { data: clientes, isLoading } = trpc.clientes.list.useQuery();

  const clientesFiltrados = useMemo(() => {
    if (!clientes) return [];
    
    let resultado = clientes.filter((cliente) => {
      // Filtro de nome
      if (searchNome && !cliente.nome.toLowerCase().includes(searchNome.toLowerCase())) return false;
      
      // Filtro de CPF
      if (searchCpf && !cliente.cpf?.includes(searchCpf)) return false;
      
      // Filtro de telefone
      if (searchTelefone && !cliente.telefone?.includes(searchTelefone)) return false;
      
      // Filtro de email
      if (searchEmail && !cliente.email?.toLowerCase().includes(searchEmail.toLowerCase())) return false;
      
      return true;
    });
    
    // Aplicar ordenação
    resultado.sort((a, b) => {
      switch (ordenacao) {
        case "nome-asc":
          return a.nome.localeCompare(b.nome);
        case "nome-desc":
          return b.nome.localeCompare(a.nome);
        case "data-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "data-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });
    
    return resultado;
  }, [clientes, searchNome, searchCpf, searchTelefone, searchEmail, ordenacao]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-6">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie todos os clientes cadastrados
            </p>
          </div>
          <Link href="/clientes/novo">
            <Button className="w-full sm:w-auto" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        {/* Filtros Avançados */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros Avançados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Linha 1: Nome e CPF */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome"
                    value={searchNome}
                    onChange={(e) => setSearchNome(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por CPF"
                    value={searchCpf}
                    onChange={(e) => setSearchCpf(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Linha 2: Telefone e Email */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por telefone"
                    value={searchTelefone}
                    onChange={(e) => setSearchTelefone(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* Linha 3: Ordenação e Botão Limpar */}
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="data-desc">Mais Recente</SelectItem>
                    <SelectItem value="data-asc">Mais Antigo</SelectItem>
                  </SelectContent>
                </Select>
                
                {(searchNome || searchCpf || searchTelefone || searchEmail) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchNome("");
                      setSearchCpf("");
                      setSearchTelefone("");
                      setSearchEmail("");
                      setOrdenacao("nome-asc");
                    }}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
              
              {/* Contador de resultados */}
              <div className="text-sm text-muted-foreground">
                Mostrando {clientesFiltrados.length} de {clientes?.length || 0} clientes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clientes - Cards Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clientesFiltrados && clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Header do Card */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{cliente.nome}</h3>
                      {cliente.cpf && (
                        <p className="text-xs text-muted-foreground">CPF: {cliente.cpf}</p>
                      )}
                    </div>
                  </div>

                  {/* Informações de Contato */}
                  <div className="space-y-2">
                    {cliente.telefone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`tel:${cliente.telefone}`}
                          className="text-primary hover:underline truncate"
                        >
                          {cliente.telefone}
                        </a>
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <a
                          href={`mailto:${cliente.email}`}
                          className="text-primary hover:underline truncate"
                        >
                          {cliente.email}
                        </a>
                      </div>
                    )}
                    {cliente.endereco && (
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{cliente.endereco}</span>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="mt-4 pt-4 border-t">
                    <Link href={`/clientes/${cliente.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Nenhum cliente encontrado com os filtros selecionados</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
