"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Modal } from '../../components/ui/modal';

export default function HomeInfo() {
  const router = useRouter();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const waText = `Quiero info sobre el servicio de Monorepo Attention`;
  const waLink = phone ? `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(waText)}` : '';
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || '';
  const enableDemo = process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true';
  const [buyOpen, setBuyOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMonths, setConfirmMonths] = useState<number | null>(null);
  const [confirmPrice, setConfirmPrice] = useState<number | null>(null);
  const offerMonthly = Number(process.env.NEXT_PUBLIC_OFFER_MONTHLY || 28);
  // Opción B: precios atractivos fijos por periodo
  const price3 = 24;
  const price6 = 21;
  const price12 = 18;
  // Precios "originales" tachados: el doble del precio vigente (50% de ahorro)
  const prevMonthlyDisplay = offerMonthly * 2;
  const prev3Display = price3 * 2;
  const prev6Display = price6 * 2;
  const prev12Display = price12 * 2;

  // Links de pago por suscripción provistos por el usuario
  const planLinks: Record<number, string> = {
    1: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=aec576ed2d68435abbfb77c28097ed67',
    3: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=8583ec80eeca450bb9b610adebe2e428',
    6: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=4dc0b49be4294bcdaf5d60e423c9260a',
    12: 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=e9c8b67921b0435ab8fa1961ea39a250',
  };

  const handlePay = (months: number, price: number) => {
    if (months > 1) {
      setConfirmMonths(months);
      setConfirmPrice(price);
      setConfirmOpen(true);
      return;
    }
    // Mensual: se usará el modal principal para pagar (subscribe)
    setBuyOpen(true);
  };

  const proceedCheckout = () => {
    if (!confirmMonths) return;
    const url = planLinks[confirmMonths];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      setConfirmOpen(false);
    }
  };

  const handleSubscribeMonthly = () => {
    const url = planLinks[1];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <main className="min-h-screen p-6 mx-auto max-w-5xl">
      <header className="flex items-center justify-between mb-8">
        <div className="text-xl font-bold">Monorepo Attention</div>
        <div className="flex gap-2">
          {enableDemo && (
            <Button variant="outline" onClick={() => router.push('/demo')}>Probar demo</Button>
          )}
          <Button variant="default" onClick={() => router.push('/inbox')}>Ir al Dashboard</Button>
        </div>
      </header>

      <section className="text-center">
        <div className="inline-block px-3 py-1 text-xs rounded-full border border-white/20 mb-3">Suscripción mensual</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Atención con IA 24/7 para tu negocio</h1>
        <p className="mt-3 text-white/80 text-lg">Unificá WhatsApp, Email e Instagram. Priorizá y respondé con IA en 1 clic.</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button variant="default" onClick={() => setBuyOpen(true)}>Comprar ahora</Button>
          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer"><Button variant="outline">Hablar por WhatsApp</Button></a>
          ) : (
            <Button variant="outline" disabled>Configurar WhatsApp</Button>
          )}
        </div>
        <div className="mt-2 text-xs opacity-70">Oferta: US${offerMonthly}/mes (antes US${prevMonthlyDisplay}) • Ahorro 50% • Atención 24/7 • Sin permanencia</div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5 bg-white/5">
          <div className="font-semibold">Prueba social</div>
          <div className="text-sm opacity-80">“Reducimos 60% el tiempo de respuesta.” — Flor, Ventas</div>
        </div>
        <div className="rounded-2xl border p-5 bg-white/5">
          <div className="font-semibold">Inbox unificado</div>
          <div className="text-sm opacity-80">Centralizá canales y priorizá automáticamente.</div>
        </div>
        <div className="rounded-2xl border p-5 bg-white/5">
          <div className="font-semibold">IA que ayuda</div>
          <div className="text-sm opacity-80">Respuestas claras y amables listas para enviar.</div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-5"><div className="font-semibold">1) Conectá tus canales</div><div className="text-sm opacity-80">WhatsApp, Email, Instagram.</div></div>
        <div className="rounded-2xl border p-5"><div className="font-semibold">2) Priorizá y respondé</div><div className="text-sm opacity-80">Sugerencias con IA en un clic.</div></div>
        <div className="rounded-2xl border p-5"><div className="font-semibold">3) Medí y escalá</div><div className="text-sm opacity-80">Métricas para tu equipo.</div></div>
      </section>

      <section className="mt-10 grid gap-4">
        <div className="rounded-2xl border p-6 bg-white/5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="text-4xl font-extrabold">US${offerMonthly}<span className="text-base font-medium opacity-80">/mes</span></div>
            <div className="text-sm opacity-70 line-through">US${prevMonthlyDisplay}/mes</div>
            <div className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">OFERTA LIMITADA</div>
          </div>
          <ul className="mt-3 text-sm opacity-90 list-disc pl-5">
            <li>Inbox unificado y prioridades automáticas</li>
            <li>Respuestas sugeridas por IA</li>
            <li>Métricas clave del equipo</li>
            <li>Atención 24/7</li>
            <li>Soporte prioritario</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <Button variant="default" onClick={() => setBuyOpen(true)}>Comprar mensual</Button>
            {enableDemo && <Button variant="outline" onClick={() => router.push('/demo')}>Probar demo</Button>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* 3 meses */}
          <div className="rounded-2xl border p-6 bg-white/5">
            <div className="flex items-center gap-2"><div className="text-sm opacity-70">Plan 3 meses</div><div className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">OFERTA LIMITADA</div></div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold">US${price3}<span className="text-base font-medium opacity-80">/mes</span></div>
              <div className="text-sm opacity-70 line-through">US${prev3Display}/mes</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300">- 50%</div>
            </div>
            <div className="text-xs mt-1 opacity-80">Ahorro total aprox. vs mensual</div>
            <ul className="mt-3 text-sm opacity-90 list-disc pl-5">
              <li>Todo lo del plan mensual</li>
            </ul>
            {checkoutUrl ? (
              <Button className="mt-4" variant="default" onClick={() => handlePay(3, price3)}>Comprar 3 meses</Button>
            ) : (
              <Button className="mt-4" variant="default" disabled>Configurar Checkout</Button>
            )}
          </div>

          {/* 6 meses */}
          <div className="rounded-2xl border p-6 bg-white/5">
            <div className="flex items-center gap-2"><div className="text-sm opacity-70">Plan 6 meses</div><div className="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300">Más popular</div><div className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">OFERTA LIMITADA</div></div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold">US${price6}<span className="text-base font-medium opacity-80">/mes</span></div>
              <div className="text-sm opacity-70 line-through">US${prev6Display}/mes</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300">- 50%</div>
            </div>
            <div className="text-xs mt-1 opacity-80">Ahorro total aprox. vs mensual</div>
            <ul className="mt-3 text-sm opacity-90 list-disc pl-5">
              <li>Todo lo del plan mensual</li>
            </ul>
            {checkoutUrl ? (
              <Button className="mt-4" variant="default" onClick={() => handlePay(6, price6)}>Comprar 6 meses</Button>
            ) : (
              <Button className="mt-4" variant="default" disabled>Configurar Checkout</Button>
            )}
          </div>

          {/* 12 meses */}
          <div className="rounded-2xl border p-6 bg-white/5">
            <div className="flex items-center gap-2"><div className="text-sm opacity-70">Plan 12 meses</div><div className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">Mejor precio</div><div className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">OFERTA LIMITADA</div></div>
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold">US${price12}<span className="text-base font-medium opacity-80">/mes</span></div>
              <div className="text-sm opacity-70 line-through">US${prev12Display}/mes</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300">- 50%</div>
            </div>
            <div className="text-xs mt-1 opacity-80">Ahorro total aprox. vs mensual</div>
            <ul className="mt-3 text-sm opacity-90 list-disc pl-5">
              <li>Todo lo del plan mensual</li>
            </ul>
            {checkoutUrl ? (
              <Button className="mt-4" variant="default" onClick={() => handlePay(12, price12)}>Comprar 12 meses</Button>
            ) : (
              <Button className="mt-4" variant="default" disabled>Configurar Checkout</Button>
            )}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <div className="font-semibold mb-1">FAQs</div>
          <ul className="text-sm opacity-90 list-disc pl-5 space-y-1">
            <li>¿Necesito tarjeta para la demo? No, es limitada por acciones.</li>
            <li>¿Puedo cancelar cuando quiera? Sí, sin permanencia.</li>
            <li>¿Qué canales soportan? WhatsApp, Email e Instagram.</li>
            <li>¿Cómo se manejan los datos? Con buenas prácticas y acceso por roles.</li>
          </ul>
        </div>
        <div className="rounded-2xl border p-5">
          <div className="font-semibold mb-2">Contacto</div>
          {waLink ? (
            <a href={waLink} target="_blank" rel="noreferrer"><Button variant="outline">Hablar por WhatsApp</Button></a>
          ) : (
            <Button variant="outline" disabled>Configurar WhatsApp</Button>
          )}
          <div className="text-xs opacity-70 mt-2">Suscripción mensual. Atención 24/7. Soporte prioritario.</div>
        </div>
      </section>

      <Modal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        title="Elegí cómo querés comprar"
        actions={
          <>
            {waLink ? (
              <a href={waLink} target="_blank" rel="noreferrer">
                <Button variant="outline">Hablar por WhatsApp</Button>
              </a>
            ) : (
              <Button variant="outline" disabled>Configurar WhatsApp</Button>
            )}
            <Button variant="default" onClick={handleSubscribeMonthly}>Pagar ahora</Button>
          </>
        }
      >
        <p className="mb-2">Suscribite por US$15/mes. Podés hablar con el coordinador (WhatsApp) o pagar con tarjeta/MercadoPago ahora mismo.</p>
        <p className="text-xs opacity-80">Recordá: sos nuestra prioridad y contamos con atención 24/7.</p>
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={`Confirmá tu compra — Plan ${confirmMonths ?? ''} meses`}
        actions={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            {checkoutUrl ? (
              <Button variant="default" onClick={proceedCheckout}>Comprar ahora</Button>
            ) : (
              <Button variant="default" disabled>Configurar Checkout</Button>
            )}
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <p>{`Pagás ahora y te olvidás de pagar por ${confirmMonths ?? ''} meses.`}</p>
          {typeof confirmPrice === 'number' && (
            <>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-extrabold">US${confirmPrice}<span className="text-sm font-medium opacity-80">/mes</span></div>
                <div className="text-xs opacity-70 line-through">US${(confirmPrice * 2)}/mes</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">OFERTA LIMITADA</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300">- 50%</div>
              </div>
              {confirmMonths && (
                <div className="text-sm opacity-90">
                  {`Total ahora: US$${confirmPrice * confirmMonths}`}
                  <span className="ml-2 opacity-70 line-through">{`Antes US$${confirmPrice * 2 * confirmMonths}`}</span>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </main>
  );
}
