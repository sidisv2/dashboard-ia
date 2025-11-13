import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session: any = await getServerSession(authOptions as any);
    const email: string | undefined = session?.user?.email;
    if (!email) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const price = Number(body?.price ?? process.env.MP_MONTHLY_PRICE ?? 29);
    const reason = body?.reason ?? process.env.MP_PLAN_MONTHLY_TITLE ?? 'Monorepo Attention Mensual';
    const backUrl = process.env.MP_RETURN_URL_SUCCESS || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return NextResponse.json({ error: 'Falta MP_ACCESS_TOKEN' }, { status: 500 });

    // Crear preapproval (débitos automáticos mensuales)
    const payload = {
      payer_email: email,
      reason,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: price,
        currency_id: 'USD',
      },
      back_url: backUrl,
      status: 'pending',
      external_reference: email,
    };

    const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await mpRes.json();
    if (!mpRes.ok) {
      return NextResponse.json({ error: data?.message || 'Error creando preapproval' }, { status: mpRes.status });
    }

    // Guardar/actualizar suscripción
    await (prisma as any).subscription.upsert({
      where: { mpPreapprovalId: data.id },
      update: {
        status: data.status || 'pending',
        price,
        nextPaymentDate: data.auto_recurring?.next_payment_date ? new Date(data.auto_recurring.next_payment_date) : null,
        userEmail: email,
      },
      create: {
        mpPreapprovalId: data.id,
        status: data.status || 'pending',
        price,
        nextPaymentDate: data.auto_recurring?.next_payment_date ? new Date(data.auto_recurring.next_payment_date) : null,
        userEmail: email,
      },
    });

    return NextResponse.json({ id: data.id, init_point: data.init_point, back_url: data.back_url, status: data.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
