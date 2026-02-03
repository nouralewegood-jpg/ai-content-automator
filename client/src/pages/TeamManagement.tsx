import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Shield, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ROLE_DESCRIPTIONS: Record<string, { label: string; description: string; color: string }> = {
  admin: {
    label: "مسؤول",
    description: "تحكم كامل على جميع الميزات",
    color: "bg-red-100 text-red-800",
  },
  publisher: {
    label: "ناشر",
    description: "يمكنه نشر المحتوى المعتمد",
    color: "bg-blue-100 text-blue-800",
  },
  reviewer: {
    label: "مراجع",
    description: "يمكنه مراجعة وتعديل المحتوى",
    color: "bg-yellow-100 text-yellow-800",
  },
  editor: {
    label: "محرر",
    description: "يمكنه إنشاء وتعديل المحتوى",
    color: "bg-green-100 text-green-800",
  },
};

export default function TeamManagement() {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [newRole, setNewRole] = useState("");

  const { data: teamMembers, isLoading } = trpc.team.getMembers.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: activityLog } = trpc.team.getActivityLog.useQuery(undefined, {
    enabled: !!user,
  });

  const inviteMemberMutation = trpc.team.inviteMember.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال الدعوة بنجاح");
      setInviteEmail("");
      setInviteRole("editor");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إرسال الدعوة");
    },
  });

  const updateRoleMutation = trpc.team.updateMemberRole.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث الدور بنجاح");
      setSelectedMember(null);
      setNewRole("");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث الدور");
    },
  });

  const removeMemberMutation = trpc.team.removeMember.useMutation({
    onSuccess: () => {
      toast.success("تم إزالة العضو بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إزالة العضو");
    },
  });

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    await inviteMemberMutation.mutateAsync({
      email: inviteEmail,
      role: inviteRole as any,
    });
  };

  const handleUpdateRole = async () => {
    if (!selectedMember || !newRole) {
      toast.error("يرجى اختيار دور جديد");
      return;
    }

    await updateRoleMutation.mutateAsync({
      memberId: selectedMember.id,
      role: newRole as any,
    });
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
            <h1 className="text-3xl font-bold">إدارة الفريق</h1>
            <p className="text-muted-foreground mt-2">إدارة أعضاء الفريق والأدوار والأنشطة</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                دعوة عضو
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>دعوة عضو جديد</DialogTitle>
                <DialogDescription>أضف عضو جديد إلى فريقك</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="role">الدور</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">محرر</SelectItem>
                      <SelectItem value="reviewer">مراجع</SelectItem>
                      <SelectItem value="publisher">ناشر</SelectItem>
                      <SelectItem value="admin">مسؤول</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">
                    {ROLE_DESCRIPTIONS[inviteRole]?.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ROLE_DESCRIPTIONS[inviteRole]?.description}
                  </p>
                </div>

                <Button
                  onClick={handleInvite}
                  disabled={inviteMemberMutation.isPending}
                  className="w-full"
                >
                  {inviteMemberMutation.isPending ? "جاري الإرسال..." : "إرسال الدعوة"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>أعضاء الفريق</CardTitle>
                <CardDescription>إدارة أعضاء الفريق والأدوار</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers?.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="mt-2">
                        <Badge className={ROLE_DESCRIPTIONS[member.role]?.color}>
                          {ROLE_DESCRIPTIONS[member.role]?.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMember(member);
                              setNewRole(member.role);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تحديث الدور</DialogTitle>
                            <DialogDescription>
                              تحديث دور {member.name}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="new-role">الدور الجديد</Label>
                              <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger id="new-role">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="editor">محرر</SelectItem>
                                  <SelectItem value="reviewer">مراجع</SelectItem>
                                  <SelectItem value="publisher">ناشر</SelectItem>
                                  <SelectItem value="admin">مسؤول</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              onClick={handleUpdateRole}
                              disabled={updateRoleMutation.isPending}
                              className="w-full"
                            >
                              {updateRoleMutation.isPending ? "جاري التحديث..." : "تحديث الدور"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeMemberMutation.mutate(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Role Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  الأدوار والصلاحيات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(ROLE_DESCRIPTIONS).map(([role, info]) => (
                  <div key={role} className={`p-3 rounded-lg ${info.color}`}>
                    <p className="font-medium text-sm">{info.label}</p>
                    <p className="text-xs mt-1">{info.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>سجل الأنشطة</CardTitle>
            <CardDescription>تتبع أنشطة الفريق والتغييرات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLog?.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-4 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.actor} - {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
