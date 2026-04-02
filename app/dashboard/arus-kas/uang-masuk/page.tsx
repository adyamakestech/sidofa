import UangMasukModule from "@/modules/admin/uang-masuk/UangMasukModule";

import { TransactionsProvider } from "@/context/TransactionsContext";
export default function Page() {
  return (
    <TransactionsProvider>
      <UangMasukModule />
    </TransactionsProvider>
  );
}
