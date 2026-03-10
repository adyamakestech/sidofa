import AuthLayout from "@/components/auth/AuthLayout";
import RegisterModule from "@/modules/auth/RegisterModule";

export default function Page() {
  return (
    <AuthLayout>
      <RegisterModule />
    </AuthLayout>
  );
}
