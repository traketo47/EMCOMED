"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { FichaBreakdown, UEBGroup } from "@/app/dashboard/desglose-meses/page"

const MONTHS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
const MONTH_KEYS = ["E", "F", "M", "A", "M2", "J", "J2", "A2", "S", "O", "N", "D"]

const CATEGORIES = [
  { key: "cyM", label: "C y M" },
  { key: "equipo", label: "Equipo" },
  { key: "otros", label: "Otros" },
  { key: "ppt", label: "PPT" },
  { key: "importacion", label: "Importación" },
  { key: "fb", label: "FB" },
]

type Props = {
  breakdowns: FichaBreakdown[]
  uebGroups: UEBGroup[]
  onUpdateValue: (fichaId: string, category: string, month: string, value: number) => void
  onColorChange: (fichaId: string, color: string) => void
  availableColors: string[]
}

export function MonthlyBreakdownTable({ breakdowns, uebGroups, onUpdateValue, onColorChange, availableColors }: Props) {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)

  const calculateTotal = (breakdown: FichaBreakdown, category: string): number => {
    const categoryKey = category as keyof typeof breakdown.categories
    const monthValues = breakdown.categories[categoryKey]
    return MONTH_KEYS.reduce((sum, month) => sum + (monthValues[month] || 0), 0)
  }

  const getPlanTotal = (breakdown: FichaBreakdown, category: string): number => {
    const categoryMap: { [key: string]: keyof typeof breakdown.planAnio } = {
      cyM: "cyM",
      equipo: "equipo",
      otros: "otros",
      ppt: "ppt",
      importacion: "importacion",
      fb: "fb",
    }
    return breakdown.planAnio[categoryMap[category]] || 0
  }

  const isOverBudget = (breakdown: FichaBreakdown, category: string): boolean => {
    const total = calculateTotal(breakdown, category)
    const planTotal = getPlanTotal(breakdown, category)
    return total > planTotal
  }

  // Get categories with non-zero plan values for a ficha
  const getActiveCategories = (ficha: FichaBreakdown) => {
    return CATEGORIES.filter((cat) => getPlanTotal(ficha, cat.key) !== 0)
  }

  // Build flat rows structure
  type TableRow = {
    ueb: string
    uebRowSpan?: number
    showUeb: boolean
    ficha: FichaBreakdown
    fichaRowSpan?: number
    showFicha: boolean
    category: { key: string; label: string }
  }

  const rows: TableRow[] = []

  uebGroups.forEach((group) => {
    // Calculate total rows for this UEB
    let uebTotalRows = 0
    group.fichas.forEach((ficha) => {
      const activeCats = getActiveCategories(ficha)
      uebTotalRows += activeCats.length > 0 ? activeCats.length : 1
    })

    let isFirstUebRow = true

    group.fichas.forEach((ficha) => {
      const activeCategories = getActiveCategories(ficha)
      const categoriesToShow = activeCategories.length > 0 ? activeCategories : [{ key: "cyM", label: "C y M" }]

      categoriesToShow.forEach((category, catIdx) => {
        rows.push({
          ueb: group.ueb,
          uebRowSpan: isFirstUebRow ? uebTotalRows : undefined,
          showUeb: isFirstUebRow,
          ficha: ficha,
          fichaRowSpan: catIdx === 0 ? categoriesToShow.length : undefined,
          showFicha: catIdx === 0,
          category: category,
        })
        isFirstUebRow = false
      })
    })
  })

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg border border-blue-500/30 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-blue-500/30 bg-slate-900/50">
            <th className="p-3 text-left text-blue-200 font-semibold border border-blue-500/30 min-w-40">UEB</th>
            <th className="p-3 text-left text-blue-200 font-semibold border border-blue-500/30 min-w-52">
              Ficha de Inversión
            </th>
            <th className="p-3 text-left text-blue-200 font-semibold border border-blue-500/30 min-w-20">Plan</th>
            <th className="p-3 text-center text-blue-200 font-semibold border border-blue-500/30 w-20">Total</th>
            <th colSpan={12} className="p-2 text-center text-blue-200 font-semibold border border-blue-500/30">
              Desagregación del Plan MES
            </th>
            <th className="p-3 text-center text-blue-200 font-semibold border border-blue-500/30 w-20">Suma</th>
            <th className="p-3 text-center text-blue-200 font-semibold border border-blue-500/30 w-16">Color</th>
          </tr>
          <tr className="border-b border-blue-500/30 bg-slate-900/30">
            <th className="border border-blue-500/30"></th>
            <th className="border border-blue-500/30"></th>
            <th className="border border-blue-500/30"></th>
            <th className="border border-blue-500/30"></th>
            {MONTHS.map((month, idx) => (
              <th
                key={`${month}-${idx}`}
                className="p-2 text-center text-blue-300 font-medium border border-blue-500/30 w-16"
              >
                {month}
              </th>
            ))}
            <th className="border border-blue-500/30"></th>
            <th className="border border-blue-500/30"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const planTotal = getPlanTotal(row.ficha, row.category.key)
            const monthTotal = calculateTotal(row.ficha, row.category.key)
            const overBudget = isOverBudget(row.ficha, row.category.key)

            return (
              <tr key={`row-${idx}`} className="border-b border-blue-500/20 hover:bg-slate-700/20">
                {/* UEB Column with rowspan */}
                {row.showUeb && (
                  <td
                    rowSpan={row.uebRowSpan}
                    className="p-3 text-blue-100 font-medium border border-blue-500/30 bg-slate-800/90 align-top"
                  >
                    {row.ueb}
                  </td>
                )}

                {/* Ficha de Inversión with rowspan and color */}
                {row.showFicha && (
                  <td
                    rowSpan={row.fichaRowSpan}
                    className="p-3 text-white font-medium border border-blue-500/30 align-top"
                    style={{ backgroundColor: row.ficha.color + "30" }}
                  >
                    <div className="flex flex-col">
                      <span>{row.ficha.descripcion}</span>
                    </div>
                  </td>
                )}

                {/* Category */}
                <td
                  className="p-2 text-blue-200 border border-blue-500/30"
                  style={{ backgroundColor: row.ficha.color + "15" }}
                >
                  {row.category.label}
                </td>

                {/* Plan total */}
                <td
                  className="p-2 text-center font-semibold border border-blue-500/30 text-green-400"
                  style={{ backgroundColor: row.ficha.color + "15" }}
                >
                  {planTotal > 0 ? planTotal.toLocaleString() : "0"}
                </td>

                {/* Month inputs */}
                {MONTH_KEYS.map((month) => (
                  <td
                    key={month}
                    className="p-1 border border-blue-500/30"
                    style={{ backgroundColor: row.ficha.color + "08" }}
                  >
                    <Input
                      type="number"
                      min="0"
                      value={row.ficha.categories[row.category.key as keyof typeof row.ficha.categories][month] || ""}
                      placeholder="0"
                      onChange={(e) => {
                        const value = Math.max(0, Number(e.target.value) || 0)
                        onUpdateValue(row.ficha.fichaId, row.category.key, month, value)
                      }}
                      className="w-14 h-7 text-xs bg-slate-700/80 border-blue-500/30 text-white text-center p-1 focus:ring-blue-500"
                    />
                  </td>
                ))}

                {/* Month total */}
                <td
                  className={`p-2 text-center font-semibold border border-blue-500/30 ${overBudget ? "text-red-400 bg-red-500/20" : "text-blue-300"}`}
                  style={{ backgroundColor: overBudget ? undefined : row.ficha.color + "15" }}
                >
                  {monthTotal.toLocaleString()}
                </td>

                {/* Color picker - only show on first row of ficha */}
                {row.showFicha && (
                  <td rowSpan={row.fichaRowSpan} className="p-2 border border-blue-500/30 align-middle">
                    <div className="relative flex justify-center">
                      <button
                        onClick={() =>
                          setShowColorPicker(showColorPicker === row.ficha.fichaId ? null : row.ficha.fichaId)
                        }
                        className="w-7 h-7 rounded border-2 border-white/50 hover:border-white transition-colors"
                        style={{ backgroundColor: row.ficha.color }}
                      />
                      {showColorPicker === row.ficha.fichaId && (
                        <div className="absolute right-0 top-8 bg-slate-800 border border-blue-500/30 rounded-lg p-3 z-20 grid grid-cols-6 gap-2 shadow-xl">
                          {availableColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => {
                                onColorChange(row.ficha.fichaId, color)
                                setShowColorPicker(null)
                              }}
                              className="w-6 h-6 rounded border-2 border-white/30 hover:scale-110 hover:border-white transition-all"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={17} className="p-8 text-center text-blue-300">
                No hay fichas de inversión registradas. Crea fichas en el Módulo 1 (Plan de Inversión) primero.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
