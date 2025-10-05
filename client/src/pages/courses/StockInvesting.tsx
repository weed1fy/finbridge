import { MotionContainer } from "@/components/Motion";
import { Link } from "wouter";

export default function StockInvesting() {
  const [src, setSrc] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const proxyUrl = `${window.location.origin}/api/docs/stock-investing`;
      setSrc(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(proxyUrl)}`);
    }
  }, []);

  return (
    <MotionContainer className="bg-background min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Stock Investing with Fundamental Analysis</h2>
          <Link href="/learn" className="text-sm text-primary underline">Back</Link>
        </div>

        <div className="w-full h-[80vh] border border-border rounded-lg overflow-hidden">
          {src ? (
            <iframe src={src} width="100%" height="100%" frameBorder="0" title="Stock Investing Course" />
          ) : (
            <div className="p-8">Loading...</div>
          )}
        </div>
      </div>
    </MotionContainer>
  );
}
