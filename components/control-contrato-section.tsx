"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { Investment } from "@/app/dashboard/plan-inversion/page"
import type { Autorizo } from "@/app/dashboard/modelo-autorizo/page"

type ControlAutorizoData = {
  autorizoId: number
  ueb: string
  cyM: number
  equipo: number
  otros: number
  fechaFinanciamiento: string
  financiamiento: number
}

type ContratoData = {
  id: string // key: fichaId-noCtt-proveedor
  fichaId: number
  inversion: string
  ueb: string
  empresaContratada: string
  noCtto: string
  valorCtto: number
  vigenciaCtto: string
  firmaCtto: string
  valorAutorizo: number
  saldoPendiente: number
  ejecutadoAniosAnteriores: number
}

export function ControlContratoSection() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [autorizos, setAutorizos] = useState<Autorizo[]>([])
  const [controlAutorizoData, setControlAutorizoData] = useState<ControlAutorizoData[]>([])
  const [contratoData, setContratoData] = useState<ContratoData[]>([])
  const [selectedFichaId, setSelectedFichaId] = useState<number | null>(null)

  useEffect(() => {
    const storedInvestments = localStorage.getItem("investments")
    const storedAutorizos = localStorage.getItem("autorizos")
    const storedControlData = localStorage.getItem("controlAutorizoData")
    const storedContratoData = localStorage.getItem("controlContratoData")

    if (storedInvestments) {
      try { setInvestments(JSON.parse(storedInvestments)) } catch (e) { console.error(e) }
    }
    if (storedAutorizos) {
      try { setAutorizos(JSON.parse(storedAutorizos)) } catch (e) { console.error(e) }
    }
    if (storedControlData) {
      try { setControlAutorizoData(JSON.parse(storedControlData)) } catch (e) { console.error(e) }
    }
    if (storedContratoData) {
      try { setContratoData(JSON.parse(storedContratoData)) } catch (e) { console.error(e) }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("controlContratoData", JSON.stringify(contratoData))
  }, [contratoData])

  const selectedFicha = investments.find((inv) => inv.id === selectedFichaId)

  // Get autorizos for selected ficha
  const fichaAutorizos = autorizos.filter((a) => a.fichaId === selectedFichaId)

  // Group autorizos by No. Ctto + Proveedor to create contract rows
  const getContratoRows = () => {
    const groups: Record<string, { noCtto: string; proveedor: string; autorizos: Autorizo[] }> = {}

    for (const autorizo of fichaAutorizos) {
      const key = `${autorizo.numeroContrato}||${autorizo.entidadContratada}`
      if (!groups[key]) {
        groups[key] = {
          noCtto: autorizo.numeroContrato,
          proveedor: autorizo.entidadContratada,
          autorizos: [],
        }
      }
      groups[key].autorizos.push(autorizo)
    }

    return Object.entries(groups).map(([key, group]) => {
      // Calculate valor autorizo from control autorizo data
      let valorAutorizo = 0
      for (const autorizo of group.autorizos) {
        const data = controlAutorizoData.find((d) => d.autorizoId === autorizo.id)
        if (data) {
          valorAutorizo += (data.cyM || 0) + (data.equipo || 0) + (data.otros || 0)
        }
      }

      // Get first autorizo's UEB from control data
      const firstAutorizoData = controlAutorizoData.find(
        (d) => d.autorizoId === group.autorizos[0]?.id
      )
      const ueb = firstAutorizoData?.ueb || selectedFicha?.ueb || ""

      // Get saved contrato data
      const savedData = contratoData.find(
        (c) => c.fichaId === selectedFichaId && c.noCtto === group.noCtto && c.empresaContratada === group.proveedor
      )

      const valorCtto = savedData?.valorCtto || 0
      const ejecutado = savedData?.ejecutadoAniosAnteriores || 0
      const saldoPendiente = valorCtto - valorAutorizo - ejecutado

      return {
        id: `${selectedFichaId}-${group.noCtto}-${group.proveedor}`,
        fichaId: selectedFichaId!,
        inversion: savedData?.inversion || "",
        ueb,
        empresaContratada: group.proveedor,
        noCtto: group.noCtto,
        valorCtto,
        vigenciaCtto: savedData?.vigenciaCtto || "",
        firmaCtto: savedData?.firmaCtto || "",
        valorAutorizo,
        saldoPendiente,
        ejecutadoAniosAnteriores: ejecutado,
      }
    })
  }

  const contratoRows = selectedFichaId ? getContratoRows() : []

  const handleContratoChange = (
    noCtto: string,
    proveedor: string,
    field: keyof ContratoData,
    value: string | number
  ) => {
    setContratoData((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.fichaId === selectedFichaId && c.noCtto === noCtto && c.empresaContratada === proveedor
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], [field]: value }
        return updated
      }

      return [
        ...prev,
        {
          id: `${selectedFichaId}-${noCtto}-${proveedor}`,
          fichaId: selectedFichaId!,
          inversion: "",
          ueb: selectedFicha?.ueb || "",
          empresaContratada: proveedor,
          noCtto,
          valorCtto: 0,
          vigenciaCtto: "",
          firmaCtto: "",
          valorAutorizo: 0,
          saldoPendiente: 0,
          ejecutadoAniosAnteriores: 0,
          [field]: value,
        },
      ]
    })
  }

  return (
    <div className="space-y-6">
      {/* Selector de Ficha */}
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
        <label className="text-white font-semibold mb-2 block">Seleccionar Ficha de Inversión:</label>
        <Select
          value={selectedFichaId?.toString() || ""}
          onValueChange={(value) => setSelectedFichaId(Number.parseInt(value))}
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
          {/* Header */}
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="bg-green-200 border border-black p-3 text-center">
              <h2 className="font-bold text-black text-lg">TRAZABILIDAD DE LOS CONTRATOS Y AUTORIZOS</h2>
            </div>
          </div>

          {/* Tabla de Contratos */}
          <div className="bg-white rounded-lg overflow-x-auto shadow-lg">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-green-200">
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[120px]">Inversión</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[120px]">UEB</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">Empresa Contratada</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap">No. Ctto</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[100px]">Valor Ctto.</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[140px]">Vigencia Ctto.</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[100px]">Firma Ctto</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[120px]">Valor de Autorizo del ctto.</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[120px]">Saldo pendiente</th>
                  <th className="border border-black p-2 text-black font-bold whitespace-nowrap min-w-[140px]">Ejecutado de años anteriores</th>
                </tr>
              </thead>
              <tbody>
                {contratoRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="border border-black p-4 text-center text-gray-500">
                      No hay contratos para esta ficha. Cree autorizos con número de contrato en el Módulo 3.
                    </td>
                  </tr>
                ) : (
                  contratoRows.map((row) => {
                    const valorCtto = contratoData.find(
                      (c) => c.fichaId === selectedFichaId && c.noCtto === row.noCtto && c.empresaContratada === row.empresaContratada
                    )?.valorCtto || row.valorCtto

                    const ejecutado = contratoData.find(
                      (c) => c.fichaId === selectedFichaId && c.noCtto === row.noCtto && c.empresaContratada === row.empresaContratada
                    )?.ejecutadoAniosAnteriores || row.ejecutadoAniosAnteriores

                    const saldoPendiente = valorCtto - row.valorAutorizo - ejecutado

                    return (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {/* Inversión - editable text */}
                        <td className="border border-black p-1">
                          <Input
                            type="text"
                            value={
                              contratoData.find(
                                (c) => c.fichaId === selectedFichaId && c.noCtto === row.noCtto && c.empresaContratada === row.empresaContratada
                              )?.inversion || row.inversion
                            }
                            onChange={(e) =>
                              handleContratoChange(row.noCtto, row.empresaContratada, "inversion", e.target.value)
                            }
                            placeholder="Ej: Vivienda"
                            className="h-8 text-xs bg-white border-0 text-black"
                          />
                        </td>

                        {/* UEB - from control autorizo */}
                        <td className="border border-black p-2 text-center text-black">
                          {row.ueb}
                        </td>

                        {/* Empresa Contratada - from autorizo */}
                        <td className="border border-black p-2 text-center text-black">
                          {row.empresaContratada}
                        </td>

                        {/* No. Ctto - from autorizo */}
                        <td className="border border-black p-2 text-center text-black">
                          {row.noCtto}
                        </td>

                        {/* Valor Ctto - editable */}
                        <td className="border border-black p-1">
                          <Input
                            type="number"
                            value={valorCtto || ""}
                            onChange={(e) =>
                              handleContratoChange(
                                row.noCtto,
                                row.empresaContratada,
                                "valorCtto",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                            min="0"
                            className="h-8 text-xs text-center bg-white border-0 text-black"
                          />
                        </td>

                        {/* Vigencia Ctto - editable text */}
                        <td className="border border-black p-1">
                          <Input
                            type="text"
                            value={
                              contratoData.find(
                                (c) => c.fichaId === selectedFichaId && c.noCtto === row.noCtto && c.empresaContratada === row.empresaContratada
                              )?.vigenciaCtto || row.vigenciaCtto
                            }
                            onChange={(e) =>
                              handleContratoChange(row.noCtto, row.empresaContratada, "vigenciaCtto", e.target.value)
                            }
                            placeholder="Ej: Cumplimiento de las obligaciones"
                            className="h-8 text-xs bg-white border-0 text-black"
                          />
                        </td>

                        {/* Firma Ctto - editable text */}
                        <td className="border border-black p-1">
                          <Input
                            type="text"
                            value={
                              contratoData.find(
                                (c) => c.fichaId === selectedFichaId && c.noCtto === row.noCtto && c.empresaContratada === row.empresaContratada
                              )?.firmaCtto || row.firmaCtto
                            }
                            onChange={(e) =>
                              handleContratoChange(row.noCtto, row.empresaContratada, "firmaCtto", e.target.value)
                            }
                            placeholder="dd.mm.yyyy"
                            className="h-8 text-xs text-center bg-white border-0 text-black"
                          />
                        </td>

                        {/* Valor de Autorizo - calculated */}
                        <td className="border border-black p-2 text-center text-black font-semibold">
                          {row.valorAutorizo > 0 ? row.valorAutorizo.toFixed(2) : "0.00"}
                        </td>

                        {/* Saldo Pendiente - calculated */}
                        <td className={`border border-black p-2 text-center font-semibold ${
                          saldoPendiente < 0 ? "text-red-600" : saldoPendiente > 0 ? "text-green-600" : "text-black"
                        }`}>
                          {saldoPendiente.toFixed(2)}
                        </td>

                        {/* Ejecutado de años anteriores - editable */}
                        <td className="border border-black p-1">
                          <Input
                            type="number"
                            value={ejecutado || ""}
                            onChange={(e) =>
                              handleContratoChange(
                                row.noCtto,
                                row.empresaContratada,
                                "ejecutadoAniosAnteriores",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0.00"
                            min="0"
                            className="h-8 text-xs text-center bg-white border-0 text-black"
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
          <p className="text-blue-200 text-lg">Seleccione una ficha de inversión para ver la trazabilidad de contratos</p>
        </div>
      )}
    </div>
  )
}
