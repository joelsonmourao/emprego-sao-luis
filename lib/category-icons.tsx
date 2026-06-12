import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  GraduationCap,
  Headphones,
  HeartPulse,
  Laptop,
  Package,
  School,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Users,
  Wrench
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  administrativo: BriefcaseBusiness,
  atendimento: Headphones,
  comercial: ShoppingBag,
  operacional: Wrench,
  logistica: Truck,
  "jovem-aprendiz": GraduationCap,
  estagio: School,
  vendas: Store,
  "servicos-gerais": Users,
  tecnologia: Laptop,
  saude: HeartPulse,
  educacao: School,
  geral: Sparkles
};

export function getCategoryIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? BriefcaseBusiness;
}
