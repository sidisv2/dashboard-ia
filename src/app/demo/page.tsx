"use client";
import Shell from '../ui/shell';
import { Inbox } from '../ui/inbox';

export default function DemoHome() {
  return (
    <Shell>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Demo</h1>
        <p className="opacity-80 text-sm">Explora el inbox en modo demo. Algunas acciones están limitadas.</p>
      </div>
      <Inbox mode="demo" />
    </Shell>
  );
}
