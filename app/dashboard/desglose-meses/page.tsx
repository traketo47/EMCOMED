"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MonthlyBreakdownTable } from "@/components/monthly-breakdown-table"
import type { Investment } from "@/app/dashboard/plan-inversion/page"

export type MonthlyValue = {
  [month: string]: number
}

export type FichaBreakdown = {
  fichaId: string
  fichaNumero: number
  esSubficha: boolean
  parentId?: number
  ueb: string
  descripcion: string
  color: string
  planAnio: {
    cyM: number
    equipo: number
    otros: number
    ppt: number
    importacion: number
    fb: number
  }
  categories: {
    cyM: MonthlyValue
    equipo: MonthlyValue
    otros: MonthlyValue
    ppt: MonthlyValue
    importacion: MonthlyValue
    fb: MonthlyValue
  }
}

export type UEBGroup = {
  ueb: string
  fichas: FichaBreakdown[]
}

const MONTHS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
const MONTH_KEYS = ["E", "F", "M", "A", "M2", "J", "J2", "A2", "S", "O", "N", "D"]

const COLORS = [
  "#FEF3C7",
  "#DCFCE7",
  "#FCE7F3",
  "#DBEAFE",
  "#F3E8FF",
  "#FFEDD5",
  "#E0F2FE",
  "#FEE2E2",
  "#D1FAE5",
  "#FED7AA",
  "#E9D5FF",
  "#C7D2FE",
  "#FCA5A5",
  "#A7F3D0",
  "#FBBF24",
  "#A78BFA",
  "#34D399",
  "#FB923C",
  "#60A5FA",
  "#F87171",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
]

