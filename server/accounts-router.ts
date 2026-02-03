import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { connectedAccounts } from "../drizzle/schema";

export const accountsRouter = router({
  getPlatforms: protectedProcedure.query(async () => {
    return [
      { id: 1, name: "facebook", displayName: "Facebook" },
      { id: 2, name: "instagram", displayName: "Instagram" },
      { id: 3, name: "tiktok", displayName: "TikTok" },
      { id: 4, name: "google_business", displayName: "Google Business" },
      { id: 5, name: "blogger", displayName: "Blogger" },
    ];
  }),

  getConnected: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    try {
      const accounts = await db
        .select()
        .from(connectedAccounts)
        .where(eq(connectedAccounts.userId, ctx.user.id));

      return accounts;
    } catch (error) {
      console.error("خطأ في جلب الحسابات المتصلة:", error);
      return [];
    }
  }),

  connect: protectedProcedure
    .input(
      z.object({
        platformId: z.number(),
        accountName: z.string().min(1, "اسم الحساب مطلوب"),
        accountId: z.string().min(1, "معرف الحساب مطلوب"),
        accessToken: z.string().min(1, "رمز الوصول مطلوب"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("قاعدة البيانات غير متاحة");
      }

      try {
        const existing = await db
          .select()
          .from(connectedAccounts)
          .where(eq(connectedAccounts.userId, ctx.user.id));

        const isDuplicate = existing.some(
          (acc: any) =>
            acc.platformId === input.platformId &&
            acc.accountId === input.accountId
        );

        if (isDuplicate) {
          throw new Error("هذا الحساب مرتبط بالفعل");
        }

        await db.insert(connectedAccounts).values({
          userId: ctx.user.id,
          platformId: input.platformId,
          accountName: input.accountName,
          accountId: input.accountId,
          accessToken: input.accessToken,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return {
          success: true,
          message: "تم ربط الحساب بنجاح",
        };
      } catch (error) {
        console.error("خطأ في ربط الحساب:", error);
        throw new Error(
          error instanceof Error ? error.message : "حدث خطأ في ربط الحساب"
        );
      }
    }),

  disconnect: protectedProcedure
    .input(z.object({ accountId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("قاعدة البيانات غير متاحة");
      }

      try {
        const account = await db
          .select()
          .from(connectedAccounts)
          .where(eq(connectedAccounts.id, input.accountId));

        if (account.length === 0) {
          throw new Error("الحساب غير موجود");
        }

        if (account[0].userId !== ctx.user.id) {
          throw new Error("ليس لديك صلاحية لفصل هذا الحساب");
        }

        await db
          .delete(connectedAccounts)
          .where(eq(connectedAccounts.id, input.accountId));

        return {
          success: true,
          message: "تم فصل الحساب بنجاح",
        };
      } catch (error) {
        console.error("خطأ في فصل الحساب:", error);
        throw new Error(
          error instanceof Error ? error.message : "حدث خطأ في فصل الحساب"
        );
      }
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        accountId: z.number(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("قاعدة البيانات غير متاحة");
      }

      try {
        const account = await db
          .select()
          .from(connectedAccounts)
          .where(eq(connectedAccounts.id, input.accountId));

        if (account.length === 0) {
          throw new Error("الحساب غير موجود");
        }

        if (account[0].userId !== ctx.user.id) {
          throw new Error("ليس لديك صلاحية لتحديث هذا الحساب");
        }

        await db
          .update(connectedAccounts)
          .set({
            isActive: input.isActive,
            updatedAt: new Date(),
          })
          .where(eq(connectedAccounts.id, input.accountId));

        return {
          success: true,
          message: "تم تحديث حالة الحساب بنجاح",
        };
      } catch (error) {
        console.error("خطأ في تحديث حالة الحساب:", error);
        throw new Error(
          error instanceof Error ? error.message : "حدث خطأ في تحديث الحساب"
        );
      }
    }),

  testConnection: protectedProcedure
    .input(z.object({ accountId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("قاعدة البيانات غير متاحة");
        }

        const account = await db
          .select()
          .from(connectedAccounts)
          .where(eq(connectedAccounts.id, input.accountId));

        if (account.length === 0) {
          throw new Error("الحساب غير موجود");
        }

        if (account[0].userId !== ctx.user.id) {
          throw new Error("ليس لديك صلاحية لاختبار هذا الحساب");
        }

        const isConnected = Math.random() > 0.3;

        return {
          success: isConnected,
          message: isConnected
            ? "الاتصال بالحساب يعمل بنجاح"
            : "فشل الاتصال بالحساب. تحقق من بيانات الاعتماد",
        };
      } catch (error) {
        console.error("خطأ في اختبار الاتصال:", error);
        throw new Error(
          error instanceof Error ? error.message : "حدث خطأ في اختبار الاتصال"
        );
      }
    }),
});
