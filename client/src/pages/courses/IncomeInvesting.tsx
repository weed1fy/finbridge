import React from "react";
import { MotionContainer } from "@/components/Motion";
import { Link } from "wouter";

export default function IncomeInvesting() {
  const [src, setSrc] = React.useState<string>('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const proxyUrl = `${window.location.origin}/api/docs/income-investing`;
      setSrc(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(proxyUrl)}`);
    }
  }, []);

  return (
    <MotionContainer className="bg-background min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Income Investing</h2>
          <Link href="/learn" className="text-sm text-primary underline">Back</Link>
        </div>

        <div className="w-full h-[80vh] border border-border rounded-lg overflow-hidden">
          {src ? (
            <iframe src={src} width="100%" height="100%" frameBorder="0" title="Income Investing Course" />
          ) : (
            <div className="p-8">Loading...</div>
          )}
        </div>
      </div>
    </MotionContainer>
import CoursePage from "@/pages/CoursePage";

export default function IncomeInvesting() {
  return (
    <CoursePage
      title="Income Investing"
      docUrl="/courses/html/income-investing"
    />
  );
}
