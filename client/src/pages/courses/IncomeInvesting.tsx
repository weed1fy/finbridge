import { MotionContainer } from "@/components/Motion";
import { Link } from "wouter";

export default function IncomeInvesting() {
  const docUrl = 'https://cdn.builder.io/o/assets%2Fca35db826797471cb8e33731c10b3ab1%2Faa0d9ed465ae42ceaedc8ae65c4eca19?alt=media&token=e0aa017c-0c33-4a20-8da6-b61186729aca&apiKey=ca35db826797471cb8e33731c10b3ab1';
  const src = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`;

  return (
    <MotionContainer className="bg-background min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Income Investing</h2>
          <Link href="/learn" className="text-sm text-primary underline">Back</Link>
        </div>

        <div className="w-full h-[80vh] border border-border rounded-lg overflow-hidden">
          <iframe src={src} width="100%" height="100%" frameBorder="0" title="Income Investing Course" />
        </div>
      </div>
    </MotionContainer>
  );
}
