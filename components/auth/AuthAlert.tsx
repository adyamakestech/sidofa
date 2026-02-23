export default function AuthAlert({ message, type = "error" }: any) {
  return (
    <div
      className={`
        mb-4 rounded-lg px-4 py-3 text-sm

        border

        ${
          type === "error"
            ? "border-red-500/30 text-red-400 bg-red-500/5"
            : "border-emerald-500/30 text-emerald-400 bg-emerald-500/5"
        }
      `}
    >
      {message}
    </div>
  );
}
