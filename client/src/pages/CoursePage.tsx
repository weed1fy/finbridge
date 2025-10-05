import { useState, useEffect } from "react";
import { MotionContainer, MotionItem } from "@/components/Motion";

interface CoursePageProps {
  title: string;
  docUrl: string; // endpoint that returns HTML
}

export default function CoursePage({ title, docUrl }: CoursePageProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const resp = await fetch(docUrl, { cache: 'no-store' });
        if (!resp.ok) throw new Error('Failed to fetch course');

        const contentType = resp.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
          const text = await resp.text();

          // Sanitize and clean potentially large/empty images to avoid rendering issues
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // remove any script or style tags for safety
            doc.querySelectorAll('script, style').forEach(n => n.remove());

            // Process images: remove images with empty src or extremely large data URIs
            doc.querySelectorAll('img').forEach((img) => {
              const src = img.getAttribute('src') || '';
              if (!src || src.trim().length === 0) {
                const placeholder = doc.createElement('div');
                placeholder.textContent = img.getAttribute('alt') || 'Image omitted';
                placeholder.className = 'text-muted-foreground bg-muted p-2 rounded my-2';
                img.replaceWith(placeholder);
              } else if (src.startsWith('data:') && src.length > 10000) {
                // too large to inline, replace with download link
                const link = doc.createElement('a');
                link.href = src;
                link.textContent = 'Image omitted (click to view)';
                link.className = 'text-primary underline';
                img.replaceWith(link);
              } else {
                // ensure images are lazy and constrained
                img.setAttribute('loading', 'lazy');
                img.style.maxWidth = '100%';
                img.removeAttribute('width');
                img.removeAttribute('height');
              }
            });

            const cleaned = doc.documentElement.outerHTML;
            if (mounted) setHtml(cleaned);
          } catch (e) {
            // if sanitization fails, fallback to raw
            console.warn('Failed to sanitize course HTML', e);
            if (mounted) setHtml(text);
          }
        } else {
          // binary or other content: do not attempt heavy client-side conversion
          // Provide a clear download link and a lightweight message instead of in-browser conversion
          if (mounted) setHtml(`<p class="text-muted-foreground">This course document is available for download. <a href="${docUrl.replace('/html/', '/doc/')}" target="_blank" rel="noreferrer" class="text-primary underline">Download the source document</a>.</p>`);
        }
      } catch (err) {
        console.error('Error loading course content:', err);
        if (mounted) setHtml('<p class="text-muted-foreground">Unable to load course content. Please try again later.</p>');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [docUrl]);

  return (
    <MotionContainer className="bg-background min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">Comprehensive free course with images, charts, and structured content.</p>
        </div>

        <MotionItem className="bg-card rounded-xl border border-border p-6">
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">Loading course...</div>
          ) : (
            <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: html || '' }} />
          )}
        </MotionItem>

        <div className="mt-4 text-sm text-muted-foreground">
          If content looks incorrect, <a href={docUrl.replace('/html/', '/doc/')} target="_blank" rel="noreferrer" className="text-primary underline">download source document</a>.
        </div>
      </div>
    </MotionContainer>
  );
}
