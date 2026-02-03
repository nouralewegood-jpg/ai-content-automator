import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Settings, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { data: connectedAccounts, isLoading: accountsLoading } = trpc.accounts.getConnected.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: contentSettings, isLoading: settingsLoading } = trpc.content.getSettings.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: schedules, isLoading: schedulesLoading } = trpc.schedules.getAll.useQuery(undefined, {
    enabled: !!user,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">مؤتمت المحتوى بالذكاء الاصطناعي</h1>
            <p className="text-muted-foreground mt-2">أهلاً بك {user?.name}</p>
          </div>
          <Link href="/content/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              محتوى جديد
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">الحسابات المتصلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectedAccounts?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">منصات التواصل الاجتماعي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إعدادات المحتوى</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contentSettings?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">موضوعات مختلفة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">الجدولة النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schedules?.filter(s => s.isActive).length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">جداول نشر</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                الإعدادات
              </CardTitle>
              <CardDescription>إدارة إعدادات المحتوى والحسابات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/settings/content">
                <Button variant="outline" className="w-full justify-start">
                  إعدادات المحتوى
                </Button>
              </Link>
              <Link href="/settings/accounts">
                <Button variant="outline" className="w-full justify-start">
                  الحسابات المتصلة
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                الأتمتة
              </CardTitle>
              <CardDescription>إدارة الجدولة والنشر التلقائي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/schedules">
                <Button variant="outline" className="w-full justify-start">
                  عرض الجداول
                </Button>
              </Link>
              <Link href="/schedules/create">
                <Button variant="outline" className="w-full justify-start">
                  جدول جديد
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Content */}
        <Card>
          <CardHeader>
            <CardTitle>المحتوى الأخير</CardTitle>
            <CardDescription>آخر المحتوى المولد</CardDescription>
          </CardHeader>
          <CardContent>
            {accountsLoading || settingsLoading || schedulesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>لا يوجد محتوى حتى الآن. ابدأ بإنشاء محتوى جديد!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
