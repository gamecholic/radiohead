export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white">
      {children}
    </div>
  );
}