import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { text } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }
    const conv = await prisma.conversation.findUnique({ where: { id }, include: { contact: true } });
    if (!conv) return NextResponse.json({ error: 'Conversación no encontrada' }, { status: 404 });

    const msg = await prisma.message.create({
      data: {
        conversationId: id,
        direction: 'OUTBOUND',
        channel: conv.contact.channel,
        content: text,
      },
    });
    await prisma.conversation.update({ where: { id }, data: { updatedAt: new Date(), status: 'IN_PROGRESS' } });
    return NextResponse.json({ ok: true, id, messageId: msg.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
