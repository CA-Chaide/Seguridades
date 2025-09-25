'use client';

import { useEffect, useMemo, useState } from 'react';
import { tipoUsuarioService } from '@/services/tipoUsuario.service';
import { claseService } from '@/services/clase.service';
import { aplicacionService } from '@/services/aplicacion.service';
import { tipoUsuarioAplicacionService } from '@/services/tipoUsuarioAplicacion.service';
import type { TipoUsuario, Clase, Aplicacion, TipoUsuarioAplicacion } from '@/types/interfaces';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Loader2, Plus, Save, RefreshCw, Trash2, X, Flag } from 'lucide-react';

type FormState = { mode: 'new' | 'edit'; data: Partial<TipoUsuario> & { codigo_aplicacion?: string } };

const emptyTipoUsuario: FormState['data'] = {
  codigo_tipo_usuario: 0,
  codigo_clase: 0,
  nombre_tipo_usuario: '',
  estado: 'A',
};

export default function ProfilesPage() {
  const [items, setItems] = useState<TipoUsuario[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [apps, setApps] = useState<Aplicacion[]>([]);
  const [appsByTipoUsuario, setAppsByTipoUsuario] = useState<Record<number, string[]>>({});
  const [loggedUser, setLoggedUser] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState<FormState>({ mode: 'new', data: emptyTipoUsuario });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [respTipos, respClases, respApps] = await Promise.all([
        tipoUsuarioService.getAll(),
        claseService.getAll(),
        aplicacionService.getAll(),
      ]);
      const tipos: TipoUsuario[] = Array.isArray(respTipos.data) ? respTipos.data : [];
      setItems(tipos);
      setClases(Array.isArray(respClases.data) ? respClases.data : []);
      setApps(Array.isArray(respApps.data) ? respApps.data : []);

      // Cargar asociaciones de aplicaciones para cada tipo usuario en paralelo
      const assoc: Record<number, string[]> = {};
      await Promise.all(tipos.map(async t => {
        try {
          const resp = await tipoUsuarioAplicacionService.getByCodigoTipoUsuario(String(t.codigo_tipo_usuario));
          const list: any = resp.data;
          const cods: string[] = Array.isArray(list) ? list.map((x: any) => x.codigo_aplicacion).filter(Boolean) : [];
          assoc[t.codigo_tipo_usuario] = cods;
        } catch { /* ignore */ }
      }));
      setAppsByTipoUsuario(assoc);
    } catch (e: any) {
      setError(e?.message || 'Error cargando datos');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        setLoggedUser(parsed?.usuario || parsed?.correo_usuario || '');
      }
    } catch { /* ignore */ }
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return items;
    const f = filter.toLowerCase();
    return items.filter(it =>
      String(it.codigo_tipo_usuario).includes(f) ||
      it.nombre_tipo_usuario.toLowerCase().includes(f) ||
      it.estado.toLowerCase().includes(f)
    );
  }, [items, filter]);

  const startNew = () => setForm({ mode: 'new', data: { ...emptyTipoUsuario } });
  const startEdit = (t: TipoUsuario) => {
    // Tomar primera aplicación asociada si existe
    const firstApp = appsByTipoUsuario[t.codigo_tipo_usuario]?.[0];
  const codigoValido = firstApp && apps.some(a => a.codigo_aplicacion === firstApp) ? firstApp : '';
  setForm({ mode: 'edit', data: { ...t, codigo_aplicacion: codigoValido } });
  };
  const cancelEdit = () => startNew();

  const onChangeField = (field: keyof TipoUsuario | 'codigo_aplicacion', value: string) => {
    const isNumeric = field === 'codigo_tipo_usuario' || field === 'codigo_clase';
    setForm(prev => ({
      ...prev,
      data: { ...prev.data, [field]: isNumeric ? Number(value) : value }
    }));
  };

  const canSave = () => !!form.data.nombre_tipo_usuario && form.data.codigo_clase && form.data.estado && form.data.codigo_aplicacion;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave()) return;
    setSaving(true); setError(null);
    try {
  console.debug('Submit Perfil payload draft', form.data);
      // capture previous state for comparison (only relevant in edit mode)
      const prevItem = form.mode === 'edit' ? items.find(it => it.codigo_tipo_usuario === Number(form.data.codigo_tipo_usuario)) : undefined;
      const payload: TipoUsuario = {
        codigo_tipo_usuario: form.mode === 'edit' ? Number(form.data.codigo_tipo_usuario) : Number(form.data.codigo_tipo_usuario) || 0,
        codigo_clase: Number(form.data.codigo_clase),
        nombre_tipo_usuario: (form.data.nombre_tipo_usuario || '').trim(),
        estado: (form.data.estado || 'A').trim(),
        usuario_modificacion: form.mode === 'edit' ? (loggedUser || 'system') : '',
        fecha_modificacion: new Date().toISOString(),
      } as any;
  const respSave = await tipoUsuarioService.save(payload);
      const saved: TipoUsuario = respSave.data;
      const newId = saved.codigo_tipo_usuario;
      // Actualizar listado local de perfiles
      setItems(prev => {
        const exists = prev.some(it => it.codigo_tipo_usuario === newId);
        if (exists) return prev.map(it => it.codigo_tipo_usuario === newId ? saved : it);
        return [saved, ...prev];
      });

      // Asociación aplicación-perfil: crear/update sólo después de que tipo_usuario se haya guardado
      if (form.data.codigo_aplicacion) {
        const assocPayloadBase = {
          codigo_aplicacion: form.data.codigo_aplicacion,
          codigo_tipo_usuario: newId,
          estado: 'A',
          usuario_modificacion: loggedUser || 'system',
          fecha_modificacion: new Date().toISOString(),
        } as any;

        if (form.mode === 'new') {
          // Crear nueva asociación
          const assocPayload: TipoUsuarioAplicacion = {
            codigo_tipo_usuario_aplicacion: 0,
            ...assocPayloadBase,
          } as any;
          try {
            await tipoUsuarioAplicacionService.save(assocPayload);
          } catch (assocErr: any) {
            console.error('Error creando tipo_usuario_aplicacion', assocErr);
            toast({ title: 'Asociación no creada', description: assocErr?.message || 'No se pudo crear la asociación aplicación-perfil', variant: 'destructive' });
          }
        } else if (form.mode === 'edit') {
          try {
            const respAssoc = await tipoUsuarioAplicacionService.getByCodigoTipoUsuario(String(newId));
            const assocList: any[] = Array.isArray(respAssoc.data) ? respAssoc.data : [];
            const currentAssoc = assocList[0]; // asumimos 1 a 1 o tomamos la primera

            const nameChanged = !!prevItem && prevItem.nombre_tipo_usuario !== saved.nombre_tipo_usuario;
            const appChanged = !!currentAssoc && currentAssoc.codigo_aplicacion !== form.data.codigo_aplicacion;

            if (!currentAssoc) {
              // no existía asociación: crear
              const assocPayload: TipoUsuarioAplicacion = {
                codigo_tipo_usuario_aplicacion: 0,
                ...assocPayloadBase,
              } as any;
              await tipoUsuarioAplicacionService.save(assocPayload);
            } else if (nameChanged || appChanged) {
              // actualizar la asociación existente (actualizamos metadata y código de aplicación si cambió)
              const updatePayload: TipoUsuarioAplicacion = {
                ...currentAssoc,
                codigo_aplicacion: form.data.codigo_aplicacion ?? currentAssoc.codigo_aplicacion,
                usuario_modificacion: loggedUser || 'system',
                fecha_modificacion: new Date().toISOString(),
              } as any;
              await tipoUsuarioAplicacionService.save(updatePayload as any);
            }
          } catch (assocErr: any) {
            console.error('Error actualizando tipo_usuario_aplicacion', assocErr);
            toast({ title: 'Asociación no actualizada', description: assocErr?.message || 'No se pudo actualizar la asociación aplicación-perfil', variant: 'destructive' });
          }
        }

        // Refrescar asociaciones para reflejar cambio
        try {
          const respAssocReload = await tipoUsuarioAplicacionService.getByCodigoTipoUsuario(String(newId));
          const listReload: any[] = Array.isArray(respAssocReload.data) ? respAssocReload.data : [];
          const codes = listReload.map(r => r.codigo_aplicacion).filter(Boolean);
          setAppsByTipoUsuario(prev => ({ ...prev, [newId]: codes }));
        } catch (reloadErr: any) {
          console.error('Error recargando asociaciones', reloadErr);
        }
      }
  startNew();
  toast({ title: 'Perfil guardado', description: `Perfil ${saved.nombre_tipo_usuario} (${newId}) guardado correctamente.`, variant: 'success' });
    } catch (e: any) {
      setError(e?.message || 'Error guardando perfil');
  toast({ title: 'Error al guardar', description: e?.message || 'Fallo desconocido', variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (codigo: number) => {
    if (!confirm('¿Eliminar perfil?')) return;
    setDeletingId(codigo); setError(null);
    try {
      await tipoUsuarioService.delete(codigo);
      await load();
      if (form.mode === 'edit' && form.data.codigo_tipo_usuario === codigo) startNew();
  toast({ title: 'Perfil eliminado', description: `Se eliminó el perfil ${codigo}.`, variant: 'success' });
    } catch (e: any) {
      setError(e?.message || 'Error eliminando perfil');
      toast({ title: 'Error al eliminar', description: e?.message || 'Fallo desconocido', variant: 'destructive' });
    } finally { setDeletingId(null); }
  };

  const getClaseNombre = (codigo: number) => clases.find(c => c.codigo_clase === codigo)?.nombre_clase || '';
  const getAppNombres = (codigoTipoUsuario: number) => {
    const cods = appsByTipoUsuario[codigoTipoUsuario] || [];
    return cods.map(c => apps.find(a => a.codigo_aplicacion === c)?.nombre_aplicacion || c).join(', ');
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg">Mantenimiento de Perfiles</CardTitle>
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
              placeholder="Filtrar (código, descripción, estado)"
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
              <Label>Código</Label>
              <Input value={form.data.codigo_tipo_usuario ?? ''} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="codigo_aplicacion">Seleccione una Aplicación *</Label>
              <select id="codigo_aplicacion" className="w-full rounded-md border px-3 py-2 text-sm bg-white" value={(form.data.codigo_aplicacion && apps.some(a=>a.codigo_aplicacion===form.data.codigo_aplicacion) ? form.data.codigo_aplicacion : '')} onChange={e => {
                // debug temporal
                console.debug('Cambio combo aplicacion', { antes: form.data.codigo_aplicacion, nuevo: e.target.value });
                onChangeField('codigo_aplicacion', e.target.value);
              }}>
                <option value="">-- Seleccione --</option>
                {apps.map(app => (
                  <option key={app.codigo_aplicacion} value={app.codigo_aplicacion}>{app.nombre_aplicacion}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="codigo_clase">Seleccione un Rol *</Label>
              <select id="codigo_clase" className="w-full rounded-md border px-3 py-2 text-sm bg-white" value={form.data.codigo_clase ?? 0} onChange={e => {
                console.debug('Cambio combo rol', { antes: form.data.codigo_clase, nuevo: e.target.value });
                onChangeField('codigo_clase', e.target.value);
              }}>
                <option value={0}>-- Seleccione --</option>
                {clases.map(c => (
                  <option key={c.codigo_clase} value={c.codigo_clase}>{c.nombre_clase}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="nombre_tipo_usuario">Denominación *</Label>
              <Input id="nombre_tipo_usuario" value={form.data.nombre_tipo_usuario || ''} onChange={e => onChangeField('nombre_tipo_usuario', e.target.value)} required />
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
                    <th className="text-left px-3 py-2 w-24">Id</th>
                    <th className="text-left px-3 py-2">Descripción</th>
                    <th className="text-left px-3 py-2">Aplicación</th>
                    <th className="text-left px-3 py-2">Rol</th>
                    <th className="text-left px-3 py-2">Estado</th>
                    <th className="px-3 py-2 text-center w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Cargando...</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-400">Sin resultados</td></tr>
                  )}
                  {!loading && filtered.map(t => (
                    <tr key={t.codigo_tipo_usuario} className="border-t hover:bg-gray-50/70">
                      <td className="px-3 py-2 font-mono text-xs">{t.codigo_tipo_usuario}</td>
                      <td className="px-3 py-2">{t.nombre_tipo_usuario}</td>
                      <td className="px-3 py-2">{getAppNombres(t.codigo_tipo_usuario)}</td>
                      <td className="px-3 py-2">{getClaseNombre(t.codigo_clase)}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${t.estado === 'A' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <Flag className="h-3 w-3 mr-1" /> {t.estado === 'A' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-3 py-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => startEdit(t)} title="Editar">
                            ✏️
                          </Button>
                          <Button variant="destructive" size="icon" className="h-7 w-7" disabled={deletingId === t.codigo_tipo_usuario} onClick={() => handleDelete(t.codigo_tipo_usuario)} title="Eliminar">
                            {deletingId === t.codigo_tipo_usuario ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
