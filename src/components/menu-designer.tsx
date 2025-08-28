'use client';

import type { Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import type { MenuItem, Role } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import * as LucideIcons from 'lucide-react';
import { PlusCircle, Edit, Trash2, GripVertical, CornerDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const Icon = ({ name, className }: { name: string; className?: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.Minus className={className} />;
  return <LucideIcon className={className} />;
};

interface MenuItemFormProps {
    item: Partial<MenuItem> | null;
    roles: Role[];
    onSave: (item: Partial<MenuItem>) => void;
    onClose: () => void;
}

function MenuItemForm({ item, roles, onSave, onClose }: MenuItemFormProps) {
    const [label, setLabel] = useState(item?.label || '');
    const [path, setPath] = useState(item?.path || '');
    const [icon, setIcon] = useState(item?.icon || 'Minus');
    const [selectedRoles, setSelectedRoles] = useState<string[]>(item?.roles || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: item?.id, label, path, icon, roles: selectedRoles });
    };

    const handleRoleChange = (roleId: string, checked: boolean) => {
        setSelectedRoles(prev => 
            checked ? [...prev, roleId] : prev.filter(id => id !== roleId)
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>{item?.id ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input id="label" value={label} onChange={e => setLabel(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="path">Path</Label>
                    <Input id="path" value={path} onChange={e => setPath(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="icon">Icon Name</Label>
                    <Input id="icon" value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g., Home, Settings" />
                    <p className="text-xs text-muted-foreground">Use any icon name from <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline text-primary">lucide.dev</a>.</p>
                </div>
                <div className="space-y-2">
                    <Label>Accessible Roles</Label>
                    <ScrollArea className="h-48">
                        <div className="grid grid-cols-2 gap-2 p-4 border rounded-md">
                            {roles.map(role => (
                                <div key={role.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`role-${role.id}-${item?.id || 'new'}`}
                                        checked={selectedRoles.includes(role.id)}
                                        onCheckedChange={(checked) => handleRoleChange(role.id, !!checked)}
                                    />
                                    <label htmlFor={`role-${role.id}-${item?.id || 'new'}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Save</Button>
            </DialogFooter>
        </form>
    );
}

interface MenuDesignerProps {
    menuItems: MenuItem[];
    setMenuItems: Dispatch<SetStateAction<MenuItem[]>>;
    roles: Role[];
}

export function MenuDesigner({ menuItems, setMenuItems, roles }: MenuDesignerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
    const [parentId, setParentId] = useState<string | null>(null);

    const openDialog = (item: Partial<MenuItem> | null, parentId: string | null = null) => {
        setEditingItem(item);
        setParentId(parentId);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setEditingItem(null);
        setParentId(null);
        setIsDialogOpen(false);
    };

    const handleSave = (item: Partial<MenuItem>) => {
        if (item.id) { // Editing existing item
            const update = (items: MenuItem[]): MenuItem[] => items.map(i => {
                if (i.id === item.id) return { ...i, ...item } as MenuItem;
                if (i.children) return { ...i, children: update(i.children) };
                return i;
            });
            setMenuItems(update(menuItems));
        } else { // Adding new item
            const newItem: MenuItem = {
                id: Date.now().toString(),
                label: item.label!,
                path: item.path!,
                icon: item.icon!,
                roles: item.roles!,
            };
            if (parentId) {
                const add = (items: MenuItem[]): MenuItem[] => items.map(i => {
                    if (i.id === parentId) {
                        return { ...i, children: [...(i.children || []), newItem] };
                    }
                    if (i.children) return { ...i, children: add(i.children) };
                    return i;
                });
                setMenuItems(add(menuItems));
            } else {
                setMenuItems([...menuItems, newItem]);
            }
        }
        closeDialog();
    };

    const handleDelete = (itemId: string) => {
        const remove = (items: MenuItem[]): MenuItem[] => 
            items.filter(i => i.id !== itemId).map(i => {
                if (i.children) return { ...i, children: remove(i.children) };
                return i;
            });
        setMenuItems(remove(menuItems));
    };

    const renderMenuItem = (item: MenuItem): React.ReactNode => (
        <div key={item.id} className="group/item">
            <div className="flex items-center bg-card p-2 rounded-lg border my-2 shadow-sm hover:shadow-md transition-shadow group-hover/item:border-primary">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab mr-2" />
                <Icon name={item.icon} className="h-5 w-5 text-muted-foreground mr-3" />
                <div className="flex-grow font-medium text-foreground">{item.label}</div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog({}, item.id)}>
                        <CornerDownRight className="h-4 w-4" />
                         <span className="sr-only">Add Sub-item</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog(item)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </div>
            {item.children && item.children.length > 0 && (
                <div className="pl-6 border-l-2 ml-4 border-dashed">
                    {item.children.map(child => renderMenuItem(child))}
                </div>
            )}
        </div>
    );
    
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <CardTitle>Menu Designer</CardTitle>
                        <CardDescription>Build and configure your application's menu structure.</CardDescription>
                    </div>
                    <Button onClick={() => openDialog(null)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Root Item
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-4 rounded-lg bg-secondary/30 min-h-[300px]">
                    {menuItems.map(item => renderMenuItem(item))}
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[480px]">
                        {isDialogOpen && <MenuItemForm item={editingItem} roles={roles} onSave={handleSave} onClose={closeDialog} />}
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
