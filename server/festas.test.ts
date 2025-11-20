import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
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

  return ctx;
}

describe("festas router", () => {
  let testClienteId: number;
  let testFestaId: number;

  beforeAll(async () => {
    // Criar um cliente de teste
    try {
      testClienteId = await db.createCliente({
        nome: "Cliente Teste Vitest",
        telefone: "11999999999",
        email: "teste@teste.com",
      });
      console.log("Cliente de teste criado com ID:", testClienteId);
    } catch (e) {
      console.error("Erro ao criar cliente de teste:", e);
      throw e;
    }
  });

  it("deve listar todas as festas", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("deve criar uma nova festa", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const dataFesta = new Date("2025-12-31").getTime();
    const dataFechamento = new Date("2025-01-01").getTime();

    expect(testClienteId).toBeDefined();
    expect(typeof testClienteId).toBe("number");

    const result = await caller.festas.create({
      codigo: "TESTVIT25",
      clienteId: testClienteId,
      dataFechamento,
      dataFesta,
      valorTotal: 500000, // R$ 5.000,00 em centavos
      numeroConvidados: 100,
      tema: "Festa Teste",
      horario: "15:00",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    testFestaId = result.id;
  });

  it("deve buscar festa por ID", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(testFestaId).toBeDefined();
    const result = await caller.festas.byId({ id: testFestaId });

    expect(result).toBeDefined();
    expect(result?.codigo).toBe("TESTVIT25");
    expect(result?.valorTotal).toBe(500000);
    expect(result?.numeroConvidados).toBe(100);
  });

  it("deve buscar festa por código", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    expect(testFestaId).toBeDefined();
    const result = await caller.festas.byCodigo({ codigo: "TESTVIT25" });

    expect(result).toBeDefined();
    expect(result?.id).toBe(testFestaId);
  });

  it("deve gerar código de contrato corretamente", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const dataFechamento = new Date("2025-03-15T12:00:00").getTime();
    const result = await caller.festas.generateCodigo({
      dataFechamento,
      nomeCliente: "Ana Silva",
    });

    // Verifica o formato do código: DDMMYYXX
    expect(result).toMatch(/^\d{6}[A-Z]{2}$/);
    expect(result.endsWith("AN")).toBe(true);
  });

  it("deve retornar estatísticas das festas", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.stats();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("agendadas");
    expect(result).toHaveProperty("realizadas");
    expect(result).toHaveProperty("valorTotal");
    expect(result).toHaveProperty("valorPago");
    expect(result).toHaveProperty("valorAReceber");
    expect(result).toHaveProperty("ticketMedio");
    expect(typeof result.total).toBe("number");
    expect(result.total).toBeGreaterThan(0);
  });

  it("deve atualizar uma festa", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.festas.update({
      id: testFestaId,
      numeroConvidados: 120,
      tema: "Festa Teste Atualizada",
    });

    expect(result.success).toBe(true);

    const festa = await caller.festas.byId({ id: testFestaId });
    expect(festa?.numeroConvidados).toBe(120);
    expect(festa?.tema).toBe("Festa Teste Atualizada");
  });

  it("deve filtrar festas por status", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const agendadas = await caller.festas.byStatus({ status: "agendada" });
    const realizadas = await caller.festas.byStatus({ status: "realizada" });

    expect(Array.isArray(agendadas)).toBe(true);
    expect(Array.isArray(realizadas)).toBe(true);
    expect(realizadas.length).toBeGreaterThan(0);
  });
});
