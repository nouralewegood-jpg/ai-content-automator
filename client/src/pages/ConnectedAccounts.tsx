import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ConnectedAccounts() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const { data: connectedAccounts, isLoading: accountsLoading, refetch } = trpc.accounts.getConnected.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: platforms, isLoading: platformsLoading } = trpc.accounts.getPlatforms.useQuery();
  const connectMutation = trpc.accounts.connect.useMutation();
  const disconnectMutation = trpc.accounts.disconnect.useMutation();

  const handleConnect = async () => {
    if (!selectedPlatform || !accountName || !accountId || !accessToken) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await connectMutation.mutateAsync({
        platformId: parseInt(selectedPlatform),
        accountName,
        accountId,
        accessToken,
      });
      toast.success("تم ربط الحساب بنجاح");
      setIsOpen(false);
      setSelectedPlatform("");
      setAccountName("");
      setAccountId("");
      setAccessToken("");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء ربط الحساب");
    }
  };

  const handleDisconnect = async (accountId: number) => {
    try {
      await disconnectMutation.mutateAsync({ accountId });
      toast.success("تم فصل الحساب بنجاح");
      refetch();
    } catch (error) {
      toast.error("حدث خطأ أثناء فصل الحساب");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">الحسابات المتصلة</h1>
            <p className="text-muted-foreground mt-2">إدارة حسابات التواصل الاجتماعي المتصلة</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                ربط حساب جديد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ربط حساب جديد</DialogTitle>
                <DialogDescription>اختر المنصة وأدخل بيانات الحساب</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>المنصة</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المنصة" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms?.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id.toString()}>
                          {platform.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>اسم الحساب</Label>
                  <Input
                    placeholder="مثال: حسابي على فيسبوك"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>معرف الحساب</Label>
                  <Input
                    placeholder="معرف الحساب من المنصة"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                  />
                </div>

                <div>
                  <Label>رمز الوصول (Access Token)</Label>
                  <Input
                    type="password"
                    placeholder="أدخل رمز الوصول"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>

                <Button onClick={handleConnect} disabled={connectMutation.isPending} className="w-full">
                  {connectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الربط...
                    </>
                  ) : (
                    "ربط الحساب"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {accountsLoading || platformsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : connectedAccounts && connectedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedAccounts.map((account) => {
              const platform = platforms?.find((p) => p.id === account.platformId);
              return (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-5 h-5 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">{account.accountName}</CardTitle>
                          <CardDescription>{platform?.displayName}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                        disabled={disconnectMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>معرف الحساب: {account.accountId}</p>
                      <p className="mt-2">الحالة: {account.isActive ? "نشط" : "غير نشط"}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">لم تقم بربط أي حسابات حتى الآن</p>
                <Button onClick={() => setIsOpen(true)}>ربط حساب الآن</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
