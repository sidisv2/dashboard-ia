"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (href: string) => pathname?.startsWith(href);
  const isDemo = pathname?.startsWith('/demo');

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4">
        <div className="font-bold text-lg mb-4">Atención IA</div>
        <nav className="grid gap-1">
          <Link className={`px-3 py-2 rounded-lg hover:bg-white/5 ${isActive('/inbox') ? 'bg-white/10' : ''}`} href="/inbox">Inbox</Link>
          <Link className={`px-3 py-2 rounded-lg hover:bg-white/5 ${isActive('/metrics') ? 'bg-white/10' : ''}`} href="/metrics">Métricas</Link>
        </nav>
      </aside>
      <section className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-xl hidden md:block">
            <Input placeholder="Buscar..." />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm opacity-80 hidden sm:block">{session?.user?.email}</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { router.push('/home'); }}
            >
              Salir
            </Button>
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
