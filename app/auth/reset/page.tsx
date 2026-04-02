import ResetModule from "@/modules/auth/ResetModule";

export default function Page({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <ResetModule token={searchParams.token} />;
}
