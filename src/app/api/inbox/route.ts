import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase();
    const status = searchParams.get('status') || undefined;
    const channel = searchParams.get('channel') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));
    const sort = (searchParams.get('sort') || 'recent') as 'recent' | 'priority' | 'status';

    const count = await prisma.conversation.count();
    if (count === 0) {
      // Seed inicial
      const contact = await prisma.contact.create({
        data: { name: 'María Pérez', handle: 'maria@example.com', channel: 'EMAIL' },
      });
      const conv = await prisma.conversation.create({
        data: { contactId: contact.id, status: 'OPEN' },
      });
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          direction: 'INBOUND',
          channel: contact.channel,
          content: 'Hola, precio?',
          intent: 'SALES',
          priority: 2,
        },
      });
    }

    const where: any = {};
    if (status) where.status = status;
    if (channel) where.contact = { channel };

    // Filtro q en contacto o último mensaje
    // Primero buscamos conversaciones, luego filtramos en memoria si hay q
    const total = await prisma.conversation.count({ where });

    const convs = await prisma.conversation.findMany({
      where,
      include: {
        contact: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy:
        sort === 'recent'
          ? { updatedAt: 'desc' }
          : sort === 'status'
            ? { status: 'asc' }
            : undefined,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    let rows = convs.map((c: any) => {
      const last = c.messages[0];
      return {
        id: c.id,
        channel: c.contact.channel,
        from: c.contact.handle ?? c.contact.name ?? 'Desconocido',
        text: last?.content ?? '',
        intent: last?.intent ?? undefined,
        priority: last?.priority ?? undefined,
        status: c.status,
        lastCreatedAt: last?.createdAt ?? c.updatedAt,
        sequence: c.sequence,
        ownerEmail: c.ownerEmail ?? null,
      };
    });

    if (q) {
      const ql = q.toLowerCase();
      rows = rows.filter((r) =>
        r.from.toLowerCase().includes(ql) ||
        r.text.toLowerCase().includes(ql) ||
        (r.intent ?? '').toLowerCase().includes(ql)
      );
    }

    if (sort === 'priority') {
      rows.sort((a: any, b: any) => (b.priority ?? -1) - (a.priority ?? -1));
    }

    return NextResponse.json({ items: rows, total, page, pageSize });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
