import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Screener from "@/pages/Screener";
import StockDetail from "@/pages/StockDetail";
import SMIF from "@/pages/SMIF";
import About from "@/pages/About";
import Learn from "@/pages/Learn";
import StockTradingCourse from "@/pages/courses/StockTrading";
import StockInvestingCourse from "@/pages/courses/StockInvesting";
import IncomeInvestingCourse from "@/pages/courses/IncomeInvesting";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/screener" component={Screener} />
        <Route path="/stock/:symbol" component={StockDetail} />
        <Route path="/smif" component={SMIF} />
        <Route path="/about" component={About} />
        <Route path="/learn" component={Learn} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
