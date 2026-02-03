import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, socialPlatforms, connectedAccounts, InsertConnectedAccount, contentSettings, InsertContentSetting, schedules, InsertSchedule, generatedContent, InsertGeneratedContent, posts, InsertPost, campaigns, InsertCampaign, notifications, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Refactored logic – production ready
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Refactored logic – production ready
export async function initializeSocialPlatforms() {
  const db = await getDb();
  if (!db) return;

  const platforms = [
    { name: "facebook", displayName: "Facebook" },
    { name: "instagram", displayName: "Instagram" },
    { name: "tiktok", displayName: "TikTok" },
    { name: "google_business", displayName: "Google Business" },
    { name: "blogger", displayName: "Blogger" },
  ];

  for (const platform of platforms) {
    try {
      await db.insert(socialPlatforms).values(platform).onDuplicateKeyUpdate({
        set: { displayName: platform.displayName },
      });
    } catch (error) {
      console.warn(`[Database] Failed to insert platform ${platform.name}:`, error);
    }
  }
}

export async function getSocialPlatforms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(socialPlatforms);
}

// Refactored logic – production ready
export async function createConnectedAccount(account: InsertConnectedAccount) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(connectedAccounts).values(account);
  return result;
}

export async function getConnectedAccountsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(connectedAccounts)
    .where(eq(connectedAccounts.userId, userId));
}

export async function getConnectedAccount(accountId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(connectedAccounts)
    .where(eq(connectedAccounts.id, accountId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateConnectedAccount(accountId: number, updates: Partial<InsertConnectedAccount>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(connectedAccounts).set(updates).where(eq(connectedAccounts.id, accountId));
}

export async function deleteConnectedAccount(accountId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(connectedAccounts).where(eq(connectedAccounts.id, accountId));
}

// Refactored logic – production ready
export async function createContentSetting(setting: InsertContentSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contentSettings).values(setting);
  return result;
}

export async function getContentSettingsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(contentSettings).where(eq(contentSettings.userId, userId));
}

export async function getContentSetting(settingId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(contentSettings)
    .where(eq(contentSettings.id, settingId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateContentSetting(settingId: number, updates: Partial<InsertContentSetting>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(contentSettings).set(updates).where(eq(contentSettings.id, settingId));
}

// Refactored logic – production ready
export async function createSchedule(schedule: InsertSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(schedules).values(schedule);
  return result;
}

export async function getSchedulesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(schedules).where(eq(schedules.userId, userId));
}

export async function getSchedule(scheduleId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(schedules)
    .where(eq(schedules.id, scheduleId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateSchedule(scheduleId: number, updates: Partial<InsertSchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(schedules).set(updates).where(eq(schedules.id, scheduleId));
}

// Refactored logic – production ready
export async function createGeneratedContent(content: InsertGeneratedContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(generatedContent).values(content);
  return result;
}

export async function getGeneratedContentByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(generatedContent).where(eq(generatedContent.userId, userId));
}

export async function getGeneratedContent(contentId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(generatedContent)
    .where(eq(generatedContent.id, contentId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateGeneratedContent(contentId: number, updates: Partial<InsertGeneratedContent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(generatedContent).set(updates).where(eq(generatedContent.id, contentId));
}

// Refactored logic – production ready
export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(posts).values(post);
  return result;
}

export async function getPostsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(posts).where(eq(posts.userId, userId));
}

export async function getPostsByContent(contentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(posts).where(eq(posts.contentId, contentId));
}

export async function updatePost(postId: number, updates: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(posts).set(updates).where(eq(posts.id, postId));
}

// Refactored logic – production ready
export async function createCampaign(campaign: InsertCampaign) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(campaigns).values(campaign);
  return result;
}

export async function getCampaignsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(campaigns).where(eq(campaigns.userId, userId));
}

export async function getCampaign(campaignId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateCampaign(campaignId: number, updates: Partial<InsertCampaign>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(campaigns).set(updates).where(eq(campaigns.id, campaignId));
}

// Refactored logic – production ready
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getNotificationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(notifications).where(eq(notifications.userId, userId));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(notifications).set({ isRead: true }).where(eq(notifications.id, notificationId));
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(notifications).where(eq(notifications.id, notificationId));
}
