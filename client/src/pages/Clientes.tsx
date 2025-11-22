import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Phone, Mail, MapPin, User, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: clientes, isLoading } = trpc.clientes.search.useQuery({ searchTerm });

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

        {/* Busca - Mobile Optimized */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Lista de Clientes - Cards Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clientes && clientes.length > 0 ? (
            clientes.map((cliente) => (
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
                        <p className="text-muted-foreground line-clamp-2">{cliente.endereco}</p>
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="mt-4 pt-4 border-t">
                    <Link href={`/clientes/${cliente.id}`} className="block">
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
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Nenhum cliente encontrado com esse termo de busca."
                    : "Nenhum cliente cadastrado. Clique em 'Novo Cliente' para começar."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo - Mobile Optimized */}
        {clientes && clientes.length > 0 && (
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-center text-muted-foreground">
                <span className="font-semibold text-foreground">{clientes.length}</span>{" "}
                {clientes.length === 1 ? "cliente encontrado" : "clientes encontrados"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
