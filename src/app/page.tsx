import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon } from 'lucide-react';

function ChaideLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/img/logo.png"
          alt="Chaide Logo"
          width={150}
          height={150}
          priority
        />
        <span className="text-6xl font-bold tracking-wider">CHAIDE</span>
      </div>
      <p className="mt-2 text-xl tracking-widest">SUEÑA CON UN MUNDO MEJOR</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12 bg-primary lg:bg-primary">
        <ChaideLogo />
      </div>
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
               <div className="bg-primary/10 p-2 rounded-full">
                <Moon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Órdenes</CardTitle>
            </div>
            <CardDescription>
              Inicio de Sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="operario">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="operario">Operario</TabsTrigger>
                <TabsTrigger value="administracion">Administración</TabsTrigger>
              </TabsList>
              <TabsContent value="operario">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-code">Código de Empleado</Label>
                    <Input id="employee-code" placeholder="Ingrese su código" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Ingresar
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="administracion">
                 <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-user">Usuario</Label>
                    <Input id="admin-user" placeholder="Ingrese su usuario" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Contraseña</Label>
                    <Input id="admin-password" type="password" placeholder="Ingrese su contraseña" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Ingresar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
