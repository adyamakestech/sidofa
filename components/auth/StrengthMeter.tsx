export function getStrength(pw: string) {
  let s = 0;

  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;

  return s;
}

export default function StrengthMeter({ password }: { password: string }) {
  const s = getStrength(password);

  const colors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-500",
  ];

  return (
    <div className="mt-2 flex gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded ${
            s > i ? colors[s - 1] : "bg-gray-200"
          }`}
        />
      ))}
      <div className="text-xs text-gray-400 mt-1">Password strength</div>
    </div>
  );
}
