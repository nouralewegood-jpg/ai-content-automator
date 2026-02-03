import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, TrendingUp, MessageSquare, Heart, Share2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const { user } = useAuth();
  const { data: analytics, isLoading } = trpc.analytics.getOverview.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: platformStats } = trpc.analytics.getPlatformStats.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: performanceData } = trpc.analytics.getPerformanceData.useQuery(undefined, {
    enabled: !!user,
  });

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

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
        <div>
          <h1 className="text-3xl font-bold">التحليلات والإحصائيات</h1>
          <p className="text-muted-foreground mt-2">عرض أداء المنشورات والإحصائيات الشاملة</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المنشورات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalPosts || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics?.postsThisMonth || 0} هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4" />
                إجمالي الإعجابات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalLikes || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{analytics?.likesGrowth || 0}% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                إجمالي التعليقات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalComments || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{analytics?.commentsGrowth || 0}% من الشهر الماضي
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                إجمالي المشاركات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalShares || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{analytics?.sharesGrowth || 0}% من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه الأداء</CardTitle>
              <CardDescription>أداء المنشورات خلال آخر 30 يوم</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#3b82f6" name="التفاعل" />
                  <Line type="monotone" dataKey="reach" stroke="#10b981" name="الوصول" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع المنصات</CardTitle>
              <CardDescription>نسبة المنشورات لكل منصة</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformStats || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="posts"
                  >
                    {platformStats?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>أداء المنصات</CardTitle>
              <CardDescription>مقارنة الأداء بين المنصات المختلفة</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformStats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="engagement" fill="#3b82f6" name="التفاعل" />
                  <Bar dataKey="reach" fill="#10b981" name="الوصول" />
                  <Bar dataKey="followers" fill="#f59e0b" name="المتابعون" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Best Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنشورات</CardTitle>
            <CardDescription>المنشورات الأكثر تفاعلاً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.topPosts?.map((post: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">{post.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{post.engagement} تفاعل</p>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              الأوقات المثالية للنشر
            </CardTitle>
            <CardDescription>أفضل الأوقات لنشر المحتوى على كل منصة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics?.bestTimes?.map((time: any, index: number) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{time.platform}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">{time.time}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    معدل التفاعل: {time.engagementRate}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
