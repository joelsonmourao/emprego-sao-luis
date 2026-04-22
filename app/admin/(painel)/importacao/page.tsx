import { AdminJobImporter } from "@/components/admin/admin-job-importer";
import { AdminScheduledJobUpload } from "@/components/admin/admin-scheduled-job-upload";

export default function AdminImportPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <AdminJobImporter />
      <AdminScheduledJobUpload />
    </div>
  );
}

