'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Film, Users, FileText, Rocket, 
  Library, Settings, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/episodes', label: 'Episodes', icon: Film },
  { href: '/characters', label: 'Characters', icon: Users },
  { href: '/script-builder', label: 'Script Builder', icon: FileText },
  { href: '/mission-control', label: 'Mission Control', icon: Rocket },
  { href: '/assets', label: 'Asset Library', icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'h-screen bg-[var(--bd-bg-secondary)] border-r border-[var(--bd-border-color)] flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[var(--bd-border-color)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0 glow-cyan">
              BD
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg text-white">Bird Dog</h1>
                <p className="text-xs text-[var(--bd-text-muted)]">Mission Control</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive 
                        ? 'bg-[var(--bd-cyan)]/10 text-[var(--bd-cyan)] border-r-2 border-[var(--bd-cyan)]' 
                        : 'text-[var(--bd-text-secondary)] hover:bg-[var(--bd-bg-tertiary)] hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {!sidebarOpen && (
                  <TooltipContent side="right" className="bg-[var(--bd-bg-tertiary)] border-[var(--bd-border-color)]">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Settings & Collapse */}
        <div className="p-2 border-t border-[var(--bd-border-color)]">
          <Tooltip>
            <TooltipTrigger>
              <Link
                href="/settings"
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                  pathname === '/settings'
                    ? 'bg-[var(--bd-cyan)]/10 text-[var(--bd-cyan)]'
                    : 'text-[var(--bd-text-secondary)] hover:bg-[var(--bd-bg-tertiary)] hover:text-white'
                )}
              >
                <Settings className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="font-medium">Settings</span>}
              </Link>
            </TooltipTrigger>
            {!sidebarOpen && (
              <TooltipContent side="right" className="bg-[var(--bd-bg-tertiary)] border-[var(--bd-border-color)]">
                Settings
              </TooltipContent>
            )}
          </Tooltip>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full mt-2 text-[var(--bd-text-muted)] hover:text-white hover:bg-[var(--bd-bg-tertiary)]"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
