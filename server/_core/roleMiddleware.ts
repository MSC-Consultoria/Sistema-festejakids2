import { TRPCError, initTRPC } from "@trpc/server";
import type { TrpcContext } from "./context";
import superjson from "superjson";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

type UserRole = "admin" | "gerente" | "atendente" | "cliente";

/**
 * Cria middleware para verificar se o usuário tem uma das roles permitidas
 */
export function createRoleMiddleware(...allowedRoles: UserRole[]) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;

    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Você precisa estar autenticado para acessar este recurso",
      });
    }

    const userRole = ctx.user.role as UserRole;
    
    if (!allowedRoles.includes(userRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Acesso negado. Roles permitidas: ${allowedRoles.join(", ")}. Sua role: ${userRole}`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
}

/**
 * Middleware apenas para Admin
 */
export const requireAdmin = createRoleMiddleware("admin");

/**
 * Middleware para Admin e Gerente
 */
export const requireManager = createRoleMiddleware("admin", "gerente");

/**
 * Middleware para Admin, Gerente e Atendente (Staff)
 */
export const requireStaff = createRoleMiddleware("admin", "gerente", "atendente");

/**
 * Procedures com controle de acesso por role
 */
export const adminProcedure = t.procedure.use(requireAdmin);
export const managerProcedure = t.procedure.use(requireManager);
export const staffProcedure = t.procedure.use(requireStaff);
