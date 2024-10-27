'use client'
import {signIn} from 'next-auth/react';
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import {useRouter} from 'next/navigation'

const schema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
})

type FormData = z.infer<typeof schema>

export default function LoginFormComponent() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setAuthError(null) 
      const res = await signIn('credentials',{
      email: data.email,
      password: data.password,
      redirect: false,
    })
    console.log(res)
    if(res?.error){
      setAuthError(res.error)
    }else{
      router.push('/shop')
      console.log('welcome')
    }
   
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          {authError && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {authError}
            </p>
          )}
          <h2 className="mt-6 text-3xl font-bold text-white">
            Iniciar sesión
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                placeholder="tu@ejemplo.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                placeholder="********"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </div>
    </div>
  )
}