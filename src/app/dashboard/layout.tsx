
import { AppShell, AppShellContent, AppShellHeader } from '@/components/layout/app-shell';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar-new';
import Image from 'next/image';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, BookUser, Shield, Users, Settings, Building, MenuSquare, UserCog, UserPlus, Minus } from 'lucide-react';
import React from 'react';


const menuItems = [
    {
        label: 'M. Seguridades',
        icon: Shield,
        children: [
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
            }
        ]
    }
];

const RecursiveMenu = ({ items, level = 0 }: { items: any[], level?: number }) => {
    return (
        <div className="w-full" style={{ paddingLeft: level > 0 ? '1rem' : '0' }}>
            {items.map((item, index) => (
                <Collapsible key={index} className="w-full">
                    {item.children ? (
                        <>
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
                                <RecursiveMenu items={item.children} level={level + 1} />
                            </CollapsibleContent>
                        </>
                    ) : (
                        <SidebarMenuItem>
                            <SidebarMenuButton href={item.path || '#'} className="justify-start pl-4 h-9">
                                <item.icon className="h-4 w-4 mr-2" />
                                {item.label}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </Collapsible>
            ))}
        </div>
    );
};


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
                        <Image src="/img/logo_chaide.svg" alt="Chaide Logo" width={150} height={40} />
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                         <RecursiveMenu items={menuItems} />
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <div className="flex flex-col flex-1">
                {children}
            </div>
        </div>
    )
}
