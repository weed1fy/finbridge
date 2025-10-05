import { useRef, useState, useEffect } from "react";
import { MotionContainer, MotionItem } from "@/components/Motion";

interface CoursePageProps {
  title: string;
  docUrl: string;
}

export default function CoursePage({ title, docUrl }: CoursePageProps) {
  const [uploadedHtml, setUploadedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docUrl)}`;

  async function handleFile(file: File) {
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore - mammoth loaded via CDN in index.html
      const mammothLib = (window as any).mammoth;
      if (!mammothLib) {
        alert('Document conversion library not available.');
        setLoading(false);
        return;
      }

      const result = await mammothLib.convertToHtml({ arrayBuffer }, {
        convertImage: mammothLib.images.inline(function(element: any) {
          return element.read('base64').then(function(imageBuffer: string) {
            return { src: 'data:' + element.contentType + ';base64,' + imageBuffer };
          });
        })
      });

      setUploadedHtml(result.value);
    } catch (err) {
      console.error('Error converting document:', err);
      alert('Failed to convert document. Try another file or use the download link below.');
    } finally {
      setLoading(false);
    }
  }

  // Try to auto-fetch and convert the proxied document if available
  useState(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const mammothLib = (window as any).mammoth;
        if (!mammothLib) return;
        const resp = await fetch(docUrl);
        if (!resp.ok) return;
        const buf = await resp.arrayBuffer();
        const result = await mammothLib.convertToHtml({ arrayBuffer: buf }, {
          convertImage: mammothLib.images.inline(function(element: any) {
            return element.read('base64').then(function(imageBuffer: string) {
              return { src: 'data:' + element.contentType + ';base64,' + imageBuffer };
            });
          })
        });
        if (mounted) setUploadedHtml(result.value);
      } catch (err) {
        // ignore - user can upload manually
        console.warn('Auto-convert failed', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  });

  return (
    <MotionContainer className="bg-background min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">Comprehensive free course with images, charts, and structured content. You can also upload a .docx file to view it inline.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="p-4 text-sm text-muted-foreground">
              If the viewer does not load, <a href={docUrl} target="_blank" rel="noreferrer" className="text-primary underline">open the document in a new tab</a> or upload your own copy below.
            </div>
          </MotionItem>

          <MotionItem className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-2">Upload .docx to view inline</h3>
            <p className="text-sm text-muted-foreground mb-4">If the embedded viewer fails, upload a local copy of the course document and it will be rendered in the browser.</p>

            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                className="hidden"
              />
              <button
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? 'Converting...' : 'Upload .docx'}
              </button>

              <a href={docUrl} target="_blank" rel="noreferrer" className="text-primary underline ml-4">Download source</a>
            </div>

            {uploadedHtml && (
              <div className="mt-6 bg-muted p-4 rounded-md overflow-auto max-h-[60vh] text-sm">
                {/* injected HTML from mammoth */}
                <div dangerouslySetInnerHTML={{ __html: uploadedHtml }} />
              </div>
            )}
          </MotionItem>
        </div>
      </div>
    </MotionContainer>
  );
}
