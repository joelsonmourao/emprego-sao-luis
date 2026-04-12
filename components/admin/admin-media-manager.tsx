"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, Copy, MousePointerClick, Trash2, Upload } from "lucide-react";

import { Field, Input } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MediaAsset = {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  altText: string | null;
  createdAt: string;
};

export function AdminMediaManager({ initialAssets, pickerMode = false }: { initialAssets: MediaAsset[]; pickerMode?: boolean }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [assets, setAssets] = useState(initialAssets);
  const [altText, setAltText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFile(file: File) {
    setBusy(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText);

    const response = await fetch("/api/admin/media", {
      method: "POST",
      body: formData
    });

    const result = (await response.json()) as { ok: boolean; error?: string; asset?: MediaAsset };
    setBusy(false);

    if (!response.ok || !result.ok || !result.asset) {
      setMessage(result.error ?? "Nao foi possivel enviar a imagem.");
      return;
    }

    setAssets((current) => [result.asset!, ...current]);
    setAltText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setMessage("Imagem enviada com sucesso.");
  }

  async function removeAsset(id: string) {
    const confirmed = window.confirm("Deseja remover esta midia?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/media/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      setMessage("Nao foi possivel remover a midia.");
      return;
    }

    setAssets((current) => current.filter((asset) => asset.id !== id));
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("URL copiada para a area de transferencia.");
  }

  function selectAsset(url: string) {
    if (!pickerMode || !window.opener) return;
    window.opener.postMessage({ type: "admin-media-select", url }, window.location.origin);
    window.close();
  }

  return (
    <div className="grid gap-6">
      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>Enviar imagem</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="Texto alternativo">
            <Input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Ex.: Logo principal do site" />
          </Field>
          <input ref={fileInputRef} type="file" accept="image/*" className="block text-sm text-slate-700" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void uploadFile(file);
            }
          }} />
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <div className="text-xs text-slate-500">Envie JPG, PNG, WEBP ou SVG. Depois copie a URL para usar em logo, capa, favicon ou imagem social.</div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-slate-200 bg-white/95">
        <CardHeader>
          <CardTitle>{pickerMode ? "Escolher imagem da biblioteca" : "Biblioteca de midia"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <div key={asset.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-white">
                {asset.mimeType === "image/svg+xml" ? (
                  <img src={asset.url} alt={asset.altText ?? asset.originalName} className="h-full w-full object-contain" />
                ) : (
                  <Image src={asset.url} alt={asset.altText ?? asset.originalName} fill className="object-cover" />
                )}
              </div>
              <p className="truncate text-sm font-semibold text-slate-950">{asset.originalName}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{asset.url}</p>
              <div className="mt-4 flex gap-2">
                {pickerMode ? (
                  <Button type="button" size="sm" onClick={() => selectAsset(asset.url)}>
                    <Check className="mr-2 h-4 w-4" />
                    Usar imagem
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="outline" onClick={() => copyUrl(asset.url)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar URL
                </Button>
                {pickerMode ? (
                  <Button type="button" size="sm" variant="outline" onClick={() => window.open(asset.url, "_blank", "noopener,noreferrer")}>
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                ) : null}
                <Button type="button" size="sm" variant="outline" onClick={() => removeAsset(asset.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
          {!assets.length ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              <Upload className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3">Nenhuma imagem enviada ainda.</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
