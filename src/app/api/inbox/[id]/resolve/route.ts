import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const conv = await prisma.conversation.update({
      where: { id },
      data: { status: 'RESOLVED', updatedAt: new Date() },
    });
    return NextResponse.json({ ok: true, id: conv.id, status: conv.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
