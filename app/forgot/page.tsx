import AuthLayout from "@/components/auth/AuthLayout";
import ForgotModule from "@/modules/auth/ForgotModule";

export default function Page() {
  return (
    <AuthLayout>
      <ForgotModule />
    </AuthLayout>
  );
}
