"use client";

import React, { useEffect, useState } from 'react';
import { MenuDesigner } from '@/components/menu-designer';
import { aplicacionService } from '@/services/aplicacion.service';
import { tipoUsuarioService } from '@/services/tipoUsuario.service';
import { menuService } from '@/services/menu.service';
import { menuTipoUsuarioService } from '@/services/menuTipoUsuario.service';
import type { Menu as BackMenu, MenuTipoUsuario, Aplicacion, TipoUsuario } from '@/types/interfaces';
import type { MenuItem, Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function buildTree(flat: BackMenu[]): BackMenu[] {
  const byId = new Map<number, BackMenu & { children?: BackMenu[] }>();
  for (const m of flat) byId.set(m.codigo_menu, { ...m, children: [] });
  const roots: (BackMenu & { children?: BackMenu[] })[] = [];
  for (const m of byId.values()) {
    if (m.codigo_padre == null || m.codigo_padre === 0) {
      roots.push(m);
    } else {
      const parent = byId.get(m.codigo_padre);
      if (parent) parent.children = parent.children || [] , parent.children.push(m);
      else roots.push(m); // fallback
    }
  }
  return roots;
}

function backendToMenuItem(node: BackMenu & { children?: BackMenu[] }, menuTipoUsuarios: MenuTipoUsuario[] = []): MenuItem {
  const roles = menuTipoUsuarios
    .filter(mtu => mtu.codigo_menu === node.codigo_menu)
    .map(mtu => String(mtu.codigo_tipo_usuario));
  return {
    id: String(node.codigo_menu),
    label: node.nombre,
    icon: node.icono || 'Minus',
    path: node.path,
    roles,
    children: node.children && node.children.length ? node.children.map((c: BackMenu) => backendToMenuItem(c, menuTipoUsuarios)) : undefined,
  };
}

function flattenMenuItems(items: MenuItem[], parentId: number | null = null): MenuItem[] {
  const out: MenuItem[] = [];
  for (const it of items) {
    out.push({ ...it });
    if (it.children && it.children.length) out.push(...flattenMenuItems(it.children, Number(it.id)));
  }
  return out;
}

export default function MenuPage() {
  const [apps, setApps] = useState<Aplicacion[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [existingFlatMenus, setExistingFlatMenus] = useState<BackMenu[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const appsResp = await aplicacionService.getAll();
        setApps(appsResp.data || []);
        const rolesResp = await tipoUsuarioService.getAll();
        // map TipoUsuario -> Role shape
        setRoles((rolesResp.data || []).map(r => ({ id: String(r.codigo_tipo_usuario), name: r.nombre_tipo_usuario, description: '' })));
      } catch (err: any) {
        console.error('Cargar apps/roles', err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedApp) return;
  const loadMenusForApp = async () => {
      try {
        // load all menus and filter by application
        const allResp = await menuService.getAll();
        const all = (allResp && (allResp as any).data) ? (allResp as any).data : (allResp as any);
        const flat: BackMenu[] = (all || []).filter((m: BackMenu) => String(m.codigo_aplicacion) === String(selectedApp));
        // if no root (path === '.') create one
        const root = flat.find(f => f.path === '.');
        let finalFlat = flat;
        if (!root) {
          // get application name
          const app = apps.find(a => String(a.codigo_aplicacion) === String(selectedApp));
          const payload: BackMenu = {
            codigo_menu: 0 as any,
            codigo_padre: null as any,
            nombre: app ? app.nombre_aplicacion : 'Root',
            icono: 'FolderRoot',
            path: '.',
            estado: 'A',
            codigo_aplicacion: String(selectedApp),
          };
          const saveResp = await menuService.save(payload as any);
          const saved = (saveResp as any)?.data || saveResp;
          // re-fetch all menus
          const allResp2 = await menuService.getAll();
          const all2 = (allResp2 && (allResp2 as any).data) ? (allResp2 as any).data : (allResp2 as any);
          finalFlat = (all2 || []).filter((m: BackMenu) => String(m.codigo_aplicacion) === String(selectedApp));
          toast({ title: 'Root creado', description: `Se creó el menú raíz para la aplicación ${payload.nombre}` });
        }
        setExistingFlatMenus(finalFlat);
        // build tree
        const tree = buildTree(finalFlat as BackMenu[]);
        // load menu-tipo-usuario associations to map roles
        const mtusResp = await menuTipoUsuarioService.getAll();
        const mtus = (mtusResp && (mtusResp as any).data) ? (mtusResp as any).data : (mtusResp as any);
        // map to MenuItem
        const mapped: MenuItem[] = tree.map((n: BackMenu) => backendToMenuItem(n, mtus || []));
        setMenuItems(mapped);
      } catch (err: any) {
        // if API returns textual 404 message, create root as fallback
        console.error('loadMenusForApp', err);
        toast({ title: 'Error', description: String(err?.message || err) });
      }
    };
    loadMenusForApp();
    // expose reload function to child via ref-like state (we pass as prop when rendering)
    // nothing else here
  }, [selectedApp, apps, toast]);

  // create a stable refresh function to pass to MenuDesigner
  const refreshMenus = async () => {
    if (!selectedApp) return;
    try {
      const allResp = await menuService.getAll();
      const all = (allResp && (allResp as any).data) ? (allResp as any).data : (allResp as any);
      const flat: BackMenu[] = (all || []).filter((m: BackMenu) => String(m.codigo_aplicacion) === String(selectedApp));
      setExistingFlatMenus(flat);
      const tree = buildTree(flat as BackMenu[]);
      const mtusResp = await menuTipoUsuarioService.getAll();
      const mtus = (mtusResp && (mtusResp as any).data) ? (mtusResp as any).data : (mtusResp as any);
      const mapped: MenuItem[] = tree.map((n: BackMenu) => backendToMenuItem(n, mtus || []));
      setMenuItems(mapped);
    } catch (err: any) {
      console.error('refreshMenus', err);
      toast({ title: 'Error', description: String(err?.message || err) });
    }
  };

  // mass-save removed: menu is transactional and saved live.

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Aplicación</label>
        <select className="rounded-md p-2 border" value={selectedApp || ''} onChange={e => setSelectedApp(e.target.value || null)}>
          <option value="">-- Seleccione --</option>
          {apps.map(a => (
            <option key={a.codigo_aplicacion} value={String(a.codigo_aplicacion)}>{a.nombre_aplicacion}</option>
          ))}
        </select>
        <div className="ml-auto">
          {/* mass-save button removed because the designer persists to backend in real-time */}
        </div>
      </div>

      <div>
  <MenuDesigner menuItems={menuItems} setMenuItems={setMenuItems} selectedApp={selectedApp} refreshMenus={refreshMenus} />
      </div>
    </div>
  );
}
