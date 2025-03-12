'use client'

import { usePathname } from 'next/navigation'
import { Nav } from '@/components/Nav'

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatRoute = pathname === '/chat' || pathname.startsWith('/chat/');
  
  return (
    <div className="relative">
      {!isChatRoute && <Nav />}
      {children}
    </div>
  );
}
