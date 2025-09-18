"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardCheck, MessageSquare, BookText, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/test', icon: ClipboardCheck, label: 'Test' },
  { href: '/chatbot', icon: MessageSquare, label: 'Chat' },
  { href: '/helpline', icon: HeartPulse, label: 'Helpline' },
  { href: '/resources', icon: BookText, label: 'Resources' },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-sm border-t border-border/80 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] md:hidden">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center flex-1 text-muted-foreground transition-colors hover:text-primary">
              <item.icon className={cn('h-6 w-6', isActive && 'text-primary')} />
              <span className={cn('text-xs mt-1', isActive && 'text-primary font-medium')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
