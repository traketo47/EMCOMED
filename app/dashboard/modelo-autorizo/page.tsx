"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { AutorizoForm } from "@/components/autorizo-form"
import { AutorizoList } from "@/components/autorizo-list"

export type Autorizo = {
  id: number
  consecutivo: number
  fecha: string
  descripcion: string
  numeroContrato: string
  entidadContratada: string
  factura: string
  planAprobadoMMT: number
  planAprobadoImport: number
  valorContratoMMT: number
  valorContratoImport: number
  fichaId: number
  fichaCodigo: string
  fichaDescripcion: string
  componente: "cyM" | "equip" | "ppt" | "otros"
  elaboradoNombre: string
  elaboradoCargo: string
  elaboradoFirma: string | null
  aprobadoNombre: string
  aprobadoCargo: string
  aprobadoFirma: string | null
}

export default function ModeloAutorizoPage() {
  const router = useRouter()
  const [view, setView] = useState<"menu" | "create" | "list">("menu")
  const [autorizos, setAutorizos] = useState<Autorizo[]>([])
  const [proveedores, setProveedores] = useState<string[]>([])
  const [nextConsecutivo, setNextConsecutivo] = useState(1)
  const [editingAutorizo, setEditingAutorizo] = useState<Autorizo | null>(null)

  useEffect(() => {
    const storedAutorizos = localStorage.getItem("autorizos")
    const storedProveedores = localStorage.getItem("proveedores")
    const storedConsecutivo = localStorage.getItem("nextConsecutivo")

    if (storedAutorizos) {
      try {
        setAutorizos(JSON.parse(storedAutorizos))
      } catch (e) {
        console.error("Error loading autorizos:", e)
      }
    }

    if (storedProveedores) {
      try {
        setProveedores(JSON.parse(storedProveedores))
      } catch (e) {
        console.error("Error loading proveedores:", e)
      }
    }

    if (storedConsecutivo) {
      setNextConsecutivo(Number.parseInt(storedConsecutivo))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("autorizos", JSON.stringify(autorizos))
  }, [autorizos])

  useEffect(() => {
    localStorage.setItem("proveedores", JSON.stringify(proveedores))
  }, [proveedores])

  useEffect(() => {
    localStorage.setItem("nextConsecutivo", nextConsecutivo.toString())
  }, [nextConsecutivo])

  const handleCreateAutorizo = (autorizo: Omit<Autorizo, "id" | "consecutivo">) => {
    const newAutorizo: Autorizo = {
      ...autorizo,
      id: Date.now(),
      consecutivo: nextConsecutivo,
    }
    setAutorizos([...autorizos, newAutorizo])
    setNextConsecutivo(nextConsecutivo + 1)
    setView("menu")
  }

  const handleEditAutorizo = (autorizo: Autorizo) => {
    setAutorizos(autorizos.map((a) => (a.id === autorizo.id ? autorizo : a)))
    setEditingAutorizo(null)
    setView("list")
  }

  const handleDeleteAutorizo = (id: number) => {
    setAutorizos(autorizos.filter((a) => a.id !== id))
  }

  const handleAddProveedor = (proveedor: string) => {
    if (!proveedores.includes(proveedor)) {
      setProveedores([...proveedores, proveedor])
    }
  }

  const handleEditClick = (autorizo: Autorizo) => {
    setEditingAutorizo(autorizo)
    setView("create")
  }

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/business-background.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-black/30" />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              onClick={() => {
                if (view === "menu") {
                  router.push("/dashboard")
                } else {
                  setView("menu")
                  setEditingAutorizo(null)
                }
              }}
              variant="outline"
              className="mb-4 border-blue-500/30 bg-slate-800/80 text-blue-200 hover:bg-slate-700 hover:text-white"
            >
              ← {view === "menu" ? "Volver al Dashboard" : "Volver al Menú"}
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Modelo de Autorizo
            </h1>
            <p className="text-blue-200 mt-2">Control de inversiones y autorizaciones</p>
          </div>
        </div>

        {view === "menu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card
              onClick={() => setView("create")}
              className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-400/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-white">Crear Modelo de Autorizo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-center">Generar un nuevo modelo de autorización de inversión</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setView("list")}
              className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-400/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl text-white">Visualizar Modelos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-center">Ver, editar e imprimir modelos de autorización existentes</p>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "create" && (
          <AutorizoForm
            onSubmit={editingAutorizo ? handleEditAutorizo : handleCreateAutorizo}
            proveedores={proveedores}
            onAddProveedor={handleAddProveedor}
            editingAutorizo={editingAutorizo}
            nextConsecutivo={nextConsecutivo}
          />
        )}

        {view === "list" && (
          <AutorizoList autorizos={autorizos} onEdit={handleEditClick} onDelete={handleDeleteAutorizo} />
        )}
      </div>
    </div>
  )
}
