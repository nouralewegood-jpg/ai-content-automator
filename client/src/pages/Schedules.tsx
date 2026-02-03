import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Clock, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Schedules() {
  const { user } = useAuth();
  const { data: schedules, isLoading, refetch } = trpc.schedules.getAll.useQuery(undefined, {
    enabled: !!user,
  });

  const updateMutation = trpc.schedules.update.useMutation();

  const handleToggleActive = async (scheduleId: number, isActive: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id: scheduleId,
        isActive: !isActive,
      });
      toast.success("تم تحديث الجدولة بنجاح");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الجدولة");
    }
  };

  const getScheduleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      daily: "يومي",
      weekly: "أسبوعي",
      custom: "مخصص",
      once: "مرة واحدة",
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">جداول النشر</h1>
            <p className="text-muted-foreground mt-2">إدارة جداول النشر التلقائي</p>
          </div>
          <Link href="/schedules/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              جدول جديد
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : schedules && schedules.length > 0 ? (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">جدولة #{schedule.id}</CardTitle>
                        <CardDescription>
                          {getScheduleTypeLabel(schedule.scheduleType)} - الساعة {schedule.scheduleTime}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={schedule.isActive ? "default" : "secondary"}>
                      {schedule.isActive ? "نشط" : "معطل"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(schedule.id, schedule.isActive)}
                      disabled={updateMutation.isPending}
                    >
                      {schedule.isActive ? "إيقاف" : "تفعيل"}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">لم تقم بإنشاء أي جداول حتى الآن</p>
                <Link href="/schedules/create">
                  <Button>إنشاء جدول الآن</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
