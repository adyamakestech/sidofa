import AuthLayout from "@/components/auth/AuthLayout";
import ResetModule from "@/modules/auth/ResetModule";

export default function Page() {
  return (
    <AuthLayout>
      <ResetModule />
    </AuthLayout>
  );
}
