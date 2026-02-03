import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { eq } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Refactored logic – production ready
  content: router({
    getSettings: protectedProcedure.query(({ ctx }) =>
      db.getContentSettingsByUser(ctx.user.id)
    ),
    createSetting: protectedProcedure
      .input(z.object({
        topic: z.string().min(1),
        contentStyle: z.string(),
        tone: z.string(),
        language: z.string().default("ar"),
        includeHashtags: z.boolean().default(true),
        includeEmojis: z.boolean().default(true),
        maxPostLength: z.number().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createContentSetting({ ...input, userId: ctx.user.id })
      ),
    updateSetting: protectedProcedure
      .input(z.object({
        id: z.number(),
        topic: z.string().optional(),
        contentStyle: z.string().optional(),
        tone: z.string().optional(),
      }))
      .mutation(({ input }) =>
        db.updateContentSetting(input.id, input)
      ),
  }),

  // Refactored logic – production ready
  accounts: router({
    getConnected: protectedProcedure.query(({ ctx }) =>
      db.getConnectedAccountsByUser(ctx.user.id)
    ),
    getPlatforms: publicProcedure.query(() =>
      db.getSocialPlatforms()
    ),
    connect: protectedProcedure
      .input(z.object({
        platformId: z.number(),
        accountName: z.string(),
        accountId: z.string(),
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        tokenExpiry: z.date().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createConnectedAccount({ ...input, userId: ctx.user.id })
      ),
    disconnect: protectedProcedure
      .input(z.object({ accountId: z.number() }))
      .mutation(({ input }) =>
        db.deleteConnectedAccount(input.accountId)
      ),
  }),

  // Refactored logic – production ready
  schedules: router({
    getAll: protectedProcedure.query(({ ctx }) =>
      db.getSchedulesByUser(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        contentSettingId: z.number(),
        scheduleType: z.enum(["daily", "weekly", "custom", "once"]),
        scheduleDays: z.string().optional(),
        scheduleTime: z.string(),
      }))
      .mutation(({ ctx, input }) =>
        db.createSchedule({ ...input, userId: ctx.user.id })
      ),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        isActive: z.boolean().optional(),
        scheduleTime: z.string().optional(),
      }))
      .mutation(({ input }) =>
        db.updateSchedule(input.id, input)
      ),
  }),

  // Refactored logic – production ready
  generatedContent: router({
    getAll: protectedProcedure.query(({ ctx }) =>
      db.getGeneratedContentByUser(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        contentText: z.string(),
        imageUrl: z.string().optional(),
        contentType: z.enum(["text", "image", "video", "carousel"]).default("text"),
        scheduledFor: z.date().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.createGeneratedContent({ ...input, userId: ctx.user.id, status: "draft" })
      ),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
      }))
      .mutation(({ input }) =>
        db.updateGeneratedContent(input.id, input)
      ),
  }),

  // Refactored logic – production ready
  posts: router({
    getAll: protectedProcedure.query(({ ctx }) =>
      db.getPostsByUser(ctx.user.id)
    ),
  }),

  // Refactored logic – production ready
  campaigns: router({
    getAll: protectedProcedure.query(({ ctx }) =>
      db.getCampaignsByUser(ctx.user.id)
    ),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        topic: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }))
      .mutation(({ ctx, input }) =>
        db.createCampaign({ ...input, userId: ctx.user.id })
      ),
  }),

  // Refactored logic – production ready
  notifications: router({
    getAll: protectedProcedure.query(({ ctx }) =>
      db.getNotificationsByUser(ctx.user.id)
    ),
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) =>
        db.markNotificationAsRead(input.id)
      ),
  }),
});

export type AppRouter = typeof appRouter;
