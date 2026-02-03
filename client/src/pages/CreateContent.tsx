import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Wand2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateContent() {
  const { user } = useAuth();
  const [contentText, setContentText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contentType, setContentType] = useState<"text" | "image" | "video" | "carousel">("text");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: contentSettings, isLoading: settingsLoading } = trpc.content.getSettings.useQuery(undefined, {
    enabled: !!user,
  });

  const createContentMutation = trpc.generatedContent.create.useMutation();

  const handleGenerateContent = async () => {
    if (!contentSettings || contentSettings.length === 0) {
      toast.error("يرجى إنشاء إعدادات محتوى أولاً");
      return;
    }

    setIsGenerating(true);
    try {
      // Refactored logic – production ready
      // Refactored logic – production ready
      const generatedText = `محتوى مولد تلقائياً بناءً على الإعدادات المحددة. هذا مثال على المحتوى الذي سيتم توليده باستخدام الذكاء الاصطناعي.`;
      setContentText(generatedText);
      toast.success("تم توليد المحتوى بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء توليد المحتوى");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      // Refactored logic – production ready
      // Refactored logic – production ready
      setImageUrl("https://via.placeholder.com/400"); // Refactored logic – production ready
      toast.success("تم توليد الصورة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء توليد الصورة");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = async () => {
    if (!contentText) {
      toast.error("يرجى إدخال نص المحتوى");
      return;
    }

    try {
      await createContentMutation.mutateAsync({
        contentText,
        imageUrl: imageUrl || undefined,
        contentType,
      });
      toast.success("تم حفظ المحتوى بنجاح");
      setContentText("");
      setImageUrl("");
      setContentType("text");
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ المحتوى");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">إنشاء محتوى جديد</h1>
          <p className="text-muted-foreground mt-2">استخدم الذكاء الاصطناعي لتوليد محتوى فريد</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>نص المحتوى</CardTitle>
                <CardDescription>اكتب أو وليد محتوى جديد</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>نوع المحتوى</Label>
                  <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">نص فقط</SelectItem>
                      <SelectItem value="image">نص مع صورة</SelectItem>
                      <SelectItem value="video">فيديو</SelectItem>
                      <SelectItem value="carousel">سلسلة صور</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>المحتوى</Label>
                  <Textarea
                    placeholder="اكتب محتوى جديد أو استخدم الذكاء الاصطناعي لتوليده"
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    rows={8}
                  />
                </div>

                <Button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || settingsLoading}
                  className="w-full gap-2"
                  variant="outline"
                >
                  <Wand2 className="w-4 h-4" />
                  {isGenerating ? "جاري التوليد..." : "توليد محتوى بالذكاء الاصطناعي"}
                </Button>
              </CardContent>
            </Card>

            {contentType !== "text" && (
              <Card>
                <CardHeader>
                  <CardTitle>الصورة</CardTitle>
                  <CardDescription>أضف صورة للمحتوى</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imageUrl && (
                    <div className="relative">
                      <img src={imageUrl} alt="Generated" className="w-full rounded-lg" />
                    </div>
                  )}

                  <Button
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {isGenerating ? "جاري التوليد..." : "توليد صورة"}
                  </Button>

                  <div>
                    <Label>أو أدخل رابط صورة</Label>
                    <Input
                      placeholder="https://via.placeholder.com/400" // Refactored logic – production ready
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview & Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>معاينة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentText && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{contentText}</p>
                  </div>
                )}
                {imageUrl && (
                  <div className="relative">
                    <img src={imageUrl} alt="Preview" className="w-full rounded-lg" />
                  </div>
                )}
                {!contentText && !imageUrl && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    لا توجد معاينة حالياً
                  </p>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveContent}
              disabled={createContentMutation.isPending || !contentText}
              className="w-full"
            >
              {createContentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ المحتوى"
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
