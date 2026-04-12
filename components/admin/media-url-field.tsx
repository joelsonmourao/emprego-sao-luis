"use client";

import Link from "next/link";
import { ExternalLink, ImagePlus, MousePointerClick, Trash2 } from "lucide-react";

import { Field, Input } from "@/components/forms/field";
import { Button } from "@/components/ui/button";

export function MediaUrlField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  previewAlt
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  previewAlt?: string;
}) {
  const trimmedValue = value?.trim() ?? "";

  function openPicker() {
    const picker = window.open("/admin/midia?picker=1", "media-picker", "width=1240,height=900,resizable=yes,scrollbars=yes");
    if (!picker) return;

    const handler = (event: MessageEvent) => {
      const data = event.data as { type?: string; url?: string } | undefined;
      if (event.origin !== window.location.origin) return;
      if (!data || data.type !== "admin-media-select" || !data.url) return;
      onChange(data.url);
      window.removeEventListener("message", handler);
      picker.close();
    };

    window.addEventListener("message", handler);
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={openPicker}>
            <MousePointerClick className="mr-2 h-4 w-4" />
            Escolher da biblioteca
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/midia" target="_blank">
              <ImagePlus className="mr-2 h-4 w-4" />
              Abrir biblioteca
            </Link>
          </Button>
          {trimmedValue ? (
            <>
              <Button asChild size="sm" variant="outline">
                <a href={trimmedValue} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir imagem
                </a>
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onChange("")}>
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </>
          ) : null}
        </div>
        {trimmedValue ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3">
            <img src={trimmedValue} alt={previewAlt || label} className="max-h-44 w-full rounded-2xl object-cover" />
          </div>
        ) : null}
      </div>
    </Field>
  );
}
