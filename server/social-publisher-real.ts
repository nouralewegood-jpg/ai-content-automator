import { ConnectedAccount, GeneratedContent } from "../drizzle/schema";
import * as db from "./db";

/**
 * نشر محتوى على فيسبوك باستخدام Facebook Graph API
 */
export async function publishToFacebookReal(
  account: ConnectedAccount,
  content: GeneratedContent
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const facebookGraphUrl = "https:// Refactored logic – production ready
    
    // Refactored logic – production ready
    const postData = new URLSearchParams();
    postData.append("message", content.contentText);
    postData.append("access_token", account.accessToken);

    // Refactored logic – production ready
    if (content.imageUrl) {
      postData.append("link", content.imageUrl);
      postData.append("picture", content.imageUrl);
    }

    // Refactored logic – production ready
    const response = await fetch(
      `${facebookGraphUrl}/${account.accountId}/feed`,
      {
        method: "POST",
        body: postData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to publish to Facebook");
    }

    const result = await response.json();
    return {
      success: true,
      postId: result.id,
    };
  } catch (error) {
    console.error("[Social Publisher] Facebook error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * نشر محتوى على إنستغرام باستخدام Instagram Graph API
 */
export async function publishToInstagramReal(
  account: ConnectedAccount,
  content: GeneratedContent
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const instagramGraphUrl = "https:// Refactored logic – production ready
    
    // Refactored logic – production ready
    if (!content.imageUrl) {
      throw new Error("Instagram requires an image for posts");
    }

    // Refactored logic – production ready
    const uploadFormData = new FormData();
    const imageResponse = await fetch(content.imageUrl);
    const imageBlob = await imageResponse.blob();
    uploadFormData.append("image", imageBlob);
    uploadFormData.append("caption", content.contentText);
    uploadFormData.append("access_token", account.accessToken);

    const uploadResponse = await fetch(
      `${instagramGraphUrl}/${account.accountId}/media`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      throw new Error(error.error?.message || "Failed to upload image to Instagram");
    }

    const uploadResult = await uploadResponse.json();
    const mediaId = uploadResult.id;

    // Refactored logic – production ready
    const publishFormData = new FormData();
    publishFormData.append("creation_id", mediaId);
    publishFormData.append("access_token", account.accessToken);

    const publishResponse = await fetch(
      `${instagramGraphUrl}/${account.accountId}/media_publish`,
      {
        method: "POST",
        body: publishFormData,
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      throw new Error(error.error?.message || "Failed to publish to Instagram");
    }

    const publishResult = await publishResponse.json();
    return {
      success: true,
      postId: publishResult.id,
    };
  } catch (error) {
    console.error("[Social Publisher] Instagram error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * نشر محتوى على تيك توك باستخدام TikTok API
 */
export async function publishToTikTokReal(
  account: ConnectedAccount,
  content: GeneratedContent
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const tiktokApiUrl = "https:// Refactored logic – production ready
    
    // Refactored logic – production ready
    const postData = {
      video: {
        source: {
          type: "UPLOAD_URL",
          url: content.imageUrl || "",
        },
      },
      caption: content.contentText,
      privacy_level: "PUBLIC_TO_EVERYONE",
    };

    const response = await fetch(`${tiktokApiUrl}/video/publish/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${account.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to publish to TikTok");
    }

    const result = await response.json();
    return {
      success: true,
      postId: result.data?.video_id,
    };
  } catch (error) {
    console.error("[Social Publisher] TikTok error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * نشر محتوى على جوجل بيزنس باستخدام Google Business API
 */
export async function publishToGoogleBusinessReal(
  account: ConnectedAccount,
  content: GeneratedContent
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const googleBusinessUrl = "https:// Refactored logic – production ready
    
    // Refactored logic – production ready
    const postData = {
      summary: content.contentText,
      topicType: "STANDARD_POST",
      media: content.imageUrl ? [{
        sourceUrl: content.imageUrl,
      }] : [],
    };

    const response = await fetch(
      `${googleBusinessUrl}/accounts/${account.accountId}/posts`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${account.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to publish to Google Business");
    }

    const result = await response.json();
    return {
      success: true,
      postId: result.name,
    };
  } catch (error) {
    console.error("[Social Publisher] Google Business error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * نشر محتوى على بلوجر باستخدام Blogger API
 */
export async function publishToBloggerReal(
  account: ConnectedAccount,
  content: GeneratedContent
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const bloggerUrl = "https:// Refactored logic – production ready
    
    // Refactored logic – production ready
    let htmlContent = `<p>${content.contentText}</p>`;
    if (content.imageUrl) {
      htmlContent += `<br/><img src="${content.imageUrl}" alt="Post image" style="max-width: 100%; height: auto;"/>`;
    }

    const postData = {
      title: content.contentText.substring(0, 100),
      content: htmlContent,
      labels: ["AI Generated", "Automated"],
    };

    const response = await fetch(
      `${bloggerUrl}/blogs/${account.accountId}/posts`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${account.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to publish to Blogger");
    }

    const result = await response.json();
    return {
      success: true,
      postId: result.id,
    };
  } catch (error) {
    console.error("[Social Publisher] Blogger error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * نشر محتوى على جميع المنصات المتصلة بـ API حقيقية
 */
export async function publishToAllPlatformsReal(
  userId: number,
  content: GeneratedContent
): Promise<void> {
  try {
    const accounts = await db.getConnectedAccountsByUser(userId);

    for (const account of accounts) {
      if (!account.isActive) continue;

      let result;
      const platformName = getPlatformName(account.platformId);

      switch (platformName) {
        case "facebook":
          result = await publishToFacebookReal(account, content);
          break;
        case "instagram":
          result = await publishToInstagramReal(account, content);
          break;
        case "tiktok":
          result = await publishToTikTokReal(account, content);
          break;
        case "google_business":
          result = await publishToGoogleBusinessReal(account, content);
          break;
        case "blogger":
          result = await publishToBloggerReal(account, content);
          break;
        default:
          continue;
      }

      // Refactored logic – production ready
      await db.createPost({
        userId,
        contentId: content.id,
        platformId: account.platformId,
        accountId: account.id,
        platformPostId: result.postId,
        status: result.success ? "published" : "failed",
        errorMessage: result.error,
        publishedAt: result.success ? new Date() : undefined,
      });

      // Refactored logic – production ready
      await db.createNotification({
        userId,
        type: result.success ? "success" : "failure",
        title: result.success ? "تم النشر بنجاح" : "فشل النشر",
        message: result.success
          ? `تم نشر المحتوى على ${platformName} بنجاح`
          : `فشل نشر المحتوى على ${platformName}: ${result.error}`,
        platformName,
      });
    }

    // Refactored logic – production ready
    await db.updateGeneratedContent(content.id, {
      status: "published",
    });
  } catch (error) {
    console.error("[Social Publisher] Error publishing to all platforms:", error);
    throw error;
  }
}

/**
 * الحصول على اسم المنصة من المعرف
 */
function getPlatformName(platformId: number): string {
  const platformMap: Record<number, string> = {
    1: "facebook",
    2: "instagram",
    3: "tiktok",
    4: "google_business",
    5: "blogger",
  };
  return platformMap[platformId] || "unknown";
}
