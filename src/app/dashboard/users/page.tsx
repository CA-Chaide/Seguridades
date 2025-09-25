
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usuarioService } from '@/services/usuario.service';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, FileSpreadsheet, X, UserCog, Users, AlertTriangle, EllipsisVertical, DiamondPlus } from 'lucide-react';
import { tipoUsuarioAplicacionService } from '@/services/tipoUsuarioAplicacion.service';
import { useToast } from '@/hooks/use-toast';
import { usuarioTipoUsuarioService } from '@/services/usuarioTipoUsuario.service';


export default function UsersPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [perfilesEliminados, setPerfilesEliminados] = useState<any[]>([]);
  const [nuevosPerfiles, setNuevosPerfiles] = useState<any[]>([]);
  const [codigoUsuarioAsignacion, setCodigoUsuarioAsignacion] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [perfilesUsuario, setPerfilesUsuario] = useState<any[]>([]);
  const [aplicacionesPerfiles, setAplicacionesPerfiles] = useState<any[]>([]);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 15, 20, 50, 100];

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await usuarioService.getFichasPersonas();
        // Si la respuesta tiene la propiedad 'data', úsala, si no, usa el array directamente
        setUsers(res.data || res);
      } catch (err: any) {
        setError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <Alert className="mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 mr-2" />
        Presione el botón para actualizar los usuarios desde Active Directory
      </Alert>
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Usuarios - Mantenimiento de aplicaciones de Usuarios</CardTitle>
            <CardDescription>Total registros: {users.length}</CardDescription>
          </div>
          <Button variant="destructive" className="ml-auto">
            Actualizar Usuarios
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Buscar por nombre, cédula, código..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {loading ? (
            <div className="text-center py-8">Cargando usuarios...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded border">
              <table className="min-w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Código</th>
                    <th className="px-4 py-2 text-left">Cédula</th>
                    <th className="px-4 py-2 text-left">Localidad</th>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Grupo Departamento</th>
                    <th className="px-4 py-2 text-left">Departamento</th>
                    <th className="px-4 py-2 text-left">Cargo</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = users.filter(u =>
                      u.NOMBRE?.toLowerCase().includes(search.toLowerCase()) ||
                      u.CEDULA?.toLowerCase().includes(search.toLowerCase()) ||
                      u.CODIGO?.toLowerCase().includes(search.toLowerCase())
                    );
                    const startIdx = (currentPage - 1) * rowsPerPage;
                    const endIdx = startIdx + rowsPerPage;
                    return filtered.slice(startIdx, endIdx).map((u, i) => (
                      <tr key={startIdx + i} className="border-t">
                        <td className="px-4 py-2">{u.CODIGO}</td>
                        <td className="px-4 py-2">{u.CEDULA}</td>
                        <td className="px-4 py-2">{u.LOCALIDAD}</td>
                        <td className="px-4 py-2">{u.NOMBRE}</td>
                        <td className="px-4 py-2">{u.GRUPO_DEPARTAMENTO}</td>
                        <td className="px-4 py-2">{u.DEPARTAMENTO}</td>
                        <td className="px-4 py-2">{u.CARGO}</td>
                        <td className="px-4 py-2">
                          {u.STATUS === 'A' ? (
                            <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}></span>
                          ) : (
                            u.STATUS
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <EllipsisVertical />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={async () => {
                                setSelectedUser(u);
                                setModalOpen(true);
                                setLoadingPerfiles(true);
                                setPerfilesEliminados([]);
                                setNuevosPerfiles([]);
                                try {
                                  // Recuperar perfiles del usuario - usar el codigo_empleado del usuario o CODIGO como fallback
                                  const codigoEmpleado = u.codigo_empleado || u.CODIGO;
                                  console.log('Obteniendo perfiles para codigo_empleado:', codigoEmpleado);
                                  
                                  let perfilesAsignados = [];
                                  let codigoUsuarioFinal = null;
                                  
                                  // Intentar obtener perfiles del usuario
                                  try {
                                    const perfilesRes = await usuarioService.getPerfilesUsuario(codigoEmpleado);
                                    perfilesAsignados = perfilesRes.data?.usuario_tipo_usuarios || [];
                                    codigoUsuarioFinal = perfilesRes.data?.codigo_usuario ?? null;
                                  } catch (userError: any) {
                                    console.log('Usuario no encontrado o sin perfiles:', userError.message);
                                    // Si es "User not found" o similar, el usuario no existe en la BD
                                    // Dejamos perfilesAsignados vacío para permitir asignar nuevos perfiles
                                    perfilesAsignados = [];
                                    codigoUsuarioFinal = null;
                                  }
                                  
                                  // Recuperar todos los perfiles disponibles
                                  const allPerfilesRes = await tipoUsuarioAplicacionService.getAll();
                                  
                                  // Guardar en estado
                                  setPerfilesUsuario(perfilesAsignados);
                                  setAplicacionesPerfiles(allPerfilesRes.data || []);
                                  setCodigoUsuarioAsignacion(codigoUsuarioFinal);
                                } catch (err) {
                                  console.error('Error cargando perfiles:', err);
                                  // Si hay error con perfiles del usuario, solo limpiar esos, pero mantener los disponibles
                                  setPerfilesUsuario([]);
                                  // Intentar cargar los perfiles disponibles aunque falle el del usuario
                                  try {
                                    const allPerfilesRes = await tipoUsuarioAplicacionService.getAll();
                                    setAplicacionesPerfiles(allPerfilesRes.data || []);
                                  } catch (allPerfilesErr) {
                                    console.error('Error cargando todos los perfiles:', allPerfilesErr);
                                    setAplicacionesPerfiles([]);
                                  }
                                } finally {
                                  setLoadingPerfiles(false);
                                }
                              }}>
                                <DiamondPlus className="mr-2 h-4 w-4 text-blue-600" />
                                Asignar permisos
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
              {/* Paginador */}
              <div className="flex items-center justify-end mt-2 gap-6 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Items per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={e => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-gray-100 rounded-md px-3 py-1 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    style={{ minWidth: 60 }}
                  >
                    {rowsPerPageOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <span className="text-sm">
                  {(() => {
                    const filtered = users.filter(u =>
                      u.NOMBRE?.toLowerCase().includes(search.toLowerCase()) ||
                      u.CEDULA?.toLowerCase().includes(search.toLowerCase()) ||
                      u.CODIGO?.toLowerCase().includes(search.toLowerCase())
                    );
                    const startIdx = (currentPage - 1) * rowsPerPage + 1;
                    const endIdx = Math.min(currentPage * rowsPerPage, filtered.length);
                    return `${startIdx} – ${endIdx} of ${filtered.length}`;
                  })()}
                </span>
                <div className="flex gap-2">
                  <button
                    className="text-gray-400 hover:text-gray-700 disabled:text-gray-200 px-2 rounded transition-colors"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-700 disabled:text-gray-200 px-2 rounded transition-colors"
                    disabled={(() => {
                      const filtered = users.filter(u =>
                        u.NOMBRE?.toLowerCase().includes(search.toLowerCase()) ||
                        u.CEDULA?.toLowerCase().includes(search.toLowerCase()) ||
                        u.CODIGO?.toLowerCase().includes(search.toLowerCase())
                      );
                      return currentPage * rowsPerPage >= filtered.length;
                    })()}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Modal de asignación de perfiles a aplicaciones */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded shadow-xl w-full max-w-lg p-6 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Asignar perfiles a aplicaciones</span>
                <span className="text-sm text-gray-600">{selectedUser.NOMBRE} - {selectedUser.CODIGO}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setModalOpen(false)}><X /></Button>
            </div>
            <Separator className="mb-4" />
            {loadingPerfiles ? (
              <div className="text-center py-8">Cargando perfiles...</div>
            ) : (
              <ScrollArea className="h-56 border rounded mt-2 mb-4">
                <div className="flex flex-col gap-2 p-2">
                  {aplicacionesPerfiles.map((perfil: any) => {
                    const yaAsignado = perfilesUsuario.some((p: any) => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario && p.estado === 'A');
                    const eliminado = perfilesEliminados.some((p: any) => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario);
                    const agregado = nuevosPerfiles.some((p: any) => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario);
                    
                    // Lógica del checked: Si está asignado y no eliminado = true, Si no está asignado pero está agregado = true
                    const checked = yaAsignado ? !eliminado : agregado;
                    
                    return (
                      <div key={perfil.codigo_tipo_usuario_aplicacion} className="flex items-center gap-2">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            const isChecked = !!value;
                            const currentlyAssigned = perfilesUsuario.some((p: any) => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario && p.estado === 'A');
                            
                            if (isChecked) {
                              if (currentlyAssigned) {
                                // Quitar de eliminados
                                setPerfilesEliminados(prev => prev.filter(p => p.codigo_tipo_usuario !== perfil.codigo_tipo_usuario));
                              } else {
                                // Agregar a nuevos
                                setNuevosPerfiles(prev => {
                                  if (!prev.some(p => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario)) {
                                    return [...prev, {
                                      codigo_usuario_tipo_usuario: 0,
                                      codigo_tipo_usuario: perfil.codigo_tipo_usuario,
                                      codigo_usuario: codigoUsuarioAsignacion,
                                      estado: 'A'
                                    }];
                                  }
                                  return prev;
                                });
                              }
                            } else {
                              if (currentlyAssigned) {
                                // Buscar el perfil asignado para obtener el codigo_usuario_tipo_usuario correcto (solo estado A)
                                const perfilAsignado = perfilesUsuario.find((p: any) => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario && p.estado === 'A');
                                // Agregar a eliminados
                                setPerfilesEliminados(prev => {
                                  if (!prev.some(p => p.codigo_tipo_usuario === perfil.codigo_tipo_usuario)) {
                                    // Obtener fecha actual de Ecuador (GMT-5)
                                    const fechaEcuador = new Date();
                                    fechaEcuador.setHours(fechaEcuador.getHours() - 5); // Ajustar a GMT-5
                                    
                                    // Obtener usuario actual del localStorage
                                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                                    const usuarioModificacion = currentUser.usuario || 'unknown';
                                    
                                    return [...prev, {
                                      codigo_usuario_tipo_usuario: perfilAsignado?.codigo_usuario_tipo_usuario,
                                      codigo_tipo_usuario: perfil.codigo_tipo_usuario,
                                      usuario_modificacion: usuarioModificacion,
                                      fecha_modificacion: fechaEcuador.toISOString(),
                                    }];
                                  }
                                  return prev;
                                });
                              } else {
                                // Quitar de nuevos
                                setNuevosPerfiles(prev => prev.filter(p => p.codigo_tipo_usuario !== perfil.codigo_tipo_usuario));
                              }
                            }
                          }}
                        />
                        <span className={checked ? 'text-blue-700 font-semibold' : ''}>
                          [{perfil.aplicacion?.nombre_aplicacion}] - {perfil.tipo_usuario?.nombre_tipo_usuario}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button
                onClick={async () => {
                  let agregados = 0;
                  let eliminados = 0;
                  
                  try {
                    // Primero verificar si el usuario existe en la base de datos
                    let codigoUsuarioFinal = codigoUsuarioAsignacion;
                    
                    if (nuevosPerfiles.length > 0 && !codigoUsuarioFinal) {
                      // Si no tenemos codigo_usuario, el usuario no existe, crear uno nuevo
                      console.log('Usuario no existe en BD, creando nuevo usuario...');
                      try {
                        const nuevoUsuario: any = {
                          codigo_usuario: '0',
                          id_usuario: '',
                          codigo_empleado: selectedUser.codigo_empleado || selectedUser.CODIGO,
                          condicion: 'Usuario Interno',
                          estado: 'A',
                          usuario_modificacion: null,
                          fecha_modificacion: null,
                        };
                        const usuarioCreado = await usuarioService.save(nuevoUsuario);
                        codigoUsuarioFinal = usuarioCreado.data?.codigo_usuario;
                        console.log('Usuario creado con codigo_usuario:', codigoUsuarioFinal);
                      } catch (createError: any) {
                        console.error('Error al crear usuario:', createError);
                        throw new Error('Error al crear el usuario: ' + createError.message);
                      }
                    }
                    
                    // Actualizar los nuevos perfiles con el codigo_usuario correcto
                    const perfilesActualizados = nuevosPerfiles.map(perfil => ({
                      ...perfil,
                      codigo_usuario: codigoUsuarioFinal || codigoUsuarioAsignacion
                    }));
                    
                    // Guardar los nuevos perfiles
                    for (const perfil of perfilesActualizados) {
                      await usuarioTipoUsuarioService.save(perfil);
                      agregados++;
                    }
                    
                    // Eliminar perfiles (cambiar estado a 'I' y actualizar auditoría)
                    for (const perfil of perfilesEliminados) {
                      // Obtener fecha actual de Ecuador (GMT-5)
                      const fechaEcuador = new Date();
                      fechaEcuador.setHours(fechaEcuador.getHours() - 5); // Ajustar a GMT-5
                      
                      // Obtener usuario actual del localStorage
                      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                      const usuarioModificacion = currentUser.usuario || 'unknown';
                      
                      const perfilParaActualizar: any = {
                        codigo_usuario_tipo_usuario: perfil.codigo_usuario_tipo_usuario,
                        codigo_tipo_usuario: perfil.codigo_tipo_usuario,
                        codigo_usuario: codigoUsuarioFinal || codigoUsuarioAsignacion,
                        estado: 'I', // Cambiar estado a inactivo
                        usuario_modificacion: usuarioModificacion,
                        fecha_modificacion: fechaEcuador.toISOString()
                      };
                      await usuarioTipoUsuarioService.save(perfilParaActualizar);
                      eliminados++;
                    }
                    
                    setModalOpen(false);
                    setNuevosPerfiles([]);
                    setPerfilesEliminados([]);
                    toast({
                      title: 'Cambios guardados',
                      description: `Se agregaron ${agregados} perfiles y se quitaron ${eliminados} perfiles`,
                      variant: 'success',
                    });
                  } catch (error: any) {
                    console.error('Error al guardar cambios:', error);
                    toast({
                      title: 'Error',
                      description: error.message || 'Error al guardar los cambios',
                      variant: 'destructive',
                    });
                  }
                }}
                disabled={nuevosPerfiles.length === 0 && perfilesEliminados.length === 0}
                variant={
                  (perfilesEliminados.length > 0 && nuevosPerfiles.length === 0) ||
                  (nuevosPerfiles.length > 0 && perfilesEliminados.length === 0)
                    ? 'destructive' // rojo para solo eliminar o solo agregar
                    : 'outline' // para naranja custom cuando hay ambos
                }
                className={
                  nuevosPerfiles.length > 0 && perfilesEliminados.length > 0
                    ? 'bg-orange-500 hover:bg-orange-600 text-white border-none' // naranja
                    : ''
                }
              >
                {nuevosPerfiles.length > 0 && perfilesEliminados.length > 0
                  ? 'Guardar y Actualizar'
                  : (perfilesEliminados.length > 0 || nuevosPerfiles.length > 0)
                  ? 'Actualizar'
                  : 'Guardar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
