import AuthLayout from "@/components/auth/AuthLayout";
import LoginModule from "@/modules/auth/LoginModule";

export default function Page() {
  return (
    <AuthLayout>
      <LoginModule />
    </AuthLayout>
  );
}
