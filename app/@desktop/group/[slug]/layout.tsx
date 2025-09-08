export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden text-white">
      {children}
    </div>
  );
}