/**
 * The auth route group renders its own full-screen layout (see AuthShell) and
 * has no global navbar/footer — those are suppressed for /login and /signup in
 * SiteChrome, the same way the booking flow opts out.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
