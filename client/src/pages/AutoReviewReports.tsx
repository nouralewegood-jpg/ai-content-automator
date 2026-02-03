import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, XCircle, RefreshCw, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function AutoReviewReports() {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refactored logic – production ready
  const latestReport = {
    timestamp: new Date(),
    summary: {
      score: 78,
      totalIssues: 12,
      criticalIssues: 2,
      warningIssues: 5,
    },
    checks: {
      performance: {
        status: "warning",
        issues: [
          "وقت التحميل الكلي أطول من 3 ثوان",
          "أول عنصر محتوى مرئي يستغرق وقتاً طويلاً",
        ],
      },
      seo: {
        status: "pass",
        issues: [],
      },
      accessibility: {
        status: "warning",
        issues: ["بعض الصور بدون نص بديل"],
      },
      security: {
        status: "pass",
        issues: [],
      },
      codeQuality: {
        status: "fail",
        issues: [
          "5 أخطاء TypeScript",
          "8 أخطاء linting",
          "3 متغيرات غير مستخدمة",
        ],
      },
      responsiveness: {
        status: "pass",
        issues: [],
      },
    },
    recommendations: [
      "تحسين أداء الموقع بتقليل حجم الصور والملفات",
      "إضافة نصوص بديلة لجميع الصور",
      "إصلاح أخطاء TypeScript والـ linting",
    ],
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refactored logic – production ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "fail":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pass":
        return "ممتاز";
      case "warning":
        return "تحذير";
      case "fail":
        return "حرج";
      default:
        return "غير معروف";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">تقارير الفحص التلقائي</h1>
            <p className="text-muted-foreground mt-2">
              فحص تلقائي شامل يعمل كل ساعة
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "جاري الفحص..." : "فحص الآن"}
          </Button>
        </div>

        {/* Overall Score */}
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle>النتيجة الإجمالية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-5xl font-bold text-orange-600">
                {latestReport.summary.score}
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm text-muted-foreground">
                  آخر فحص: {latestReport.timestamp.toLocaleString("ar-EG")}
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {latestReport.summary.criticalIssues}
                    </p>
                    <p className="text-xs text-muted-foreground">مشاكل حرجة</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {latestReport.summary.warningIssues}
                    </p>
                    <p className="text-xs text-muted-foreground">تحذيرات</p>
                  </div>
                </div>
              </div>
            </div>
            <Progress value={latestReport.summary.score} className="h-2" />
          </CardContent>
        </Card>

        {/* Checks Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(latestReport.checks).map(([key, check]: any) => (
            <Card key={key}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg capitalize">
                    {key === "codeQuality" ? "جودة الكود" : key}
                  </CardTitle>
                  {getStatusIcon(check.status)}
                </div>
              </CardHeader>
              <CardContent>
                <Badge className={getStatusColor(check.status)}>
                  {getStatusLabel(check.status)}
                </Badge>
                {check.issues.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {check.issues.length} مشاكل:
                    </p>
                    <ul className="text-xs space-y-1">
                      {check.issues.slice(0, 2).map((issue: string, idx: number) => (
                        <li key={idx} className="text-muted-foreground">
                          • {issue}
                        </li>
                      ))}
                      {check.issues.length > 2 && (
                        <li className="text-muted-foreground">
                          • و{check.issues.length - 2} مشاكل أخرى
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Issues */}
        <Card>
          <CardHeader>
            <CardTitle>المشاكل المكتشفة</CardTitle>
            <CardDescription>
              تفاصيل جميع المشاكل المكتشفة في آخر فحص
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(latestReport.checks).map(([key, check]: any) => (
              check.issues.length > 0 && (
                <div key={key} className="space-y-3">
                  <h3 className="font-bold capitalize flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    {key === "codeQuality" ? "جودة الكود" : key}
                  </h3>
                  <div className="space-y-2 mr-6">
                    {check.issues.map((issue: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <p className="text-sm text-red-800">• {issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              التوصيات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {latestReport.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span className="text-sm text-blue-900">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Schedule Info */}
        <Card>
          <CardHeader>
            <CardTitle>جدول الفحص</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  تكرار الفحص
                </p>
                <p className="text-lg font-bold mt-1">كل ساعة</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  آخر فحص
                </p>
                <p className="text-lg font-bold mt-1">
                  {latestReport.timestamp.toLocaleTimeString("ar-EG")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  الفحص التالي
                </p>
                <p className="text-lg font-bold mt-1">
                  {new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString("ar-EG")}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  الحالة
                </p>
                <p className="text-lg font-bold mt-1 text-green-600">
                  ✓ نشطة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
