"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ControlAutorizoSection } from "@/components/control-autorizo-section"
import { ControlContratoSection } from "@/components/control-contrato-section"

export default function ControlAutorizoPage() {
  const router = useRouter()
  const [view, setView] = useState<"menu" | "autorizo" | "contrato">("menu")

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
                }
              }}
              variant="outline"
              className="mb-4 border-blue-500/30 bg-slate-800/80 text-blue-200 hover:bg-slate-700 hover:text-white"
            >
              ← {view === "menu" ? "Volver al Dashboard" : "Volver al Menú"}
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Control de Autorizo y Contrato
            </h1>
            <p className="text-blue-200 mt-2">Gestión y control de autorizos y contratos por ficha de inversión</p>
          </div>
        </div>

        {view === "menu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card
              onClick={() => setView("autorizo")}
              className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-400/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-white">Control de Autorizo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-center">Controlar y gestionar los autorizos por ficha de inversión</p>
              </CardContent>
            </Card>

            <Card
              onClick={() => setView("contrato")}
              className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer hover:border-blue-400/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl text-white">Control de Contrato</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200 text-center">Trazabilidad de contratos y autorizos por ficha</p>
              </CardContent>
            </Card>
          </div>
        )}

        {view === "autorizo" && <ControlAutorizoSection />}

        {view === "contrato" && <ControlContratoSection />}
      </div>
    </div>
  )
}
