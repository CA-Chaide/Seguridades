
import { AppShell, AppShellContent, AppShellHeader } from '@/components/layout/app-shell';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar-new';
import Image from 'next/image';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown, BookUser, Shield, Users, Settings, Building, MenuSquare, UserCog, UserPlus } from 'lucide-react';


const menuItems = [
    {
      label: 'Catálogos',
      icon: BookUser,
      children: [
        { label: 'Perfiles', path: '/dashboard/profiles', icon: Shield },
        { label: 'Tipos de Roles', path: '/dashboard/role-types', icon: Shield },
        { label: 'Tipos de Usuarios', path: '/dashboard/user-types', icon: Users },
      ],
    },
    {
      label: 'Opciones',
      icon: Settings,
      children: [
        { label: 'Aplicación-Perfiles', path: '/dashboard/app-profiles', icon: Building },
        { label: 'Aplicaciones', path: '/dashboard/applications', icon: Building },
        { label: 'Menú', path: '/dashboard/menu', icon: MenuSquare },
        { label: 'Tipos de Usuarios - Perfiles', path: '/dashboard/user-type-profiles', icon: UserCog },
        { label: 'Usuarios', path: '/dashboard/users', icon: Users },
        { label: 'Usuarios Masivos', path: '/dashboard/bulk-users', icon: UserPlus },
      ],
    },
];

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex justify-center items-center py-4">
                        <Image src="/img/logo_chaide_white.svg" alt="Chaide Logo" width={150} height={40} />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {menuItems.map((item, index) => (
                             <Collapsible key={index} className="w-full">
                                <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between w-full p-2 rounded-md hover:bg-primary/80">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.label}</span>
                                        </div>
                                        <ChevronsUpDown className="h-4 w-4" />
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="pl-4 py-1 space-y-1">
                                    {item.children.map((child, childIndex) => (
                                        <SidebarMenuItem key={childIndex}>
                                            <SidebarMenuButton href={child.path} className="justify-start pl-4 h-9">
                                                <child.icon className="h-4 w-4 mr-2"/>
                                                {child.label}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                    </div>
                                </CollapsibleContent>
                             </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <div className="flex flex-col flex-1">
                {children}
            </div>
        </div>
    )
  }
  
