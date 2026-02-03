import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import { ContentSetting } from "../drizzle/schema";

/**
 * توليد محتوى نصي باستخدام الذكاء الاصطناعي
 */
export async function generateTextContent(
  topic: string,
  setting: ContentSetting
): Promise<string> {
  const systemPrompt = `أنت خبير في إنشاء محتوى جذاب للتواصل الاجتماعي.
الأسلوب المطلوب: ${setting.contentStyle}
النبرة المطلوبة: ${setting.tone}
اللغة: ${setting.language}
${setting.includeHashtags ? "يجب تضمين هاشتاغات ذات صلة" : "لا تضمن هاشتاغات"}
${setting.includeEmojis ? "يمكن استخدام إيموجيات مناسبة" : "لا تستخدم إيموجيات"}
${setting.maxPostLength ? `الحد الأقصى للطول: ${setting.maxPostLength} حرف` : ""}`;

  const userPrompt = `أنشئ محتوى فريد وجذاب عن الموضوع التالي: ${topic}
المحتوى يجب أن يكون مناسباً لمنصات التواصل الاجتماعي ويشجع على التفاعل.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const messageContent = response.choices[0]?.message?.content;
  const content = typeof messageContent === 'string' ? messageContent : '';
  if (!content) {
    throw new Error("Failed to generate content from LLM");
  }

  return content;
}

/**
 * توليد صورة مصاحبة للمحتوى
 */
export async function processContentPipelineImage(
  topic: string,
  contentText: string
): Promise<{ url: string; key: string }> {
  const imagePrompt = `أنشئ صورة احترافية وجذابة للموضوع التالي: ${topic}
المحتوى: ${contentText.substring(0, 200)}
الصورة يجب أن تكون مناسبة للنشر على وسائل التواصل الاجتماعي.`;

  const imageResult = await generateImage({
    prompt: imagePrompt,
  });

  const imageUrl = typeof imageResult.url === 'string' ? imageResult.url : '';
  if (!imageUrl) {
    throw new Error("Failed to generate image URL");
  }

  // Refactored logic – production ready
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  const fileKey = `generated-images/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

  const { url, key } = await storagePut(
    fileKey,
    Buffer.from(buffer),
    "image/jpeg"
  );

  return { url, key };
}

/**
 * توليد محتوى كامل (نص + صورة)
 */
export async function generateFullContent(
  topic: string,
  setting: ContentSetting,
  includeImage: boolean = true
): Promise<{
  text: string;
  imageUrl?: string;
  imageKey?: string;
}> {
  try {
    // Refactored logic – production ready
    const textContent = await generateTextContent(topic, setting);

    // Refactored logic – production ready
    let imageUrl: string | undefined;
    let imageKey: string | undefined;

    if (includeImage) {
      try {
        const imageResult = await processContentPipelineImage(topic, textContent);
        imageUrl = imageResult.url;
        imageKey = imageResult.key;
      } catch (error) {
        console.warn("[AI Content Generator] Failed to generate image:", error);
        // Refactored logic – production ready
      }
    }

    return {
      text: textContent,
      imageUrl,
      imageKey,
    };
  } catch (error) {
    console.error("[AI Content Generator] Error generating content:", error);
    throw error;
  }
}

/**
 * تحسين المحتوى الموجود
 */
export async function enhanceContent(
  content: string,
  setting: ContentSetting
): Promise<string> {
  const systemPrompt = `أنت محرر محتوى متخصص في وسائل التواصل الاجتماعي.
الأسلوب المطلوب: ${setting.contentStyle}
النبرة المطلوبة: ${setting.tone}`;

  const userPrompt = `حسّن المحتوى التالي ليكون أكثر جذباً وتفاعلاً:
${content}

تأكد من:
- الحفاظ على المعنى الأساسي
- إضافة عناصر جذابة
${setting.includeHashtags ? "- إضافة هاشتاغات ذات صلة" : ""}
${setting.includeEmojis ? "- استخدام إيموجيات مناسبة" : ""}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const messageContent = response.choices[0]?.message?.content;
  const enhancedContent = typeof messageContent === 'string' ? messageContent : '';
  if (!enhancedContent) {
    throw new Error("Failed to enhance content");
  }

  return enhancedContent;
}
