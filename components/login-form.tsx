"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de login - sin backend real por ahora
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <Card className="border-slate-700/50 shadow-2xl bg-slate-900/90 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold text-white">Inicio de Sesión</CardTitle>
        <CardDescription className="text-blue-200">Acceso para administradores</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@emcomed.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar al Sistema"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
