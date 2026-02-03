import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

interface DashboardLayoutMobileProps {
  children: React.ReactNode;
}

export default function DashboardLayoutMobile({ children }: DashboardLayoutMobileProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, navigate] = useLocation();

  const navigationItems = [
    { label: "لوحة التحكم", path: "/dashboard", icon: "📊" },
    { label: "إنشاء محتوى", path: "/content/create", icon: "✨" },
    { label: "الجداول", path: "/schedules", icon: "📅" },
    { label: "الحملات", path: "/campaigns", icon: "🎯" },
    { label: "التحليلات", path: "/analytics", icon: "📈" },
    { label: "الحسابات", path: "/settings/accounts", icon: "🔗" },
    { label: "إعدادات المحتوى", path: "/settings/content", icon: "⚙️" },
    { label: "الفريق", path: "/team", icon: "👥" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">مؤتمت المحتوى</h1>
          <p className="text-gray-600 mb-6">أتمتة نشر المحتوى على وسائل التواصل الاجتماعي</p>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="font-bold text-lg">مؤتمت المحتوى</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-white border-r transform transition-transform duration-300 z-30 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">القائمة</h2>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-100 transition flex items-center gap-3"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t space-y-2">
          <div className="px-4 py-2 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
