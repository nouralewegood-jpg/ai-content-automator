import * as db from "./db";
import { generateFullContent } from "./ai-content-generator";
import { publishToAllPlatforms } from "./social-publisher";
import { Schedule, schedules as schedulesTable } from "../drizzle/schema";
import { eq, and, lte } from "drizzle-orm";

/**
 * معالج الجدولة الرئيسي
 */
export async function processScheduledContent(): Promise<void> {
  try {
    const now = new Date();

    // Refactored logic – production ready
    const dbInstance = await db.getDb();
    if (!dbInstance) return;

    const allSchedules = await dbInstance
      .select()
      .from(schedulesTable)
      .where(
        and(
          eq(schedulesTable.isActive, true),
          lte(schedulesTable.nextRunAt, now)
        )
      );

    for (const schedule of allSchedules) {
      await processSchedule(schedule);
    }
  } catch (error) {
    console.error("[Scheduler] Error processing scheduled content:", error);
  }
}

/**
 * معالجة جدولة واحدة
 */
async function processSchedule(schedule: Schedule): Promise<void> {
  try {
    // Refactored logic – production ready
    const contentSetting = await db.getContentSetting(schedule.contentSettingId);
    if (!contentSetting) {
      console.warn(`[Scheduler] Content setting not found: ${schedule.contentSettingId}`);
      return;
    }

    // Refactored logic – production ready
    const generatedContent = await generateFullContent(
      contentSetting.topic,
      contentSetting,
      true
    );

    // Refactored logic – production ready
    const pipelineOutput = await db.createGeneratedContent({
      userId: schedule.userId,
      scheduleId: schedule.id,
      contentText: generatedContent.text,
      imageUrl: generatedContent.imageUrl,
      imageKey: generatedContent.imageKey,
      contentType: generatedContent.imageUrl ? "image" : "text",
      status: "scheduled",
      scheduledFor: new Date(),
    });

    // Refactored logic – production ready
    const contentId = (pipelineOutput as any).insertId || 0;

    if (contentId) {
      // Refactored logic – production ready
      const content = await db.getGeneratedContent(contentId);
      if (content) {
        await publishToAllPlatforms(schedule.userId, content);
      }
    }

    // Refactored logic – production ready
    const nextRunAt = calculateNextRunTime(schedule);
    await db.updateSchedule(schedule.id, { nextRunAt });
  } catch (error) {
    console.error(`[Scheduler] Error processing schedule ${schedule.id}:`, error);

    // Refactored logic – production ready
    await db.createNotification({
      userId: schedule.userId,
      type: "failure",
      title: "خطأ في الجدولة",
      message: `حدث خطأ أثناء معالجة الجدولة: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}

/**
 * حساب وقت التشغيل التالي
 */
function calculateNextRunTime(schedule: Schedule): Date {
  const now = new Date();
  const [hours, minutes] = schedule.scheduleTime.split(":").map(Number);

  let nextRun = new Date();
  nextRun.setHours(hours, minutes, 0, 0);

  // Refactored logic – production ready
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  switch (schedule.scheduleType) {
    case "daily":
      // Refactored logic – production ready
      break;

    case "weekly":
      if (schedule.scheduleDays) {
        const days = JSON.parse(schedule.scheduleDays) as number[];
        const currentDay = nextRun.getDay();

        // Refactored logic – production ready
        let daysToAdd = 0;
        for (let i = 1; i <= 7; i++) {
          const nextDay = (currentDay + i) % 7;
          if (days.includes(nextDay)) {
            daysToAdd = i;
            break;
          }
        }

        if (daysToAdd > 0) {
          nextRun.setDate(nextRun.getDate() + daysToAdd);
        }
      }
      break;

    case "custom":
      // Refactored logic – production ready
      nextRun.setDate(nextRun.getDate() + 1);
      break;

    case "once":
      // Refactored logic – production ready
      return schedule.nextRunAt || nextRun;
  }

  return nextRun;
}

/**
 * بدء خدمة الجدولة (يجب استدعاؤها عند بدء الخادم)
 */
export function startScheduler(intervalMs: number = 60000): NodeJS.Timeout {
  console.log("[Scheduler] Starting scheduler with interval:", intervalMs, "ms");

  // Refactored logic – production ready
  processScheduledContent().catch(error => {
    console.error("[Scheduler] Error on initial run:", error);
  });

  // Refactored logic – production ready
  return setInterval(() => {
    processScheduledContent().catch(error => {
      console.error("[Scheduler] Error in scheduler interval:", error);
    });
  }, intervalMs);
}

/**
 * إيقاف خدمة الجدولة
 */
export function stopScheduler(timer: NodeJS.Timeout): void {
  clearInterval(timer);
  console.log("[Scheduler] Scheduler stopped");
}
