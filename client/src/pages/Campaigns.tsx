import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Edit2, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CAMPAIGN_TEMPLATES = [
  {
    id: "flash_sale",
    name: "عرض فلاش",
    description: "عرض خاص محدود الوقت",
    template: "عرض فلاش حصري! احصل على {discount}% على {product} لفترة محدودة فقط! 🔥 {link}",
    icon: "⚡",
  },
  {
    id: "product_launch",
    name: "إطلاق منتج",
    description: "إطلاق منتج جديد",
    template: "يسعدنا إطلاق {product} الجديد! 🎉 تم تصميمه خصيصاً لـ {audience}. اكتشف المزيد الآن! {link}",
    icon: "🚀",
  },
  {
    id: "seasonal",
    name: "عرض موسمي",
    description: "عروض موسمية خاصة",
    template: "استمتع بـ {season} مع عروضنا الخاصة! {discount}% على {category} 🎁 {link}",
    icon: "🎄",
  },
  {
    id: "customer_appreciation",
    name: "تقدير العملاء",
    description: "شكر العملاء الوفيين",
    template: "شكراً لك يا عميلنا الوفي! 💝 احصل على {discount}% كهدية منا. استخدم الكود {code} {link}",
    icon: "❤️",
  },
  {
    id: "limited_stock",
    name: "مخزون محدود",
    description: "تنبيه المخزون المحدود",
    template: "المخزون محدود! 📦 {product} متوفر الآن بسعر {price}. لا تفوت الفرصة! {link}",
    icon: "⏰",
  },
  {
    id: "referral",
    name: "برنامج الإحالة",
    description: "حث العملاء على الإحالة",
    template: "أحصل على {reward} لكل صديق تحيله! 🤝 شارك الرابط {link} واستمتع بالمكافآت!",
    icon: "🎯",
  },
];

export default function Campaigns() {
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");

  const { data: campaigns, isLoading } = trpc.campaigns.getAll.useQuery(undefined, {
    enabled: !!user,
  });

  const createCampaignMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الحملة بنجاح");
      setCampaignName("");
      setCampaignContent("");
      setCampaignDescription("");
      setSelectedTemplate(null);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إنشاء الحملة");
    },
  });

  const deleteCampaignMutation = trpc.campaigns.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف الحملة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الحملة");
    },
  });

  const handleSelectTemplate = (template: typeof CAMPAIGN_TEMPLATES[0]) => {
    setSelectedTemplate(template.id);
    setCampaignContent(template.template);
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || !campaignContent) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    await createCampaignMutation.mutateAsync({
      name: campaignName,
      description: campaignDescription,
      content: campaignContent,
      templateId: selectedTemplate,
    });
  };

  const handleCopyCampaign = (campaign: any) => {
    setCampaignName(`نسخة من ${campaign.name}`);
    setCampaignContent(campaign.content);
    setCampaignDescription(campaign.description);
    toast.success("تم نسخ الحملة");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">الحملات التسويقية</h1>
            <p className="text-muted-foreground mt-2">إنشاء وإدارة الحملات التسويقية المجانية</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                حملة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إنشاء حملة تسويقية جديدة</DialogTitle>
                <DialogDescription>اختر قالب أو أنشئ حملة مخصصة</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">اسم الحملة</Label>
                  <Input
                    id="campaign-name"
                    placeholder="مثال: عرض الصيف الخاص"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="campaign-desc">الوصف (اختياري)</Label>
                  <Input
                    id="campaign-desc"
                    placeholder="وصف قصير للحملة"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Label>اختر قالب</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {CAMPAIGN_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`p-3 rounded-lg border-2 text-left transition ${
                          selectedTemplate === template.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{template.icon}</div>
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="campaign-content">محتوى الحملة</Label>
                  <Textarea
                    id="campaign-content"
                    placeholder="أدخل محتوى الحملة هنا"
                    value={campaignContent}
                    onChange={(e) => setCampaignContent(e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    استخدم المتغيرات مثل {"{discount}"} و {"{product}"} و {"{link}"}
                  </p>
                </div>

                <Button
                  onClick={handleCreateCampaign}
                  disabled={createCampaignMutation.isPending}
                  className="w-full"
                >
                  {createCampaignMutation.isPending ? "جاري الإنشاء..." : "إنشاء الحملة"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns?.map((campaign: any) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{campaign.content}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyCampaign(campaign)}
                    className="flex-1 gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    نسخ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                    className="flex-1 gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns?.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">لا توجد حملات حالياً. أنشئ حملة جديدة للبدء!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
