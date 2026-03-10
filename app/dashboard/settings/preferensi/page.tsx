import AdminLayout from "@/components/admin/AdminLayout";
import PreferensiModule from "@/modules/admin/settings/preferensi/PreferensiModule";

export default function Page() {
  return (
    <AdminLayout>
      <PreferensiModule />
    </AdminLayout>
  );
}
