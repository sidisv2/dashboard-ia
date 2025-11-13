import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import Shell from '../../ui/shell';
import Link from 'next/link';
import { Tabs } from '../../../components/ui/tabs';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import ReplyForm from './reply-form';
import { prisma } from '../../../lib/prisma';

export default async function InboxDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;
  const email = session?.user?.email || 'anon@local';

  // Cargar conversación y, si no tiene owner/sequence, asignarlos secuencialmente por usuario
  let conv = await prisma.conversation.findUnique({
    where: { id },
    include: { contact: true, messages: { orderBy: { createdAt: 'asc' } } },
  });

  if (!conv) {
    return (
      <Shell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Conversación no encontrada</h1>
          <Link className="px-3 py-1 rounded-xl border" href="/inbox">Volver al Inbox</Link>
        </div>
      </Shell>
    );
  }

  if (!conv.ownerEmail || !conv.sequence || conv.sequence === 0) {
    const agg = await prisma.conversation.aggregate({
      _max: { sequence: true },
      where: { ownerEmail: email },
    });
    const nextSeq = (agg._max.sequence ?? 0) + 1;
    conv = await prisma.conversation.update({
      where: { id },
      data: { ownerEmail: email, sequence: nextSeq },
      include: { contact: true, messages: { orderBy: { createdAt: 'asc' } } },
    });
  }

  const seqLabel = `#${String(conv.sequence ?? 0).padStart(2, '0')}`;

  return (
    <Shell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Conversación {seqLabel}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">prio 2</Badge>
          <Badge variant="warning">OPEN</Badge>
          <div className="text-sm opacity-70">{session?.user?.email}</div>
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: 'messages',
            label: 'Mensajes',
            content: (
              <div className="grid gap-3">
                {conv.messages.map((m) => (
                  <Card key={m.id}>
                    <CardContent>
                      <div className="text-sm opacity-70">{m.direction === 'INBOUND' ? 'Cliente' : 'Agente'}</div>
                      <div>{m.content}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: 'customer',
            label: 'Cliente',
            content: (
              <Card>
                <CardContent>
                  <div className="grid gap-1">
                    <div className="text-sm opacity-70">Nombre</div>
                    <div className="font-medium">{conv.contact.name ?? 'Sin nombre'}</div>
                    <div className="text-sm opacity-70 mt-2">Contacto</div>
                    <div className="font-medium">{conv.contact.handle ?? '-'}</div>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            id: 'reply',
            label: 'Responder',
            content: (
              <ReplyForm lastMessage={conv.messages[conv.messages.length - 1]?.content ?? ''} context={`Conversación ${seqLabel}`}/>
            ),
          },
        ]}
        defaultTab="messages"
      />

      <div className="mt-6">
        <Link className="px-3 py-1 rounded-xl border" href="/inbox">Volver al Inbox</Link>
      </div>
    </Shell>
  );
}
