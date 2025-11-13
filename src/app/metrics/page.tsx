import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import Shell from '../ui/shell';
import { prisma } from '../../lib/prisma';

function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!email) return false;
  return list.includes(email);
}

export default async function MetricsPage() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return (
      <Shell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">No autorizado</h1>
          <p className="opacity-80">Tu usuario no tiene permisos para ver Métricas.</p>
        </div>
      </Shell>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total, open, inProgress, resolved, msgsToday] = await Promise.all([
    prisma.conversation.count(),
    prisma.conversation.count({ where: { status: 'OPEN' } }),
    prisma.conversation.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.conversation.count({ where: { status: 'RESOLVED' } }),
    prisma.message.count({ where: { createdAt: { gte: today } } }),
  ]);

  return (
    <Shell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Métricas</h1>
        <div className="text-sm opacity-70">{session?.user?.email}</div>
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Conversaciones totales</div>
          <div className="text-3xl font-bold">{total}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Abiertas</div>
          <div className="text-3xl font-bold">{open}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">En curso</div>
          <div className="text-3xl font-bold">{inProgress}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Resueltas</div>
          <div className="text-3xl font-bold">{resolved}</div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Mensajes hoy</div>
          <div className="text-3xl font-bold">{msgsToday}</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Tiempo medio primera respuesta</div>
          <div className="text-3xl font-bold">-</div>
        </div>
        <div className="rounded-2xl border p-4">
          <div className="text-sm opacity-70">Satisfacción</div>
          <div className="text-3xl font-bold">-</div>
        </div>
      </div>
    </Shell>
  );
}
