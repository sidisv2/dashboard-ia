"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';

export default function Home() {
  const router = useRouter();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const waText = `Quiero info sobre el servicio de Monorepo Attention`;
  const waLink = phone
    ? `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(waText)}`
    : '';
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || '';
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  const enableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true';

  return (
    <main className="min-h-screen flex items-center justify-center p-10">
      <div className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">OFERTA LIMITADA</div>
      <div className="text-sm opacity-70">Redirigiendo al inicio…</div>
    </main>
  );
}
