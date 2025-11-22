import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("visitacoes router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;
  let visitacaoId: number;

  beforeEach(() => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  it("deve criar uma nova visitação", async () => {
    const result = await caller.visitacoes.create({
      nome: "João Silva",
      telefone: "(11) 98765-4321",
      email: "joao@example.com",
      dataVisita: Date.now(),
      interesse: "Festa de aniversário tema super-heróis",
      observacoes: "Cliente interessado em festa para 50 crianças",
    });

    expect(result).toBeDefined();
    expect(result.id).toBeTypeOf("number");
    visitacaoId = result.id;
  });

  it("deve listar todas as visitações", async () => {
    const result = await caller.visitacoes.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve buscar visitação por ID", async () => {
    // Criar visitação primeiro
    const created = await caller.visitacoes.create({
      nome: "Maria Santos",
      telefone: "(11) 91234-5678",
      dataVisita: Date.now(),
    });

    const result = await caller.visitacoes.getById({ id: created.id });
    expect(result).toBeDefined();
    expect(result?.nome).toBe("Maria Santos");
    expect(result?.status).toBe("visitou");
  });

  it("deve atualizar status da visitação", async () => {
    // Criar visitação primeiro
    const created = await caller.visitacoes.create({
      nome: "Pedro Oliveira",
      telefone: "(11) 99999-8888",
      dataVisita: Date.now(),
    });

    const result = await caller.visitacoes.update({
      id: created.id,
      status: "aguardando",
    });

    expect(result.success).toBe(true);

    const updated = await caller.visitacoes.getById({ id: created.id });
    expect(updated?.status).toBe("aguardando");
  });

  it("deve obter estatísticas de visitações", async () => {
    const stats = await caller.visitacoes.stats();
    
    expect(stats).toBeDefined();
    expect(stats.total).toBeTypeOf("number");
    expect(stats.visitou).toBeTypeOf("number");
    expect(stats.aguardando).toBeTypeOf("number");
    expect(stats.propostaEnviada).toBeTypeOf("number");
    expect(stats.fechado).toBeTypeOf("number");
    expect(stats.perdido).toBeTypeOf("number");
    expect(stats.taxaConversao).toBeTypeOf("number");
    expect(stats.taxaConversao).toBeGreaterThanOrEqual(0);
    expect(stats.taxaConversao).toBeLessThanOrEqual(100);
  });

  it("deve converter visitação em cliente", async () => {
    // Criar visitação primeiro
    const created = await caller.visitacoes.create({
      nome: "Ana Costa",
      telefone: "(11) 97777-6666",
      email: "ana@example.com",
      dataVisita: Date.now(),
      interesse: "Festa infantil",
    });

    const result = await caller.visitacoes.converterEmCliente({
      visitacaoId: created.id,
      cpf: "123.456.789-00",
      endereco: "Rua Teste, 123",
    });

    expect(result.success).toBe(true);
    expect(result.clienteId).toBeTypeOf("number");

    // Verificar se visitação foi atualizada
    const visitacao = await caller.visitacoes.getById({ id: created.id });
    expect(visitacao?.status).toBe("fechado");
    expect(visitacao?.clienteId).toBe(result.clienteId);

    // Verificar se cliente foi criado
    const cliente = await db.getClienteById(result.clienteId);
    expect(cliente).toBeDefined();
    expect(cliente?.nome).toBe("Ana Costa");
    expect(cliente?.telefone).toBe("(11) 97777-6666");
    expect(cliente?.cpf).toBe("123.456.789-00");
  });

  it("deve excluir uma visitação", async () => {
    // Criar visitação primeiro
    const created = await caller.visitacoes.create({
      nome: "Carlos Mendes",
      telefone: "(11) 96666-5555",
      dataVisita: Date.now(),
    });

    const result = await caller.visitacoes.delete({ id: created.id });
    expect(result.success).toBe(true);

    const deleted = await caller.visitacoes.getById({ id: created.id });
    expect(deleted).toBeUndefined();
  });

  it("deve validar campos obrigatórios ao criar visitação", async () => {
    await expect(
      caller.visitacoes.create({
        nome: "",
        telefone: "(11) 98765-4321",
        dataVisita: Date.now(),
      })
    ).rejects.toThrow();

    await expect(
      caller.visitacoes.create({
        nome: "Teste",
        telefone: "",
        dataVisita: Date.now(),
      })
    ).rejects.toThrow();
  });
});
