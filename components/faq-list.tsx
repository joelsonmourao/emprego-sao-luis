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
        <Card key={item.question} className="brand-chip rounded-[1.75rem] border-[var(--brand-line)] shadow-[0_20px_60px_-45px_rgba(26,43,76,0.18)]">
          <CardHeader>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(26,43,76,0.12),rgba(255,109,0,0.16))] text-[var(--brand-orange)]">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl">{item.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-[var(--brand-text-secondary)]">{item.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
