"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const modules = [
  {
    id: 1,
    title: "Plan de Inversión",
    description: "Gestión de fichas de inversión",
    route: "/dashboard/plan-inversion",
  },
  {
    id: 2,
    title: "Desglose del Plan por Meses",
    description: "Control de montos por mes",
    route: "/dashboard/desglose-meses",
  },
  {
    id: 3,
    title: "Modelo de Autorizo",
    description: "Control de inversiones y autorizaciones",
    route: "/dashboard/modelo-autorizo",
  },
  {
    id: 4,
    title: "Control de Autorizo y Contrato",
    description: "Control de autorizos y contratos por ficha",
    route: "/dashboard/control-autorizo",
  },
  {
    id: 5,
    title: "Módulo 5",
    description: "Funcionalidad por definir",
  },
  {
    id: 6,
    title: "Módulo 6",
    description: "Funcionalidad por definir",
  },
]

export function DashboardGrid() {
  const router = useRouter()

  const handleModuleClick = (module: (typeof modules)[0]) => {
    if (module.route) {
      router.push(module.route)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {modules.map((module) => (
        <Card
          key={module.id}
          onClick={() => handleModuleClick(module)}
          className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-400/50"
        >
          <CardHeader>
            <CardTitle className="text-lg text-white">{module.title}</CardTitle>
            <CardDescription className="text-blue-200">{module.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-300/70">
              {module.route ? "Click para acceder" : "Este módulo estará disponible próximamente"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
