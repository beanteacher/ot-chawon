'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { Header } from '@/components/layout';
import { Sidebar } from '@/components/layout';

interface SidebarContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({ open: false, setOpen: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <Header onMenuOpen={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      {children}
    </SidebarContext.Provider>
  );
}
