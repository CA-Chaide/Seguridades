'use client';

import { useEffect, useMemo, useState } from 'react';
import { claseService } from '@/services/clase.service';
import type { Clase } from '@/types/interfaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2, Plus, Save, RefreshCw, Trash2, X, Flag } from 'lucide-react';

type FormState = {
  mode: 'new' | 'edit';
  data: Partial<Clase>;
};

const emptyClase: Clase = {
  codigo_clase: 0,
  nombre_clase: '',
  estado: 'A'
};

export default function UserTypesPage() {
  const [items, setItems] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<FormState>({ mode: 'new', data: emptyClase });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true); setError(null);
    try {
  const resp = await claseService.getAll();
  setItems(Array.isArray(resp.data) ? resp.data : []);
    } catch (e: any) {
      setError(e?.message || 'Error cargando tipos de roles');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!filter) return items;
    const f = filter.toLowerCase();
    return items.filter(it =>
      String(it.codigo_clase).includes(f) ||
      it.nombre_clase.toLowerCase().includes(f) ||
      it.estado.toLowerCase().includes(f)
    );
  }, [items, filter]);

  const startNew = () => setForm({ mode: 'new', data: { ...emptyClase } });
  const startEdit = (c: Clase) => setForm({ mode: 'edit', data: { ...c } });
  const cancelEdit = () => startNew();

  const onChangeField = (field: keyof Clase, value: string) => {
    setForm(prev => ({ ...prev, data: { ...prev.data, [field]: field === 'codigo_clase' ? Number(value) : value } }));
  };

  const canSave = () => !!form.data.nombre_clase && form.data.estado;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave()) return;
    setSaving(true); setError(null);
    try {
      const payload: Clase = {
        codigo_clase: form.mode === 'edit' ? Number(form.data.codigo_clase) : Number(form.data.codigo_clase) || 0,
        nombre_clase: (form.data.nombre_clase || '').trim(),
        estado: (form.data.estado || 'A').trim(),
      };
  const respSaved = await claseService.save(payload);
      const saved = respSaved.data;
      setItems(prev => {
        const exists = prev.some(it => it.codigo_clase === saved.codigo_clase);
        if (exists) return prev.map(it => it.codigo_clase === saved.codigo_clase ? saved : it);
        return [saved, ...prev];
      });
      startNew();
  toast({ title: 'Rol guardado', description: `Rol ${saved.nombre_clase} (${saved.codigo_clase}) guardado.`, variant: 'success' });
    } catch (e: any) {
      setError(e?.message || 'Error guardando tipo de rol');
  toast({ title: 'Error al guardar', description: e?.message || 'Fallo desconocido', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (codigo: number) => {
    if (!confirm('¿Eliminar tipo de rol?')) return;
    setDeletingId(codigo); setError(null);
    try {
      await claseService.delete(codigo);
      await load();
      if (form.mode === 'edit' && form.data.codigo_clase === codigo) startNew();
  toast({ title: 'Rol eliminado', description: `Se eliminó el rol ${codigo}.`, variant: 'success' });
    } catch (e: any) {
      setError(e?.message || 'Error eliminando tipo de rol');
  toast({ title: 'Error al eliminar', description: e?.message || 'Fallo desconocido', variant: 'destructive' });
    } finally { setDeletingId(null); }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg">Clases de Usuarios</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Recargar
              </Button>
              <Button variant="default" size="sm" onClick={startNew} disabled={saving}>
                <Plus className="h-4 w-4 mr-1" /> Nuevo
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <Input
              placeholder="Filtrar (código, nombre, estado)"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="bg-white/70"
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4 md:col-span-1 bg-white/60 p-4 rounded-lg border">
            <div className="space-y-1">
              <Label htmlFor="codigo_clase">Código</Label>
              <Input id="codigo_clase" value={form.data.codigo_clase ?? ''} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nombre_clase">Denominación *</Label>
              <Input id="nombre_clase" value={form.data.nombre_clase || ''} onChange={e => onChangeField('nombre_clase', e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="estado">Estado *</Label>
              <select id="estado" className="w-full rounded-md border px-3 py-2 text-sm bg-white" value={form.data.estado || 'A'} onChange={e => onChangeField('estado', e.target.value)}>
                <option value="A">Activo</option>
                <option value="I">Inactivo</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" disabled={!canSave() || saving} className="flex items-center gap-1">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </Button>
              {form.mode === 'edit' && (
                <Button type="button" variant="secondary" size="sm" onClick={cancelEdit} className="flex items-center gap-1">
                  <X className="h-4 w-4" /> Cancelar
                </Button>
              )}
            </div>
          </form>

          {/* Tabla */}
          <div className="md:col-span-2">
            <div className="overflow-x-auto rounded-lg border bg-white/60">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="text-left px-3 py-2 w-32">Código</th>
                    <th className="text-left px-3 py-2">Denominación</th>
                    <th className="text-left px-3 py-2">Estado</th>
                    <th className="px-3 py-2 text-center w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-500">Cargando...</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">Sin resultados</td></tr>
                  )}
                  {!loading && filtered.map(cl => (
                    <tr key={cl.codigo_clase} className="border-t hover:bg-gray-50/70">
                      <td className="px-3 py-2 font-mono text-xs">{cl.codigo_clase}</td>
                      <td className="px-3 py-2">{cl.nombre_clase}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cl.estado === 'A' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <Flag className="h-3 w-3 mr-1" /> {cl.estado === 'A' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-3 py-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => startEdit(cl)} title="Editar">
                            ✏️
                          </Button>
                          <Button variant="destructive" size="icon" className="h-7 w-7" disabled={deletingId === cl.codigo_clase} onClick={() => handleDelete(cl.codigo_clase)} title="Eliminar">
                            {deletingId === cl.codigo_clase ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
