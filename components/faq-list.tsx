import { MessageCircleQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteFaqEntry } from "@/lib/site-content";
import { getSiteContent } from "@/lib/site-content";

export async function FaqList({ items }: { items?: readonly SiteFaqEntry[] }) {
  const siteContent = await getSiteContent();
  const faqItems = items ?? siteContent.faq.home;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {faqItems.map((item) => (
        <Card key={item.question} className="brand-chip rounded-[1.75rem] border-slate-200 shadow-[0_20px_60px_-45px_rgba(34,73,245,0.45)]">
          <CardHeader>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(88,80,236,0.14),rgba(255,107,87,0.12))] text-[var(--brand-cobalt)]">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{item.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-slate-600">{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
