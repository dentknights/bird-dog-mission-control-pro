'use client';

import { Bell, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="h-16 bg-[var(--bd-bg-secondary)]/80 backdrop-blur-md border-b border-[var(--bd-border-color)] flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <Zap className="h-3 w-3 mr-1" />
          System Online
        </Badge>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-[var(--bd-text-secondary)] hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--bd-cyan)] rounded-full animate-pulse" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-9 w-9 border-2 border-[var(--bd-border-color)] cursor-pointer">
              <AvatarFallback className="bg-[var(--bd-bg-tertiary)] text-[var(--bd-cyan)]">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--bd-bg-secondary)] border-[var(--bd-border-color)]">
            <DropdownMenuItem className="text-[var(--bd-text-secondary)] hover:text-white hover:bg-[var(--bd-bg-tertiary)]">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--bd-text-secondary)] hover:text-white hover:bg-[var(--bd-bg-tertiary)]">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--bd-text-secondary)] hover:text-white hover:bg-[var(--bd-bg-tertiary)]">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