export default function DesgloseMesesPage() {
  const router = useRouter()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [breakdowns, setBreakdowns] = useState<FichaBreakdown[]>([])
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set())

  // Load investments from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("investments")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setInvestments(parsed)
      } catch (e) {
        console.error("Error loading investments:", e)
      }
    }
  }, [])

  // Load breakdowns from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("monthlyBreakdownsV2")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setBreakdowns(parsed)
        // Track used colors
        const colors = new Set(parsed.map((b: FichaBreakdown) => b.color))
        setUsedColors(colors)
      } catch (e) {
        console.error("Error loading breakdowns:", e)
      }
    }
  }, [])

  // Initialize breakdowns for new investments
  useEffect(() => {
    const newBreakdowns: FichaBreakdown[] = []
    const currentUsedColors = new Set(usedColors)
    let colorIndex = 0

    investments.forEach((investment) => {
      if (investment.tipo === "E" || investment.tipo === "C") {
        const fichaId = `${investment.id}`
        const existingBreakdown = breakdowns.find((b) => b.fichaId === fichaId)

        if (!existingBreakdown) {
          const emptyMonths: MonthlyValue = {}
          MONTH_KEYS.forEach((month) => {
            emptyMonths[month] = 0
          })

          // Find available color
          let selectedColor = COLORS[colorIndex % COLORS.length]
          while (currentUsedColors.has(selectedColor)) {
            colorIndex++
            selectedColor = COLORS[colorIndex % COLORS.length]
          }
          currentUsedColors.add(selectedColor)
          colorIndex++

          newBreakdowns.push({
            fichaId,
            fichaNumero: investment.id,
            esSubficha: false,
            ueb: investment.ueb || "Sin UEB",
            descripcion: investment.descripcion,
            color: selectedColor,
            planAnio: investment.planAnio,
            categories: {
              cyM: { ...emptyMonths },
              equipo: { ...emptyMonths },
              otros: { ...emptyMonths },
              ppt: { ...emptyMonths },
              importacion: { ...emptyMonths },
              fb: { ...emptyMonths },
            },
          })
        }
      } else if (investment.tipo === "M" && investment.subInvestments) {
        investment.subInvestments.forEach((subInv) => {
          const fichaId = `${investment.id}-${subInv.id}`
          const existingBreakdown = breakdowns.find((b) => b.fichaId === fichaId)

          if (!existingBreakdown) {
            const emptyMonths: MonthlyValue = {}
            MONTH_KEYS.forEach((month) => {
              emptyMonths[month] = 0
            })

            // Find available color
            let selectedColor = COLORS[colorIndex % COLORS.length]
            while (currentUsedColors.has(selectedColor)) {
              colorIndex++
              selectedColor = COLORS[colorIndex % COLORS.length]
            }
            currentUsedColors.add(selectedColor)
            colorIndex++

            newBreakdowns.push({
              fichaId,
              fichaNumero: subInv.id,
              esSubficha: true,
              parentId: investment.id,
              ueb: subInv.ueb || subInv.tipo || "Sin UEB",
              descripcion: investment.descripcion, // Heredada de la ficha principal
              color: selectedColor,
              planAnio: subInv.planAnio,
              categories: {
                cyM: { ...emptyMonths },
                equipo: { ...emptyMonths },
                otros: { ...emptyMonths },
                ppt: { ...emptyMonths },
                importacion: { ...emptyMonths },
                fb: { ...emptyMonths },
              },
            })
          }
        })
      }
    })

    if (newBreakdowns.length > 0) {
      setBreakdowns((prev) => [...prev, ...newBreakdowns])
      setUsedColors(currentUsedColors)
    }
  }, [investments])

  // Save breakdowns to localStorage
  useEffect(() => {
    if (breakdowns.length > 0) {
      localStorage.setItem("monthlyBreakdownsV2", JSON.stringify(breakdowns))
    }
  }, [breakdowns])

  const handleUpdateValue = (fichaId: string, category: string, month: string, value: number) => {
    setBreakdowns((prev) =>
      prev.map((breakdown) => {
        if (breakdown.fichaId !== fichaId) return breakdown

        const categoryKey = category as keyof typeof breakdown.categories
        return {
          ...breakdown,
          categories: {
            ...breakdown.categories,
            [categoryKey]: {
              ...breakdown.categories[categoryKey],
              [month]: value,
            },
          },
        }
      }),
    )
  }

  const handleColorChange = (fichaId: string, color: string) => {
    setBreakdowns((prev) =>
      prev.map((breakdown) => {
        if (breakdown.fichaId !== fichaId) return breakdown
        return { ...breakdown, color }
      }),
    )

    const newUsedColors = new Set(usedColors)
    const oldColor = breakdowns.find((b) => b.fichaId === fichaId)?.color
    if (oldColor) {
      newUsedColors.delete(oldColor)
    }
    newUsedColors.add(color)
    setUsedColors(newUsedColors)
  }

  const getGroupedByUEB = (): UEBGroup[] => {
    const grouped: { [ueb: string]: FichaBreakdown[] } = {}

    breakdowns.forEach((breakdown) => {
      if (!grouped[breakdown.ueb]) {
        grouped[breakdown.ueb] = []
      }
      grouped[breakdown.ueb].push(breakdown)
    })

    return Object.entries(grouped)
      .sort(([uebA], [uebB]) => uebA.localeCompare(uebB))
      .map(([ueb, fichas]) => ({ ueb, fichas }))
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
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="mb-4 border-blue-500/30 bg-slate-800/80 text-blue-200 hover:bg-slate-700 hover:text-white"
            >
              ← Volver al Dashboard
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              Desglose del Plan por Meses
            </h1>
            <p className="text-blue-200 mt-2">Control de presupuesto por mes y UEB</p>
          </div>
        </div>

        {breakdowns.length === 0 ? (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-8 text-center border border-blue-500/30">
            <p className="text-blue-200 text-lg">
              No hay fichas registradas. Primero agregue fichas en el módulo "Plan de Inversión".
            </p>
            <Button
              onClick={() => router.push("/dashboard/plan-inversion")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Ir a Plan de Inversión
            </Button>
          </div>
        ) : (
          <MonthlyBreakdownTable
            breakdowns={breakdowns}
            uebGroups={getGroupedByUEB()}
            onUpdateValue={handleUpdateValue}
            onColorChange={handleColorChange}
            availableColors={COLORS.filter((c) => !usedColors.has(c))}
          />
        )}
      </div>
    </div>
  )
}
