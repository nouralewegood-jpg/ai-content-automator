import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, BarChart3, Users, Lock, Clock } from "lucide-react";

export default function Features() {
  const { user } = useAuth();

  const mainFeatures = [
    {
      icon: Zap,
      title: "توليد محتوى بالذكاء الاصطناعي",
      description: "إنشاء محتوى جذاب وفعال تلقائياً باستخدام أحدث تقنيات الذكاء الاصطناعي",
      benefits: [
        "توليد نصوص احترافية",
        "إنشاء صور جذابة",
        "اقتراحات محتوى ذكية",
        "تحسين تلقائي للنصوص",
      ],
    },
    {
      icon: Clock,
      title: "جدولة النشر التلقائي",
      description: "جدول محتواك مسبقاً والنشر التلقائي في أفضل الأوقات",
      benefits: [
        "جدولة متقدمة",
        "نشر متزامن",
        "أوقات مثالية للنشر",
        "إعادة نشر ذكية",
      ],
    },
    {
      icon: BarChart3,
      title: "تحليلات متقدمة",
      description: "احصل على رؤى عميقة حول أداء محتواك على جميع المنصات",
      benefits: [
        "تقارير تفصيلية",
        "مقاييس الأداء",
        "تحليل المنافسين",
        "توصيات ذكية",
      ],
    },
    {
      icon: Users,
      title: "إدارة الفريق المتقدمة",
      description: "تعاون مع فريقك بسهولة مع نظام أدوار وصلاحيات متقدم",
      benefits: [
        "أدوار مرنة",
        "سجل الأنشطة",
        "التعليقات والملاحظات",
        "إدارة الصلاحيات",
      ],
    },
    {
      icon: Lock,
      title: "أمان عالي",
      description: "حماية كاملة لبيانات حسابك وخصوصيتك مع تشفير عسكري",
      benefits: [
        "تشفير 256-bit",
        "مصادقة ثنائية",
        "نسخ احتياطية آمنة",
        "الامتثال للمعايير الدولية",
      ],
    },
    {
      icon: Zap,
      title: "الحملات التسويقية",
      description: "قوالب حملات جاهزة وقابلة للتخصيص لجميع أنواع الحملات",
      benefits: [
        "قوالب متعددة",
        "تخصيص كامل",
        "إدارة الحملات",
        "قياس النتائج",
      ],
    },
  ];

  const platforms = [
    { name: "Facebook", icon: "📘" },
    { name: "Instagram", icon: "📷" },
    { name: "TikTok", icon: "🎵" },
    { name: "Google Business", icon: "🏢" },
    { name: "Blogger", icon: "✍️" },
    { name: "LinkedIn", icon: "💼" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold">المميزات الرئيسية</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اكتشف كل ما تحتاجه لإدارة وسائل التواصل الاجتماعي بكفاءة
          </p>
        </section>

        {/* Main Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">الميزات الأساسية</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mainFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-orange-600" />
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Supported Platforms */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">المنصات المدعومة</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((platform, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{platform.icon}</div>
                  <p className="font-medium text-sm">{platform.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">مقارنة الخطط</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-4 px-4 font-bold">الميزة</th>
                  <th className="text-center py-4 px-4 font-bold">مجاني</th>
                  <th className="text-center py-4 px-4 font-bold">احترافي</th>
                  <th className="text-center py-4 px-4 font-bold">متقدم</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "عدد الحسابات", free: "3", pro: "10", advanced: "غير محدود" },
                  { feature: "جدولة المنشورات", free: "50/شهر", pro: "500/شهر", advanced: "غير محدود" },
                  { feature: "التحليلات", free: "محدودة", pro: "متقدمة", advanced: "متقدمة جداً" },
                  { feature: "توليد المحتوى", free: "10/شهر", pro: "100/شهر", advanced: "غير محدود" },
                  { feature: "إدارة الفريق", free: "❌", pro: "✓", advanced: "✓" },
                  { feature: "الدعم الفني", free: "البريد الإلكتروني", pro: "الأولوية", advanced: "24/7" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-orange-50">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="py-4 px-4 text-center">{row.free}</td>
                    <td className="py-4 px-4 text-center text-orange-600 font-medium">{row.pro}</td>
                    <td className="py-4 px-4 text-center text-orange-600 font-medium">{row.advanced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold">ميزات متقدمة</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Badge className="bg-orange-600">جديد</Badge>
                الذكاء الاصطناعي المتقدم
              </h3>
              <p className="text-muted-foreground">
                استخدم نماذج الذكاء الاصطناعي الأحدث لإنشاء محتوى أكثر ذكاءً وفعالية
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Badge className="bg-orange-600">جديد</Badge>
                التعاون في الوقت الفعلي
              </h3>
              <p className="text-muted-foreground">
                تعاون مع فريقك في الوقت الفعلي مع التعليقات والملاحظات المباشرة
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Badge className="bg-orange-600">جديد</Badge>
                التقارير المخصصة
              </h3>
              <p className="text-muted-foreground">
                أنشئ تقارير مخصصة تناسب احتياجات عملك بالضبط
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Badge className="bg-orange-600">جديد</Badge>
                التكامل مع الأدوات الأخرى
              </h3>
              <p className="text-muted-foreground">
                تكامل سلس مع أدوات وخدمات أخرى تستخدمها بالفعل
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
