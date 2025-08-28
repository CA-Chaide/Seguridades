
'use client';

import { useState } from 'react';
import { initialRoles, initialMenuItems } from '@/lib/data';
import type { Role, MenuItem } from '@/lib/types';
import { AppShell, AppShellContent, AppShellHeader } from '@/components/layout/app-shell';
import { RoleManager } from '@/components/role-manager';
import { MenuDesigner } from '@/components/menu-designer';
import { AiSuggester } from '@/components/ai-suggester';
import { MenuPreview } from '@/components/menu-preview';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Bot, PencilRuler, Eye } from 'lucide-react';

export default function DashboardPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  return (
    <AppShell>
      <AppShellHeader>
        <div className="flex h-full items-center">
          <h1 className="text-xl font-bold">Panel de Administración de Seguridad</h1>
        </div>
      </AppShellHeader>
      <AppShellContent>
        <div className="p-4 md:p-8">
            <Tabs defaultValue="roles">
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
                    <TabsTrigger value="roles"><Shield className="mr-2" /> Roles</TabsTrigger>
                    <TabsTrigger value="designer"><PencilRuler className="mr-2" /> Diseñador de Menú</TabsTrigger>
                    <TabsTrigger value="preview"><Eye className="mr-2" /> Vista Previa de Menú</TabsTrigger>
                    <TabsTrigger value="ai-suggester"><Bot className="mr-2" /> Sugerencias con IA</TabsTrigger>
                </TabsList>

                <TabsContent value="roles">
                    <RoleManager roles={roles} setRoles={setRoles} />
                </TabsContent>

                <TabsContent value="designer">
                    <MenuDesigner menuItems={menuItems} setMenuItems={setMenuItems} roles={roles} />
                </TabsContent>

                <TabsContent value="preview">
                    <MenuPreview menuItems={menuItems} roles={roles} />
                </TabsContent>

                <TabsContent value="ai-suggester">
                    <AiSuggester />
                </TabsContent>
            </Tabs>
        </div>
      </AppShellContent>
    </AppShell>
  );
}
