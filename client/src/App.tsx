import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ConnectedAccounts from "./pages/ConnectedAccounts";
import CreateContent from "./pages/CreateContent";
import Schedules from "./pages/Schedules";
import ContentSettings from "./pages/ContentSettings";
import Analytics from "./pages/Analytics";
import Campaigns from "./pages/Campaigns";
import TeamManagement from "./pages/TeamManagement";
import About from "./pages/About";
import Features from "./pages/Features";
import AutoReviewReports from "./pages/AutoReviewReports";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/settings/accounts" component={ConnectedAccounts} />
      <Route path="/content/create" component={CreateContent} />
      <Route path="/schedules" component={Schedules} />
      <Route path="/settings/content" component={ContentSettings} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/team" component={TeamManagement} />
      <Route path="/about" component={About} />
      <Route path="/features" component={Features} />
      <Route path="/auto-review" component={AutoReviewReports} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
