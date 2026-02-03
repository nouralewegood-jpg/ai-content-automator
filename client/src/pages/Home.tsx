import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Loader2, Zap, Smartphone, BarChart3, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-indigo-600">مؤتمت المحتوى</div>
          <Button asChild>
            <a href={getLoginUrl()}>دخول</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            أتمتة المحتوى بقوة الذكاء الاصطناعي
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            وليد محتوى فريد ونشره تلقائياً على جميع منصات التواصل الاجتماعي دون تدخل يدوي
          </p>
          <Button size="lg" asChild className="gap-2">
            <a href={getLoginUrl()}>
              ابدأ الآن مجاناً
              <Zap className="w-5 h-5" />
            </a>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card>
            <CardHeader>
              <Smartphone className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle className="text-lg">جميع المنصات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                فيسبوك، إنستغرام، تيك توك، جوجل بيزنس، وبلوجر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle className="text-lg">ذكاء اصطناعي متقدم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                توليد محتوى نصي وصور احترافية تلقائياً
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle className="text-lg">جدولة ذكية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                جدول المحتوى يومياً أو أسبوعياً أو حسب احتياجاتك
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-indigo-600 mb-2" />
              <CardTitle className="text-lg">تحليلات شاملة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                تتبع أداء المنشورات والإشعارات الفورية
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">كيف يعمل</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">ربط الحسابات</h3>
              <p className="text-sm text-gray-600">
                ربط حساباتك على جميع منصات التواصل الاجتماعي
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">إعداد المحتوى</h3>
              <p className="text-sm text-gray-600">
                حدد موضوع المحتوى والأسلوب والنبرة المفضلة
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">توليد المحتوى</h3>
              <p className="text-sm text-gray-600">
                استخدم الذكاء الاصطناعي لتوليد محتوى فريد
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">النشر التلقائي</h3>
              <p className="text-sm text-gray-600">
                جدول النشر واترك النظام يعمل تلقائياً
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
          <p className="text-lg mb-8 opacity-90">
            انضم إلى آلاف المستخدمين الذين يستخدمون مؤتمت المحتوى لتوسيع وجودهم الرقمي
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href={getLoginUrl()}>إنشاء حساب مجاني</a>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>جميع الحقوق محفوظة © 2026 مؤتمت المحتوى بالذكاء الاصطناعي</p>
        </div>
      </footer>
    </div>
  );
}
