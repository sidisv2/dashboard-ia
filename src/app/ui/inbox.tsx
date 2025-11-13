'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { useToast } from '../../components/ui/toast';
import { Segmented } from '../../components/ui/segmented';
import { Avatar } from '../../components/ui/avatar';
import { useDemoLimit } from '../../components/ui/demo-limit';
import { Modal } from '../../components/ui/modal';

type Row = {
  id: string;
  channel: 'WHATSAPP'|'EMAIL'|'INSTAGRAM'|'WEB';
  from: string;
  text: string;
  intent?: string;
  priority?: number;
  status?: string;
  lastCreatedAt?: string;
};

export function Inbox({ mode = 'live' as 'live'|'demo' }: { mode?: 'live'|'demo' }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<'recent'|'priority'|'status'>('recent');
  const router = useRouter();
  const { show } = useToast();
  const { max, remaining, consume } = useDemoLimit();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const waText = `Quiero info sobre el servicio de Monorepo Attention`;
  const waLink = phone ? `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(waText)}` : '';
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || '';
  const [buyOpen, setBuyOpen] = useState(false);

  useEffect(() => {
    if (mode === 'demo') {
      setRows([
        { id: 'demo-1', channel: 'WHATSAPP', from: '+54 9 261...', text: 'Hola, precio?', intent: 'SALES', priority: 2, status: 'OPEN', lastCreatedAt: new Date().toISOString() },
        { id: 'demo-2', channel: 'EMAIL', from: 'maria@example.com', text: '¿Horario de atención?', intent: 'INFO', priority: 3, status: 'OPEN', lastCreatedAt: new Date(Date.now()-3600e3).toISOString() },
      ]);
      setTotal(2);
      return;
    }
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (status) params.set('status', status);
    if (channel) params.set('channel', channel);
    params.set('page', String(page));
    params.set('pageSize', '10');
    params.set('sort', sort);
    fetch('/api/inbox?' + params.toString())
      .then((r) => r.json())
      .then((data: { items: Row[]; total: number }) => { setRows(data.items); setTotal(data.total); })
      .catch(() => {
        setRows([
          { id: '1', channel: 'WHATSAPP', from: '+54 9 261...', text: 'Hola, precio?', intent: 'SALES', priority: 2, status: 'OPEN' },
          { id: '2', channel: 'EMAIL', from: 'maria@example.com', text: '¿Horario de atención?', intent: 'INFO', priority: 3, status: 'OPEN' },
        ]);
      });
  }, [query, status, channel, page, sort, mode]);

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase();
    return (
      r.from.toLowerCase().includes(q) ||
      r.text.toLowerCase().includes(q) ||
      (r.intent ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid gap-3">
      <div className="grid gap-3">
        {mode === 'demo' && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 px-4 py-2 text-sm flex items-center justify-between gap-3">
            <span>Estás en modo demo. Acciones restantes: {remaining} de {max}.</span>
            <Button variant="outline" size="sm" onClick={() => setBuyOpen(true)}>Comprar ahora</Button>
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por remitente, texto o intención..."
              value={query}
              onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-sm opacity-70">Estado</div>
          <Segmented
            options={[
              { label: 'Todos', value: '' },
              { label: 'Open', value: 'OPEN' },
              { label: 'En curso', value: 'IN_PROGRESS' },
              { label: 'Resuelto', value: 'RESOLVED' },
            ]}
            value={status}
            onChange={(v) => { setPage(1); setStatus(v); }}
          />
          <div className="h-5 w-px bg-white/15" />
          <div className="text-sm opacity-70">Canal</div>
          <Segmented
            options={[
              { label: 'Todos', value: '' },
              { label: 'WhatsApp', value: 'WHATSAPP' },
              { label: 'Email', value: 'EMAIL' },
              { label: 'Instagram', value: 'INSTAGRAM' },
              { label: 'Web', value: 'WEB' },
            ]}
            value={channel}
            onChange={(v) => { setPage(1); setChannel(v); }}
          />
          <div className="h-5 w-px bg-white/15" />
          <div className="text-sm opacity-70">Ordenar</div>
          <Segmented
            options={[
              { label: 'Recientes', value: 'recent' },
              { label: 'Prioridad', value: 'priority' },
              { label: 'Estado', value: 'status' },
            ]}
            value={sort}
            onChange={(v) => { setPage(1); setSort(v as 'recent'|'priority'|'status'); }}
          />
        </div>
      </div>
      {filtered.map(r => (
        <Card
          key={r.id}
          className="cursor-pointer hover:bg-white/5 transition-colors"
          role="button"
          tabIndex={0}
          onClick={() => {
            if (mode === 'demo') {
              if (remaining <= 0) { show('Límite de demo alcanzado. Compra para continuar.', 'error'); return; }
              consume(1);
              router.push(`/demo/inbox/${r.id}`);
              return;
            }
            router.push(`/inbox/${r.id}`);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (mode === 'demo') {
                if (remaining <= 0) { show('Límite de demo alcanzado. Compra para continuar.', 'error'); return; }
                consume(1);
                router.push(`/demo/inbox/${r.id}`);
              } else {
                router.push(`/inbox/${r.id}`);
              }
            }
          }}
        >
          <CardContent>
            <div className="flex items-start gap-3">
              <Avatar name={r.from} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{r.channel}</Badge>
                    {r.intent && <Badge variant="outline">{r.intent}</Badge>}
                    {(() => {
                      const recent = r.lastCreatedAt ? (Date.now() - new Date(r.lastCreatedAt).getTime() < 1000 * 60 * 60 * 24) : false;
                      return recent ? <Badge variant="success">Nuevo</Badge> : null;
                    })()}
                  </div>
                  <div className="flex items-center gap-2 opacity-80">
                    <Badge variant="outline">prio {r.priority ?? '-'}</Badge>
                    <Badge variant={r.status === 'OPEN' ? 'warning' : 'secondary'}>{r.status}</Badge>
                  </div>
                </div>
                <div className="mt-1 font-medium truncate">{r.from}</div>
                <div className="opacity-80 truncate">{r.text}</div>
              </div>
              <div className="shrink-0 flex flex-col gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mode === 'demo') {
                      if (remaining <= 0) { show('Límite de demo alcanzado. Compra para continuar.', 'error'); return; }
                      consume(1);
                      router.push(`/demo/inbox/${r.id}`);
                      return;
                    }
                    router.push(`/inbox/${r.id}`);
                  }}
                >
                  Abrir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (mode === 'demo') { show('Acción limitada en demo', 'error'); return; }
                    try {
                      const res = await fetch(`/api/inbox/${r.id}/resolve`, { method: 'POST' });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data?.error || 'Error al resolver');
                      setRows((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'RESOLVED' } : x));
                      show('Conversación marcada como resuelta', 'success');
                    } catch (err: any) {
                      show('No se pudo marcar como resuelta', 'error');
                    }
                  }}
                >
                  Resolver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex items-center justify-between mt-2 text-sm opacity-80">
        <div>Total: {total}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
          <div className="px-2 py-1">Página {page}</div>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={rows.length < 10}>Siguiente</Button>
        </div>
      </div>
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
            {checkoutUrl ? (
              <a href={checkoutUrl} target="_blank" rel="noreferrer">
                <Button variant="default">Pagar ahora</Button>
              </a>
            ) : (
              <Button variant="default" disabled>Configurar Checkout</Button>
            )}
          </>
        }
      >
        <p className="mb-2">Podés hablar con el coordinador (WhatsApp) o pagar con tarjeta/MercadoPago.</p>
        <p className="text-xs opacity-80">Atención 24/7 y soporte prioritario.</p>
      </Modal>
    </div>
  );
}
