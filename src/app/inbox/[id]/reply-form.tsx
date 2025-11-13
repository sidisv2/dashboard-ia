'use client';
import * as React from 'react';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/toast';

export default function ReplyForm({ lastMessage, context }: { lastMessage: string; context?: string }) {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { show } = useToast();

  const onSuggest = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/ia/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: lastMessage, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al generar sugerencia');
      setValue(data.text || '');
      show('Sugerencia generada', 'success');
    } catch (e: any) {
      setError(e?.message || 'Error inesperado');
      show('No se pudo generar la sugerencia', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(window.location.pathname + '/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al enviar');
      show('Mensaje enviado', 'success');
      setValue('');
    } catch (e: any) {
      setError(e?.message || 'Error inesperado');
      show('No se pudo enviar el mensaje', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-2" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="respuesta">Respuesta</Label>
        <Textarea
          id="respuesta"
          placeholder="Escribe tu mensaje..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={6}
        />
      </div>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <div className="flex gap-2">
        <Button type="submit" variant="default" disabled={loading || !value.trim()}>Enviar</Button>
        <Button type="button" variant="outline" onClick={onSuggest} disabled={loading}>
          {loading ? 'Generando…' : 'Sugerir con IA'}
        </Button>
      </div>
    </form>
  );
}
