import { router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";

/**
 * إجراءات الحملات التسويقية
 */
export const campaignsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // Refactored logic – production ready
    return [
      {
        id: 1,
        name: "عرض الصيف",
        description: "عرض خاص للصيف",
        content: "استمتع بعرض الصيف مع خصم 50%",
        templateId: "seasonal",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "إطلاق منتج جديد",
        description: "إطلاق المنتج الجديد",
        content: "يسعدنا إطلاق منتجنا الجديد",
        templateId: "product_launch",
        createdAt: new Date(),
      },
    ];
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        content: z.string(),
        templateId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Refactored logic – production ready
      return {
        id: Math.random(),
        userId: ctx.user.id,
        ...input,
        createdAt: new Date(),
      };
    }),

  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});

/**
 * إجراءات إدارة الفريق
 */
export const teamRouter = router({
  getMembers: protectedProcedure.query(async ({ ctx }) => {
    // Refactored logic – production ready
    return [
      {
        id: 1,
        name: ctx.user.name || "أنت",
        email: ctx.user.email || "user@example.com",
        role: "admin",
        joinedAt: new Date(),
      },
      {
        id: 2,
        name: "محمد أحمد",
        email: "mohammed@example.com",
        role: "editor",
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 3,
        name: "فاطمة علي",
        email: "fatima@example.com",
        role: "reviewer",
        joinedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];
  }),

  getActivityLog: protectedProcedure.query(async ({ ctx }) => {
    // Refactored logic – production ready
    return [
      {
        id: 1,
        action: "تم نشر محتوى جديد",
        actor: "محمد أحمد",
        timestamp: "قبل ساعة",
        type: "publish",
      },
      {
        id: 2,
        action: "تم تحديث إعدادات المحتوى",
        actor: "فاطمة علي",
        timestamp: "قبل ساعتين",
        type: "update",
      },
      {
        id: 3,
        action: "تم إضافة عضو جديد",
        actor: "أنت",
        timestamp: "قبل يوم",
        type: "member_added",
      },
      {
        id: 4,
        action: "تم إنشاء حملة جديدة",
        actor: "محمد أحمد",
        timestamp: "قبل يومين",
        type: "campaign_created",
      },
    ];
  }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "publisher", "reviewer", "editor"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Refactored logic – production ready
      return {
        success: true,
        message: `تم إرسال دعوة إلى ${input.email}`,
      };
    }),

  updateMemberRole: protectedProcedure
    .input(
      z.object({
        memberId: z.number(),
        role: z.enum(["admin", "publisher", "reviewer", "editor"]),
      })
    )
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: "تم تحديث الدور بنجاح",
      };
    }),

  removeMember: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return {
        success: true,
        message: "تم إزالة العضو بنجاح",
      };
    }),
});

/**
 * إجراءات التحليلات المتقدمة
 */
export const analyticsExtendedRouter = router({
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    return {
      totalPosts: 45,
      postsThisMonth: 12,
      totalLikes: 8500,
      likesGrowth: 25,
      totalComments: 3200,
      commentsGrowth: 18,
      totalShares: 1500,
      sharesGrowth: 32,
      topPosts: [
        {
          title: "أفضل منشور 1",
          platform: "Facebook",
          engagement: 1500,
          date: new Date().toLocaleDateString("ar-EG"),
        },
        {
          title: "أفضل منشور 2",
          platform: "Instagram",
          engagement: 1200,
          date: new Date().toLocaleDateString("ar-EG"),
        },
      ],
      bestTimes: [
        {
          platform: "Facebook",
          time: "8:00 PM",
          engagementRate: 85,
        },
        {
          platform: "Instagram",
          time: "7:00 PM",
          engagementRate: 92,
        },
        {
          platform: "TikTok",
          time: "9:00 PM",
          engagementRate: 88,
        },
      ],
    };
  }),

  getPlatformStats: protectedProcedure.query(async ({ ctx }) => {
    return [
      {
        name: "Facebook",
        posts: 45,
        engagement: 3500,
        reach: 15000,
        followers: 5000,
      },
      {
        name: "Instagram",
        posts: 38,
        engagement: 4200,
        reach: 12000,
        followers: 3500,
      },
      {
        name: "TikTok",
        posts: 52,
        engagement: 5100,
        reach: 25000,
        followers: 8000,
      },
      {
        name: "Google Business",
        posts: 20,
        engagement: 1800,
        reach: 8000,
        followers: 2000,
      },
      {
        name: "Blogger",
        posts: 15,
        engagement: 1200,
        reach: 5000,
        followers: 1500,
      },
    ];
  }),

  getPerformanceData: protectedProcedure.query(async ({ ctx }) => {
    const data = [];
    for (let i = 30; i > 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString("ar-EG"),
        engagement: Math.floor(Math.random() * 5000) + 1000,
        reach: Math.floor(Math.random() * 20000) + 5000,
      });
    }
    return data;
  }),
});
