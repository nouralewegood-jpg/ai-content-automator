import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, TrendingUp, Shield, Rocket, Award } from "lucide-react";

export default function About() {
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "توليد محتوى ذكي",
      description: "استخدم الذكاء الاصطناعي لإنشاء محتوى جذاب وفعال تلقائياً",
    },
    {
      icon: TrendingUp,
      title: "تحليلات متقدمة",
      description: "احصل على رؤى عميقة حول أداء محتواك على جميع المنصات",
    },
    {
      icon: Users,
      title: "إدارة الفريق",
      description: "تعاون مع فريقك بسهولة مع نظام أدوار وصلاحيات متقدم",
    },
    {
      icon: Shield,
      title: "أمان عالي",
      description: "حماية كاملة لبيانات حسابك وخصوصيتك مع تشفير عسكري",
    },
    {
      icon: Rocket,
      title: "جدولة تلقائية",
      description: "جدول محتواك مسبقاً والنشر التلقائي في أفضل الأوقات",
    },
    {
      icon: Award,
      title: "دعم عملاء",
      description: "فريق دعم متخصص متاح 24/7 لمساعدتك",
    },
  ];

  const stats = [
    { number: "50,000+", label: "مستخدم نشط" },
    { number: "2M+", label: "منشور شهري" },
    { number: "15+", label: "منصة مدعومة" },
    { number: "99.9%", label: "وقت التشغيل" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            منصة نور الذكية
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            منصة متكاملة لإدارة وسائل التواصل الاجتماعي والتسويق الرقمي باستخدام الذكاء الاصطناعي
          </p>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <p className="text-3xl font-bold text-orange-600">{stat.number}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* About Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">عن منصة نور</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              منصة نور الذكية هي حل شامل لإدارة وسائل التواصل الاجتماعي والتسويق الرقمي. تم تطويرها بواسطة فريق متخصص من الخبراء في مجال التكنولوجيا والتسويق الرقمي. تجمع المنصة بين قوة الذكاء الاصطناعي وسهولة الاستخدام لمساعدتك على تحقيق أهدافك التسويقية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">رؤيتنا</h3>
              <p className="text-muted-foreground">
                تمكين الشركات والأفراد من الاستفادة القصوى من وسائل التواصل الاجتماعي من خلال أدوات ذكية وسهلة الاستخدام.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">مهمتنا</h3>
              <p className="text-muted-foreground">
                توفير منصة متكاملة تجمع بين الذكاء الاصطناعي والتحليلات المتقدمة لتحسين الأداء التسويقي على جميع المنصات.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">المميزات الرئيسية</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-8 space-y-6">
          <h2 className="text-3xl font-bold">لماذا تختار منصة نور؟</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">✓</span>
                سهولة الاستخدام
              </h3>
              <p className="text-muted-foreground">واجهة بديهية وسهلة الاستخدام لا تتطلب خبرة تقنية</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">✓</span>
                دعم شامل
              </h3>
              <p className="text-muted-foreground">دعم فني متخصص وموارد تعليمية شاملة</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">✓</span>
                تسعير مرن
              </h3>
              <p className="text-muted-foreground">خطط تسعير مرنة تناسب جميع الميزانيات</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm">✓</span>
                تحديثات مستمرة
              </h3>
              <p className="text-muted-foreground">تحديثات دورية وميزات جديدة باستمرار</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-3xl font-bold">ابدأ مع منصة نور اليوم</h2>
          <p className="text-lg text-muted-foreground">
            انضم إلى آلاف المستخدمين الذين يستخدمون منصة نور لتحسين أدائهم التسويقي
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              ابدأ الآن مجاناً
            </Button>
            <Button size="lg" variant="outline">
              تعرف على المزيد
            </Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
