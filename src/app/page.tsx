
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus, useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginAction } from './actions';

function ChaideLogo() {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/img/logo_chaide.svg"
          alt="Chaide Logo"
          width={300}
          height={300}
          priority
        />
      </div>
    </div>
  );
}

const initialState = {
  success: false,
  message: '',
};


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Ingresando...' : 'Ingresar'}
        </Button>
    );
}

export default function LoginPage() {
    const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12 bg-primary lg:bg-primary">
        <ChaideLogo />
      </div>
      <div className="flex items-center justify-center py-12">
        <Card className="mx-auto max-w-sm w-full shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Image
                src="/img/Chide.svg"
                alt="Chaide Logo"
                width={46}
                height={46}
                priority
              />
              <CardTitle className="text-2xl">Seguridades</CardTitle>
            </div>
            <CardDescription>
              Inicio de Sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
                <div className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="usuario">Usuario</Label>
                    <Input id="usuario" name="usuario" placeholder="Ingrese su usuario" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" name="password" type="password" placeholder="Ingrese su contraseña" required />
                  </div>
                   {state && !state.success && state.message && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error de autenticación</AlertTitle>
                      <AlertDescription>
                        {state.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  <SubmitButton />
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
