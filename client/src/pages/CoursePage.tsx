import { MotionContainer, MotionItem } from "@/components/Motion";

interface CoursePageProps {
  title: string;
  docUrl: string;
}

export default function CoursePage({ title, docUrl }: CoursePageProps) {
  const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`;

  return (
    <MotionContainer className="bg-background min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">Comprehensive free course with images, charts, and structured content.</p>
        </div>

        <MotionItem className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="aspect-[16/10] w-full">
            <iframe
              title={`${title} Document Viewer`}
              src={officeViewer}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </MotionItem>

        <div className="mt-6 text-sm text-muted-foreground">
          If the viewer does not load, <a href={docUrl} target="_blank" rel="noreferrer" className="text-primary underline">open the document in a new tab</a>.
        </div>
      </div>
    </MotionContainer>
  );
}
