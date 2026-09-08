import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Download } from "lucide-react";
import offlineAsset from "@/assets/achotikala-offline.zip.asset.json";

const files: Record<string, { url: string; name: string; sizeLabel: string; title: string }> = {
  "achotikala-offline.zip": {
    url: offlineAsset.url,
    name: "achotikala-offline.zip",
    sizeLabel: "כ-103 מ״ב",
    title: "חבילת האופליין של אחותי כלה",
  },
};

// Direct download route: /downloads/achotikala-offline.zip
export const DownloadFile = () => {
  const { filename } = useParams();
  const file = filename ? files[filename] : undefined;

  useEffect(() => {
    if (file) {
      window.location.replace(file.url);
    }
  }, [file]);

  if (!file) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>הקובץ לא נמצא.</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground font-light">
      <p>ההורדה מתחילה...</p>
      <a href={file.url} className="text-primary underline">
        אם ההורדה לא התחילה, לחצו כאן
      </a>
    </div>
  );
};

// Downloads index page: /downloads
const Downloads = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground font-light flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-card rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-8 py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">הורדות</h1>
        <p className="text-foreground/70 mb-8">חבילת האופליין של אחותי כלה</p>
        <a
          href={files["achotikala-offline.zip"].url}
          download="achotikala-offline.zip"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
        >
          <Download className="w-4 h-4" />
          הורדת achotikala-offline.zip ({files["achotikala-offline.zip"].sizeLabel})
        </a>
        <div className="mt-8">
          <Link to="/" className="text-sm text-foreground/60 hover:text-primary transition-colors">
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
