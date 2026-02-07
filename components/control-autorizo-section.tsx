"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Investment } from "@/app/dashboard/plan-inversion/page"
import type { Autorizo } from "@/app/dashboard/modelo-autorizo/page"

const PROVINCIAS_ENTIDADES = [
  "Artemisa", "Aseguramiento", "BNT Santiago", "Camagüey", "Ciego de Ávila",
  "Cienfuegos", "Granma", "Guantánamo", "Holguín", "Isla de la Juventud",
  "La Habana", "Las Tunas", "Matanzas", "Mayabeque", "Operaciones",
  "Pinar del Río", "Plataforma", "Sancti Spíritus", "Santiago de Cuba",
  "Suministros Farmacéuticos", "Villa Clara",
]

type ControlAutorizoData = {
  autorizoId: number
  ueb: string
  cyM: number
  equipo: number
  otros: number
  fechaFinanciamiento: string
  financiamiento: number
}

export function ControlAutorizoSection() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [autorizos, setAutorizos] = useState<Autorizo[]>([])
  const [selectedFichaId, setSelectedFichaId] = useState<number | null>(null)
  const [selectedUEB, setSelectedUEB] = useState<string>("todas")
  const [controlData, setControlData] = useState<ControlAutorizoData[]>([])

  useEffect(() => {
    const storedInvestments = localStorage.getItem("investments")
    const storedAutorizos = localStorage.getItem("autorizos")
    const storedControlData = localStorage.getItem("controlAutorizoData")

    if (storedInvestments) {
      try {
        setInvestments(JSON.parse(storedInvestments))
      } catch (e) {
        console.error("Error loading investments:", e)
      }
    }

    if (storedAutorizos) {
      try {
        setAutorizos(JSON.parse(storedAutorizos))
      } catch (e) {
        console.error("Error loading autorizos:", e)
      }
    }

    if (storedControlData) {
      try {
        setControlData(JSON.parse(storedControlData))
      } catch (e) {
        console.error("Error loading control data:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (controlData.length > 0) {
      localStorage.setItem("controlAutorizoData", JSON.stringify(controlData))
    }
  }, [controlData])

  const selectedFicha = investments.find((inv) => inv.id === selectedFichaId)

  // Get autorizos for selected ficha
  const fichaAutorizos = autorizos.filter((a) => a.fichaId === selectedFichaId)

  // Get unique UEBs from the selected ficha
  const getUEBsForFicha = (): string[] => {
    if (!selectedFicha) return []
    
    if (selectedFicha.tipo === "M" && selectedFicha.subInvestments) {
      return [...new Set(selectedFicha.subInvestments.map((sub) => sub.ueb || sub.tipo))]
    }
    return selectedFicha.ueb ? [selectedFicha.ueb] : []
  }

  const uebOptions = getUEBsForFicha()

  // Filter autorizos by UEB if selected
  const filteredAutorizos = selectedUEB === "todas" 
    ? fichaAutorizos 
    : fichaAutorizos.filter((a) => {
        // For now, show all autorizos if UEB filter is active
        // This can be enhanced when autorizos have UEB field
        return true
      })

  // Calculate comprometido (sum of all autorizo values)
  const calculateComprometido = () => {
    let cyM = 0
    let equipo = 0
    let otros = 0

    filteredAutorizos.forEach((autorizo) => {
      const data = controlData.find((d) => d.autorizoId === autorizo.id)
      if (data) {
        cyM += data.cyM || 0
        equipo += data.equipo || 0
        otros += data.otros || 0
      }
    })

    return {
      total: cyM + equipo + otros,
      cyM,
      equipo,
      otros,
    }
  }

  const comprometido = calculateComprometido()

  // Plan values from ficha
  const plan = selectedFicha
    ? {
        total: selectedFicha.planAnio.cyM + selectedFicha.planAnio.equipo + selectedFicha.planAnio.otros,
        cyM: selectedFicha.planAnio.cyM,
        equipo: selectedFicha.planAnio.equipo,
        otros: selectedFicha.planAnio.otros,
      }
    : { total: 0, cyM: 0, equipo: 0, otros: 0 }

  // Pendiente = Plan - Comprometido
  const pendiente = {
    total: plan.total - comprometido.total,
    cyM: plan.cyM - comprometido.cyM,
    equipo: plan.equipo - comprometido.equipo,
    otros: plan.otros - comprometido.otros,
  }

  const handleControlDataChange = (
    autorizoId: number,
    field: keyof ControlAutorizoData,
    value: number | string
  ) => {
    setControlData((prev) => {
      const existing = prev.find((d) => d.autorizoId === autorizoId)
      if (existing) {
        return prev.map((d) =>
          d.autorizoId === autorizoId ? { ...d, [field]: value } : d
        )
      }
      return [
        ...prev,
        {
          autorizoId,
          ueb: selectedFicha?.ueb || "",
          cyM: 0,
          equipo: 0,
          otros: 0,
          fechaFinanciamiento: "",
          financiamiento: 0,
          [field]: value,
        },
      ]
    })
  }

  const getControlData = (autorizoId: number): ControlAutorizoData => {
    return (
      controlData.find((d) => d.autorizoId === autorizoId) || {
        autorizoId,
        ueb: selectedFicha?.ueb || "",
        cyM: 0,
        equipo: 0,
        otros: 0,
        fechaFinanciamiento: "",
        financiamiento: 0,
      }
    )
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="space-y-6">
      {/* Selector de Ficha */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
        <label className="text-white font-semibold mb-2 block">Seleccionar Ficha de Inversión:</label>
        <Select
          value={selectedFichaId?.toString() || ""}
          onValueChange={(value) => {
            setSelectedFichaId(Number.parseInt(value))
            setSelectedUEB("todas")
          }}
        >
          <SelectTrigger className="bg-slate-700 border-blue-500/30 text-white">
            <SelectValue placeholder="Seleccionar ficha..." />
          </SelectTrigger>
          <SelectContent>
            {investments.map((inv) => (
              <SelectItem key={inv.id} value={inv.id.toString()}>
                {inv.codigo} - {inv.descripcion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFicha && (
        <>
          {/* Tabla Resumen MMT */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <td colSpan={5} className="border border-black p-2 bg-green-200 font-bold text-black">
                    {selectedFicha.codigo}-{selectedFicha.descripcion.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border border-black p-2 bg-green-300 font-bold text-center text-black">
                    MMT
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border border-black p-2 font-bold text-black"></td>
                  <td className="border border-black p-2 font-bold text-center text-black">TOTAL</td>
                  <td className="border border-black p-2 font-bold text-center text-black">C y M</td>
                  <td className="border border-black p-2 font-bold text-center text-black">EQUIPOS</td>
                  <td className="border border-black p-2 font-bold text-center text-black">OTROS</td>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-yellow-100">
                  <td className="border border-black p-2 font-bold text-black">PLAN</td>
                  <td className="border border-black p-2 text-center text-black">{plan.total.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{plan.cyM.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{plan.equipo.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{plan.otros.toFixed(1)}</td>
                </tr>
                <tr className="bg-yellow-100">
                  <td className="border border-black p-2 font-bold text-black">COMPROMETIDO</td>
                  <td className="border border-black p-2 text-center text-black">{comprometido.total.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{comprometido.cyM.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{comprometido.equipo.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{comprometido.otros.toFixed(1)}</td>
                </tr>
                <tr className="bg-green-200">
                  <td className="border border-black p-2 font-bold text-black">PENDIENTE</td>
                  <td className="border border-black p-2 text-center text-black font-bold">{pendiente.total.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{pendiente.cyM.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{pendiente.equipo.toFixed(1)}</td>
                  <td className="border border-black p-2 text-center text-black">{pendiente.otros.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Filtro de UEB */}
          {uebOptions.length > 1 && (
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
              <label className="text-white font-semibold mb-2 block">Filtrar por UEB:</label>
              <Select value={selectedUEB} onValueChange={setSelectedUEB}>
                <SelectTrigger className="bg-slate-700 border-blue-500/30 text-white w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las UEB</SelectItem>
                  {uebOptions.map((ueb) => (
                    <SelectItem key={ueb} value={ueb}>
                      {ueb}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tabla Detallada de Autorizos */}
          <div className="bg-white rounded-lg overflow-x-auto shadow-lg">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-green-200">
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">No. autorizo</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">Fecha</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">UEB</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">C y M</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">EQUIPOS</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">OTROS</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[200px]">Descripción de autorizo</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">No ctto</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">Proveedor/ejecutor</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">No.Factura</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">No.Oferta</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">Fecha de Financiamiento</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">Financiamiento</th>
                </tr>
              </thead>
              <tbody>
                {filteredAutorizos.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="border border-black p-4 text-center text-gray-500">
                      No hay autorizos para esta ficha. Cree autorizos en el Módulo 3.
                    </td>
                  </tr>
                ) : (
                  filteredAutorizos.map((autorizo) => {
                    const data = getControlData(autorizo.id)
                    const fechaAutorizo = new Date(autorizo.fecha)
                    
                    return (
                      <tr key={autorizo.id} className="hover:bg-gray-50">
                        <td className="border border-black p-2 text-center text-black">
                          {autorizo.consecutivo}.{currentYear}
                        </td>
                        <td className="border border-black p-2 text-center text-black whitespace-nowrap">
                          {format(fechaAutorizo, "d.MM.yyyy")}
                        </td>
                        <td className="border border-black p-1">
                          <Select
                            value={data.ueb || selectedFicha.ueb || ""}
                            onValueChange={(value) =>
                              handleControlDataChange(autorizo.id, "ueb", value)
                            }
                          >
                            <SelectTrigger className="h-8 text-xs bg-white border-0 text-black">
                              <SelectValue placeholder="Seleccionar UEB" />
                            </SelectTrigger>
                            <SelectContent>
                              {PROVINCIAS_ENTIDADES.map((prov) => (
                                <SelectItem key={prov} value={prov}>
                                  {prov}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-black p-1">
                          <Input
                            type="number"
                            value={data.cyM || ""}
                            onChange={(e) =>
                              handleControlDataChange(autorizo.id, "cyM", Number.parseFloat(e.target.value) || 0)
                            }
                            disabled={autorizo.componente !== "cyM"}
                            placeholder="0"
                            min="0"
                            className={`h-8 text-center text-black border-0 ${
                              autorizo.componente !== "cyM" ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                            }`}
                          />
                        </td>
                        <td className="border border-black p-1">
                          <Input
                            type="number"
                            value={data.equipo || ""}
                            onChange={(e) =>
                              handleControlDataChange(autorizo.id, "equipo", Number.parseFloat(e.target.value) || 0)
                            }
                            disabled={autorizo.componente !== "equip"}
                            placeholder="0"
                            min="0"
                            className={`h-8 text-center text-black border-0 ${
                              autorizo.componente !== "equip" ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                            }`}
                          />
                        </td>
                        <td className="border border-black p-1">
                          <Input
                            type="number"
                            value={data.otros || ""}
                            onChange={(e) =>
                              handleControlDataChange(autorizo.id, "otros", Number.parseFloat(e.target.value) || 0)
                            }
                            disabled={autorizo.componente !== "otros"}
                            placeholder="0"
                            min="0"
                            className={`h-8 text-center text-black border-0 ${
                              autorizo.componente !== "otros" ? "bg-gray-200 cursor-not-allowed" : "bg-white"
                            }`}
                          />
                        </td>
                        <td className="border border-black p-2 text-black text-xs">
                          {autorizo.descripcion}
                        </td>
                        <td className="border border-black p-2 text-center text-black">
                          {autorizo.numeroContrato}
                        </td>
                        <td className="border border-black p-2 text-center text-black">
                          {autorizo.entidadContratada}
                        </td>
                        <td className="border border-black p-2 text-center text-black">
                          {autorizo.factura}
                        </td>
                        <td className="border border-black p-2 text-center text-black">
                          -
                        </td>
                        <td className="border border-black p-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="h-8 w-full text-xs bg-white border-0 text-black hover:bg-gray-100"
                              >
                                {data.fechaFinanciamiento
                                  ? format(new Date(data.fechaFinanciamiento), "d.MM.yyyy")
                                  : "Seleccionar"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={data.fechaFinanciamiento ? new Date(data.fechaFinanciamiento) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    handleControlDataChange(autorizo.id, "fechaFinanciamiento", date.toISOString())
                                  }
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </td>
                        <td className="border border-black p-1">
                          <Input
                            type="number"
                            value={data.financiamiento || ""}
                            onChange={(e) =>
                              handleControlDataChange(
                                autorizo.id,
                                "financiamiento",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            min="0"
                            className="h-8 text-center text-black bg-white border-0"
                          />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!selectedFichaId && (
        <div className="text-center py-12">
          <p className="text-blue-200 text-lg">Seleccione una ficha de inversión para ver el control de autorizos</p>
        </div>
      )}
    </div>
  )
}
