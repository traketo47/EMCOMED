"use client"

import { useState } from "react"
import type { Investment } from "@/app/dashboard/plan-inversion/page"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type InvestmentTableProps = {
  investments: Investment[]
  onEdit: (investment: Investment) => void
  onDelete: (id: number) => void
  onAddSubInvestment: (parent: Investment) => void
  onDeleteSubInvestment: (parentId: number, subId: number) => void
  onEditSubInvestment: (parent: Investment, subInvestment: Investment) => void
}

export function InvestmentTable({
  investments,
  onEdit,
  onDelete,
  onAddSubInvestment,
  onDeleteSubInvestment,
  onEditSubInvestment,
}: InvestmentTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const handleViewFile = (archivoData: { name: string; type: string; data: string }) => {
    const byteString = atob(archivoData.data.split(",")[1])
    const mimeString = archivoData.data.split(",")[0].split(":")[1].split(";")[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const validateSubInvestmentSums = (parent: Investment) => {
    if (!parent.subInvestments || parent.subInvestments.length === 0) return null

    const sums = {
      total: 0,
      cyM: 0,
      equipo: 0,
      otros: 0,
      ppt: 0,
      importacion: 0,
      fb: 0,
    }

    parent.subInvestments.forEach((sub) => {
      sums.total += sub.planAnio.total
      sums.cyM += sub.planAnio.cyM
      sums.equipo += sub.planAnio.equipo
      sums.otros += sub.planAnio.otros
      sums.ppt += sub.planAnio.ppt
      sums.importacion += sub.planAnio.importacion
      sums.fb += sub.planAnio.fb
    })

    const isValid =
      sums.total === parent.planAnio.total &&
      sums.cyM === parent.planAnio.cyM &&
      sums.equipo === parent.planAnio.equipo &&
      sums.otros === parent.planAnio.otros &&
      sums.ppt === parent.planAnio.ppt &&
      sums.importacion === parent.planAnio.importacion &&
      sums.fb === parent.planAnio.fb

    return { isValid, sums }
  }

  if (investments.length === 0) {
    return (
      <Card className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm p-12 text-center">
        <p className="text-blue-200 text-lg">No hay fichas registradas</p>
        <p className="text-blue-300/70 mt-2">Haz clic en "Agregar Nueva Ficha" para comenzar</p>
      </Card>
    )
  }

  return (
    <Card className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-blue-500/30 hover:bg-slate-700/50">
              <TableHead className="text-blue-300">Ficha</TableHead>
              <TableHead className="text-blue-300">Tipo</TableHead>
              <TableHead className="text-blue-300">Código</TableHead>
              <TableHead className="text-blue-300">Descripción</TableHead>
              <TableHead className="text-blue-300">Fundamentación</TableHead>
              <TableHead className="text-blue-300 text-center" colSpan={7}>
                Plan del Año (MCUP)
              </TableHead>
              <TableHead className="text-blue-300">Archivo</TableHead>
              <TableHead className="text-blue-300 text-center">Acciones</TableHead>
            </TableRow>
            <TableRow className="border-blue-500/30 hover:bg-slate-700/50">
              <TableHead colSpan={5}></TableHead>
              <TableHead className="text-blue-300/70 text-xs">Total</TableHead>
              <TableHead className="text-blue-300/70 text-xs">C y M</TableHead>
              <TableHead className="text-blue-300/70 text-xs">Equipo</TableHead>
              <TableHead className="text-blue-300/70 text-xs">Otros</TableHead>
              <TableHead className="text-blue-300/70 text-xs">PPT</TableHead>
              <TableHead className="text-blue-300/70 text-xs">Importación</TableHead>
              <TableHead className="text-blue-300/70 text-xs">FB</TableHead>
              <TableHead colSpan={2}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => {
              const validation = investment.tipo === "M" ? validateSubInvestmentSums(investment) : null
              return (
                <>
                  <TableRow key={investment.id} className="border-blue-500/20 hover:bg-slate-700/30">
                    <TableCell className="text-white font-medium">
                      {investment.tipo === "M" && (
                        <button
                          onClick={() => toggleRow(investment.id)}
                          className="mr-2 text-blue-400 hover:text-blue-300"
                        >
                          {expandedRows.has(investment.id) ? "▼" : "▶"}
                        </button>
                      )}
                      {investment.id}
                      {validation && !validation.isValid && (
                        <span className="ml-2 text-red-400 text-xs" title="Las sub-fichas no suman correctamente">
                          ⚠️
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-blue-200">
                      <span className="px-2 py-1 rounded bg-blue-600/30 text-blue-300 text-xs font-medium">
                        {investment.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="text-blue-200">{investment.codigo}</TableCell>
                    <TableCell className="text-blue-200">{investment.descripcion}</TableCell>
                    <TableCell className="text-blue-200 max-w-xs truncate" title={investment.fundamentacion}>
                      {investment.fundamentacion}
                    </TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.total.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.cyM.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.equipo.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.otros.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.ppt.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.importacion.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">${investment.planAnio.fb.toLocaleString()}</TableCell>
                    <TableCell className="text-blue-200">
                      {investment.archivoData ? (
                        <Button
                          onClick={() => handleViewFile(investment.archivoData!)}
                          variant="outline"
                          size="sm"
                          className="border-green-500/30 bg-slate-700/50 text-green-300 hover:bg-green-600 hover:text-white text-xs"
                        >
                          Ver Archivo
                        </Button>
                      ) : (
                        <span className="text-xs text-blue-300/50">Sin archivo</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        {investment.tipo === "M" && (
                          <Button
                            onClick={() => onAddSubInvestment(investment)}
                            variant="outline"
                            size="sm"
                            className="border-green-500/30 bg-slate-700/50 text-green-300 hover:bg-green-600 hover:text-white"
                          >
                            + Sub-Ficha
                          </Button>
                        )}
                        <Button
                          onClick={() => onEdit(investment)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30 bg-slate-700/50 text-blue-300 hover:bg-blue-600 hover:text-white"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => onDelete(investment.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 bg-slate-700/50 text-red-300 hover:bg-red-600 hover:text-white"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {investment.tipo === "M" &&
                    expandedRows.has(investment.id) &&
                    investment.subInvestments &&
                    investment.subInvestments.map((subInv) => (
                      <TableRow
                        key={`${investment.id}-${subInv.id}`}
                        className="border-blue-500/20 bg-slate-700/20 hover:bg-slate-700/40"
                      >
                        <TableCell className="text-blue-100 font-medium pl-12">
                          {investment.id}.{subInv.id}
                        </TableCell>
                        <TableCell className="text-blue-200">
                          <span className="px-2 py-1 rounded bg-purple-600/30 text-purple-300 text-xs font-medium">
                            {subInv.tipo}
                          </span>
                        </TableCell>
                        <TableCell className="text-blue-200">{subInv.codigo}</TableCell>
                        <TableCell className="text-blue-200">{subInv.descripcion}</TableCell>
                        <TableCell className="text-blue-200 max-w-xs truncate" title={subInv.fundamentacion}>
                          {subInv.fundamentacion}
                        </TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.total.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.cyM.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.equipo.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.otros.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.ppt.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.importacion.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">${subInv.planAnio.fb.toLocaleString()}</TableCell>
                        <TableCell className="text-blue-200">
                          {subInv.archivoData ? (
                            <Button
                              onClick={() => handleViewFile(subInv.archivoData!)}
                              variant="outline"
                              size="sm"
                              className="border-green-500/30 bg-slate-700/50 text-green-300 hover:bg-green-600 hover:text-white text-xs"
                            >
                              Ver Archivo
                            </Button>
                          ) : (
                            <span className="text-xs text-blue-300/50">Sin archivo</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              onClick={() => onEditSubInvestment(investment, subInv)}
                              variant="outline"
                              size="sm"
                              className="border-blue-500/30 bg-slate-700/50 text-blue-300 hover:bg-blue-600 hover:text-white"
                            >
                              Editar
                            </Button>
                            <Button
                              onClick={() => onDeleteSubInvestment(investment.id, subInv.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 bg-slate-700/50 text-red-300 hover:bg-red-600 hover:text-white"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
