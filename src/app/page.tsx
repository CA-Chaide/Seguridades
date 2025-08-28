'use client';

import { useState } from 'react';
import {
  AppShell,
  AppShellHeader,
  AppShellContent,
} from '@/components/layout/app-shell';
import { initialMenuItems, initialRoles } from '@/lib/data';
import type { MenuItem, Role } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuDesigner } from '@/components/menu-designer';
import { RoleManager } from '@/components/role-manager';
import { AiSuggester } from '@/components/ai-suggester';
import { MenuPreview } from '@/components/menu-preview';
import { Logo } from '@/components/icons';
import { LayoutDashboard, Users, Bot, Eye, Settings } from 'lucide-react';

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [roles, setRoles] = useState<Role[]>(initialRoles);

  return (
    <AppShell>
      <AppShellHeader>
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">MenuGuard</h1>
        </div>
      </AppShellHeader>
      <AppShellContent>
        <div className="p-4 md:p-6 lg:p-8">
          <Tabs defaultValue="designer" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 h-auto mb-6 md:grid-cols-4 md:h-12">
              <TabsTrigger value="designer" className="py-2.5">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Designer
              </TabsTrigger>
              <TabsTrigger value="roles" className="py-2.5">
                <Users className="w-4 h-4 mr-2" />
                Roles
              </TabsTrigger>
              <TabsTrigger value="ai-suggester" className="py-2.5">
                <Bot className="w-4 h-4 mr-2" />
                AI Assist
              </TabsTrigger>
              <TabsTrigger value="preview" className="py-2.5">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="designer">
              <MenuDesigner
                menuItems={menuItems}
                setMenuItems={setMenuItems}
                roles={roles}
              />
            </TabsContent>
            <TabsContent value="roles">
              <RoleManager roles={roles} setRoles={setRoles} />
            </TabsContent>
            <TabsContent value="ai-suggester">
              <AiSuggester />
            </TabsContent>
            <TabsContent value="preview">
              <MenuPreview menuItems={menuItems} roles={roles} />
            </TabsContent>
          </Tabs>
        </div>
      </AppShellContent>
    </AppShell>
  );
}
