import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/stockData";

const performanceData = [
  { month: 'Jan', smif: 100, kse: 100 },
  { month: 'Feb', smif: 105, kse: 102 },
  { month: 'Mar', smif: 110, kse: 104 },
  { month: 'Apr', smif: 115, kse: 107 },
  { month: 'May', smif: 118, kse: 109 },
  { month: 'Jun', smif: 122, kse: 112 },
  { month: 'Jul', smif: 124.8, kse: 116.5 },
];

const holdings = [
  { symbol: 'OGDC', name: 'Oil & Gas Development', shares: 5000, price: 268.52, value: 1342600, weight: 18.5, return: 32.4 },
  { symbol: 'UBL', name: 'United Bank Limited', shares: 3200, price: 366.20, value: 1171840, weight: 16.2, return: 28.1 },
  { symbol: 'MARI', name: 'Mari Energies Limited', shares: 1800, price: 677.39, value: 1219302, weight: 16.8, return: 19.7 },
];

export default function SMIF() {
  return (
    <div className="bg-background min-h-screen py-20" data-testid="page-smif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">MAYS Student Managed Investment Fund</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pakistan's first Student Managed Investment Fund - Learn by managing a real portfolio
          </p>
        </div>

        {/* Performance Chart */}
        <div className="bg-card rounded-xl p-8 border border-border mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-foreground">Portfolio Performance</h3>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Total Returns</div>
                <div className="text-2xl font-bold text-success">+24.8%</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Outperformance vs KSE-100</div>
                <div className="text-2xl font-bold text-primary">+8.3%</div>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={performanceData}>
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="smif"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                name="MAYS SMIF Performance"
              />
              <Line
                type="monotone"
                dataKey="kse"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="KSE-100 Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings Table */}
        <div className="bg-card rounded-xl p-8 border border-border mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-6">Current Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Symbol</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Company</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Shares</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Value</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Weight</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Return</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding.symbol} className="border-b border-border hover:bg-muted transition-colors" data-testid={`row-holding-${holding.symbol}`}>
                    <td className="py-3 px-4">
                      <div className="text-sm font-semibold text-foreground">{holding.symbol}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-foreground">{holding.name}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-foreground">{holding.shares.toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-foreground">{formatCurrency(holding.price)}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm font-semibold text-foreground">{formatCurrency(holding.value)}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm text-foreground">{holding.weight}%</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm font-semibold text-success">+{holding.return}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Join CTA */}
        <div className="glass-dark rounded-xl p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Ready to Join MAYS SMIF?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gain hands-on experience managing real investments. Learn portfolio construction, risk management, and market analysis from industry professionals.
          </p>
          <button className="px-8 py-4 gradient-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all hover-lift text-lg" data-testid="button-apply-smif">
            Apply Now <ArrowRight className="inline ml-2" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
