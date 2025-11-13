import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import Shell from '../ui/shell';
import { Inbox } from '../ui/inbox';
import { Input } from '../../components/ui/input';

export default async function InboxPage() {
  const session = await getServerSession(authOptions);
  return (
    <Shell>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <div className="flex-1 max-w-md">
          <Input placeholder="Buscar por remitente o texto..." />
        </div>
        <div className="text-sm opacity-70 hidden md:block">{session?.user?.email}</div>
      </div>
      <Inbox />
    </Shell>
  );
}
