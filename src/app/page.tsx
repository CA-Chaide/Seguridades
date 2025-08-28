import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon } from 'lucide-react';

function ChaideLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="flex items-center gap-4">
        <svg
          className="h-20 w-20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" fill="white" />
          <path
            d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z"
            fill="white"
          />
          <path
            d="M50,5C74.85,5,95,25.15,95,50S74.85,95,50,95S5,74.85,5,50S25.15,5,50,5z"
            fill="white"
            stroke="#0055b8"
            strokeWidth="3"
          />
          <path
            d="M60.1,75.1c-1.5,0.8-3.1,1.5-4.8,2c-1.7,0.5-3.5,0.8-5.3,0.8c-7.3,0-13.8-2.6-19.4-7.8c-5.6-5.2-8.4-11.9-8.4-20.1 c0-8.2,2.8-14.9,8.4-20.1C35.2,24.6,41.7,22,49,22c1.8,0,3.5,0.3,5.2,0.8s3.2,1.2,4.7,2c-4.9,2.8-8.8,6.8-11.7,12 C44.3,41.8,42.8,47.2,42.8,53c0,5.8,1.4,11.2,4.3,16C50,73.2,54.2,76.5,60.1,75.1z"
            fill="#0055b8"
          />
        </svg>

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
