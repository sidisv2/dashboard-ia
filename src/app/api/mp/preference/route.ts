import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { months, price, title } = await req.json();
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return NextResponse.json({ error: 'Falta MP_ACCESS_TOKEN' }, { status: 500 });

    const qty = Number(months);
    const unitPrice = Number(price);
    if (!qty || !unitPrice) {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
    }

    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const webhookUrl = process.env.MP_WEBHOOK_URL || `${siteUrl}/api/mp/webhook`;

    const payload: any = {
      items: [
        {
          title: title || `Monorepo Attention — ${qty} meses`,
          quantity: qty,
          unit_price: unitPrice,
          currency_id: 'USD',
        },
      ],
      back_urls: {
        success: `${siteUrl}/home?status=success`,
        failure: `${siteUrl}/home?status=failure`,
        pending: `${siteUrl}/home?status=pending`,
      },
      auto_return: 'approved',
      statement_descriptor: 'MONOREPO-ATTN',
    };

    payload.notification_url = webhookUrl;

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.message || 'Error creando preferencia' }, { status: res.status });
    }

    return NextResponse.json({ id: data.id, init_point: data.init_point, sandbox_init_point: data.sandbox_init_point });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
