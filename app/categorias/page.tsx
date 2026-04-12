import { permanentRedirect } from "next/navigation";

export default function LegacyCategoriesPage() {
  permanentRedirect("/vagas");
}
