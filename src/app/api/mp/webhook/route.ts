import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  const got = req.headers.get('x-webhook-secret') || req.nextUrl.searchParams.get('secret');
  if (!secret || got !== secret) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const event = await req.json();
    // Mercado Pago envía diferentes formatos. Consideramos preapproval y payments.
    const type = event?.type || event?.action || event?.topic;

    if (type?.includes('preapproval')) {
      const preapprovalId = event?.data?.id || event?.resource?.id || event?.id;
      if (preapprovalId) {
        // Obtener detalle de preapproval para conocer estado, payer_email y next_payment_date
        const accessToken = process.env.MP_ACCESS_TOKEN!;
        const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const info = await res.json();
        const status = info?.status || 'pending';
        const nextPaymentDate = info?.auto_recurring?.next_payment_date ? new Date(info.auto_recurring.next_payment_date) : null;
        const userEmail = info?.payer_email || info?.payer?.email || null;
        const price = info?.auto_recurring?.transaction_amount ?? null;

        // Upsert para asegurar que quede asociada al usuario por email
        await (prisma as any).subscription.upsert({
          where: { mpPreapprovalId: preapprovalId },
          update: { status, nextPaymentDate, price: price ?? undefined, userEmail: userEmail ?? undefined },
          create: {
            mpPreapprovalId: preapprovalId,
            status,
            nextPaymentDate,
            price,
            userEmail: userEmail ?? undefined,
          },
        });
      }
    }

    if (type?.includes('authorized_payment') || type?.includes('payment')) {
      // Futuro: registrar pagos si se requiere
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
