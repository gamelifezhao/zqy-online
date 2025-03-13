'use client'

import { usePathname } from 'next/navigation'
import { Nav } from '@/components/Nav'

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatRoute = pathname === '/chat' || pathname.startsWith('/chat/');
  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  const isWorkflowEditorRoute = pathname === '/workflow-editor' || pathname.startsWith('/workflow-editor/');
  return (
    <div className="relative">
      {!isChatRoute && !isDashboardRoute && !isWorkflowEditorRoute && <Nav />}
      {children}
    </div>
  );
}
