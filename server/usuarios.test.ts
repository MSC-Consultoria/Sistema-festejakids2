import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-test",
    email: "admin@test.com",
    name: "Admin Test",
    loginMethod: "test",
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

function createNonAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "user-test",
    email: "user@test.com",
    name: "User Test",
    loginMethod: "test",
    role: "atendente",
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

describe("usuarios router", () => {
  describe("list", () => {
    it("permite admin listar usuários", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.usuarios.list({ search: "", role: "all" });

      expect(Array.isArray(result)).toBe(true);
    });

    it("bloqueia não-admin de listar usuários", async () => {
      const { ctx } = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.usuarios.list({ search: "", role: "all" })
      ).rejects.toThrow("Acesso negado");
    });

    it("filtra usuários por role", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.usuarios.list({ search: "", role: "admin" });

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result.every((u) => u.role === "admin")).toBe(true);
      }
    });

    it("busca usuários por nome ou email", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.usuarios.list({ search: "gabriel", role: "all" });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("stats", () => {
    it("retorna estatísticas de usuários para admin", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.usuarios.stats();

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("porRole");
      expect(result.porRole).toHaveProperty("admin");
      expect(result.porRole).toHaveProperty("gerente");
      expect(result.porRole).toHaveProperty("atendente");
      expect(result.porRole).toHaveProperty("cliente");
    });

    it("bloqueia não-admin de ver estatísticas", async () => {
      const { ctx } = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.usuarios.stats()).rejects.toThrow("Acesso negado");
    });
  });

  describe("create", () => {
    it("permite admin criar usuário", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const uniqueId = `test-${Date.now()}`;
      const result = await caller.usuarios.create({
        openId: uniqueId,
        name: "Test User",
        email: `${uniqueId}@test.com`,
        role: "cliente",
      });

      expect(result.success).toBe(true);
    });

    it("bloqueia não-admin de criar usuário", async () => {
      const { ctx } = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.usuarios.create({
          openId: "test-blocked",
          name: "Blocked User",
          email: "blocked@test.com",
          role: "cliente",
        })
      ).rejects.toThrow("Acesso negado");
    });
  });

  describe("update", () => {
    it("permite admin atualizar usuário", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Assumindo que existe um usuário com ID 3 (Moises, Gabriel ou Adriano)
      const result = await caller.usuarios.update({
        id: 3,
        name: "Nome Atualizado",
      });

      expect(result.success).toBe(true);
    });

    it("bloqueia não-admin de atualizar usuário", async () => {
      const { ctx } = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.usuarios.update({
          id: 3,
          name: "Nome Bloqueado",
        })
      ).rejects.toThrow("Acesso negado");
    });
  });

  describe("delete", () => {
    it("bloqueia admin de deletar próprio usuário", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.usuarios.delete({ id: 1 }) // ID do próprio admin
      ).rejects.toThrow("Você não pode deletar seu próprio usuário");
    });

    it("bloqueia não-admin de deletar usuário", async () => {
      const { ctx } = createNonAdminContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.usuarios.delete({ id: 3 })
      ).rejects.toThrow("Acesso negado");
    });
  });
});
