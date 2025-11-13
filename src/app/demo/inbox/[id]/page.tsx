"use client";
import Shell from '../../../ui/shell';
import { useParams, useRouter } from 'next/navigation';
import { useDemoLimit } from '../../../../components/ui/demo-limit';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Modal } from '../../../../components/ui/modal';
import Link from 'next/link';
import * as React from 'react';

export default function DemoInboxDetail() {
  const params = useParams();
  const id = String(params?.id || 'demo-1');
  const { max, remaining, consume } = useDemoLimit();
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const waText = `Vas a hablar con el coordinador para resolver dudas futuras o actuales sobre el producto que vas a recibir, recuerda que sos nuestra prioridad.`;
  const waLink = phone ? `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(waText)}` : '';

  const requireCredits = (n = 1) => {
    if (remaining <= 0) { setOpen(true); return false; }
    consume(n);
    return true;
  };

  const onSuggest = () => {
    if (!requireCredits(1)) return;
    setValue('¡Hola! Gracias por escribirnos. El precio es $X por unidad. ¿Cuántas unidades te interesan?');
  };

  const onSend = () => {
    if (!requireCredits(1)) return;
    setOpen(true);
  };

  return (
    <Shell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Conversación demo #{id.replace('demo-','')}</h1>
        <div className="text-sm opacity-70">Acciones restantes: {remaining} de {max}</div>
      </div>

      <div className="grid gap-3">
        {[{ who: 'Cliente', text: 'Hola, precio?' }, { who: 'Agente', text: 'Hola! ¿Cuántas unidades necesitas?' }].map((m, i) => (
          <Card key={i}>
            <CardContent>
              <div className="text-sm opacity-70">{m.who}</div>
              <div>{m.text}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <form className="grid gap-2 mt-4" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
        <div>
          <Label htmlFor="respuesta">Respuesta</Label>
          <Textarea id="respuesta" placeholder="Escribe tu mensaje..." rows={6} value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="default">Enviar</Button>
          <Button type="button" variant="outline" onClick={onSuggest}>Sugerir con IA</Button>
          <Link className="px-3 py-2 rounded-xl border" href="/demo">Volver</Link>
        </div>
      </form>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Límite de demo alcanzado"
        actions={waLink ? (
          <a href={waLink} target="_blank" rel="noreferrer">
            <Button variant="default">Comprar ahora</Button>
          </a>
        ) : (
          <Button variant="default" disabled>Configura WhatsApp</Button>
        )}
      >
        <p>Para continuar, contrata el plan. Vas a hablar con el coordinador para resolver dudas futuras o actuales. ¡Sos nuestra prioridad!</p>
      </Modal>
    </Shell>
  );
}
