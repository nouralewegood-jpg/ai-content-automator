import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Loader2, Save, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContentSettings() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [contentStyle, setContentStyle] = useState("professional");
  const [tone, setTone] = useState("friendly");
  const [language, setLanguage] = useState("ar");
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [maxPostLength, setMaxPostLength] = useState(280);
  const [preview, setPreview] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const createSettingsMutation = trpc.contentSettings.create.useMutation();
  const generatePreviewMutation = trpc.generatedContent.generatePreview.useMutation();

  const handleGeneratePreview = async () => {
    if (!topic) {
      toast.error("يرجى إدخال الموضوع");
      return;
    }

    try {
      const result = await generatePreviewMutation.mutateAsync({
        topic,
        contentStyle,
        tone,
        language,
        includeHashtags,
        includeEmojis,
        maxPostLength,
      });
      setPreview(result.preview);
      setShowPreview(true);
      toast.success("تم توليد المعاينة بنجاح");
    } catch (error) {
      toast.error("حدث خطأ أثناء توليد المعاينة");
    }
  };

  const handleSaveSettings = async () => {
    if (!topic) {
      toast.error("يرجى إدخال الموضوع");
      return;
    }

    try {
      await createSettingsMutation.mutateAsync({
        topic,
        contentStyle,
        tone,
        language,
        includeHashtags,
        includeEmojis,
        maxPostLength,
      });
      toast.success("تم حفظ الإعدادات بنجاح");
      // Refactored logic – production ready
      setTopic("");
      setContentStyle("professional");
      setTone("friendly");
      setLanguage("ar");
      setIncludeHashtags(true);
      setIncludeEmojis(true);
      setMaxPostLength(280);
      setPreview("");
      setShowPreview(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">إعدادات المحتوى</h1>
          <p className="text-muted-foreground mt-2">قم بتخصيص إعدادات توليد المحتوى</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الإعدادات الأساسية</CardTitle>
                <CardDescription>حدد الموضوع والأسلوب الأساسي</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic">الموضوع الرئيسي</Label>
                  <Input
                    id="topic"
                    placeholder="مثال: تقنية المعلومات، الطبخ، السفر"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="style">أسلوب المحتوى</Label>
                    <Select value={contentStyle} onValueChange={setContentStyle}>
                      <SelectTrigger id="style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">احترافي</SelectItem>
                        <SelectItem value="casual">غير رسمي</SelectItem>
                        <SelectItem value="educational">تعليمي</SelectItem>
                        <SelectItem value="entertaining">ترفيهي</SelectItem>
                        <SelectItem value="inspirational">إلهامي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tone">النبرة</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger id="tone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">ودي</SelectItem>
                        <SelectItem value="formal">رسمي</SelectItem>
                        <SelectItem value="humorous">فكاهي</SelectItem>
                        <SelectItem value="serious">جاد</SelectItem>
                        <SelectItem value="motivational">تحفيزي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="language">اللغة</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الخيارات المتقدمة</CardTitle>
                <CardDescription>خيارات إضافية لتخصيص المحتوى</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hashtags">تضمين الهاشتاغات</Label>
                  <Switch
                    id="hashtags"
                    checked={includeHashtags}
                    onCheckedChange={setIncludeHashtags}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emojis">استخدام الإيموجيات</Label>
                  <Switch
                    id="emojis"
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                  />
                </div>

                <div>
                  <Label htmlFor="maxLength">الحد الأقصى لطول المنشور (حرف)</Label>
                  <Input
                    id="maxLength"
                    type="number"
                    min="50"
                    max="5000"
                    value={maxPostLength}
                    onChange={(e) => setMaxPostLength(parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Facebook: 63,206 | Instagram: 2,200 | Twitter: 280 | TikTok: 2,200
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button
                onClick={handleGeneratePreview}
                disabled={generatePreviewMutation.isPending || !topic}
                className="gap-2"
                variant="outline"
              >
                <Eye className="w-4 h-4" />
                {generatePreviewMutation.isPending ? "جاري التوليد..." : "معاينة المحتوى"}
              </Button>

              <Button
                onClick={handleSaveSettings}
                disabled={createSettingsMutation.isPending || !topic}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {createSettingsMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">معاينة</CardTitle>
              </CardHeader>
              <CardContent>
                {showPreview && preview ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{preview}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>عدد الأحرف: {preview.length}</p>
                      <p>عدد الكلمات: {preview.split(/\s+/).length}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {topic ? "اضغط على معاينة لرؤية النتيجة" : "أدخل الموضوع أولاً"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
