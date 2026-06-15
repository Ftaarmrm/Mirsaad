export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin layout doesn't protect routes — each page handles its own auth
  return <>{children}</>;
}
