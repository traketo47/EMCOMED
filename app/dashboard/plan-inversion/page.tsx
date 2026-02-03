"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { InvestmentTable } from "@/components/investment-table"
import { InvestmentFormDialog } from "@/components/investment-form-dialog"
import { useRouter } from "next/navigation"

export type Investment = {
  id: number
  tipo: "E" | "M" | "C" | string
  codigo: string
  descripcion: string
  fundamentacion: string
  ueb: string
  planAnio: {
    total: number
    cyM: number
    equipo: number
    otros: number
    ppt: number
    importacion: number
    fb: number
  }
  archivo?: File | null
  archivoData?: { name: string; type: string; data: string } | null
  subInvestments?: Investment[]
  color?: string
}

export default function PlanInversionPage() {
  const router = useRouter()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null)
  const [parentInvestment, setParentInvestment] = useState<Investment | null>(null)
  const [editingSubInvestment, setEditingSubInvestment] = useState<Investment | null>(null)

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

  useEffect(() => {
    if (investments.length >= 0) {
      localStorage.setItem("investments", JSON.stringify(investments))
    }
  }, [investments])

  const handleAddInvestment = (investment: Omit<Investment, "id">) => {
    if (parentInvestment) {
      if (editingSubInvestment) {
        const updatedSubs = parentInvestment.subInvestments?.map((sub) =>
          sub.id === editingSubInvestment.id ? { ...investment, id: sub.id, subInvestments: [] } : sub,
        )
        const updatedParent = {
          ...parentInvestment,
          subInvestments: updatedSubs,
        }
        setInvestments(investments.map((inv) => (inv.id === parentInvestment.id ? updatedParent : inv)))
        setEditingSubInvestment(null)
      } else {
        const updatedParent = {
          ...parentInvestment,
          subInvestments: [
            ...(parentInvestment.subInvestments || []),
            {
              ...investment,
              id: (parentInvestment.subInvestments?.length || 0) + 1,
              subInvestments: [],
            },
          ],
        }
        setInvestments(investments.map((inv) => (inv.id === parentInvestment.id ? updatedParent : inv)))
      }
      setParentInvestment(null)
    } else {
      const newInvestment = {
        ...investment,
        id: investments.length + 1,
        subInvestments: [],
      }
      setInvestments([...investments, newInvestment])
    }
    setIsDialogOpen(false)
  }

  const handleEditInvestment = (investment: Investment) => {
    const currentInvestment = investments.find((inv) => inv.id === investment.id)
    const updatedInvestment = {
      ...investment,
      subInvestments: currentInvestment?.subInvestments || [],
    }
    setInvestments(investments.map((inv) => (inv.id === investment.id ? updatedInvestment : inv)))
    setEditingInvestment(null)
    setIsDialogOpen(false)
  }

  const handleDeleteInvestment = (id: number) => {
    const filtered = investments.filter((inv) => inv.id !== id)
    const renumbered = filtered.map((inv, index) => ({ ...inv, id: index + 1 }))
    setInvestments(renumbered)
  }

  const handleDeleteSubInvestment = (parentId: number, subId: number) => {
    const parent = investments.find((inv) => inv.id === parentId)
    if (!parent) return

    const filtered = (parent.subInvestments || []).filter((sub) => sub.id !== subId)
    const renumbered = filtered.map((sub, index) => ({ ...sub, id: index + 1 }))

    const updatedParent = { ...parent, subInvestments: renumbered }
    setInvestments(investments.map((inv) => (inv.id === parentId ? updatedParent : inv)))
  }

  const handleEditClick = (investment: Investment) => {
    setEditingInvestment(investment)
    setIsDialogOpen(true)
  }

  const handleAddSubInvestment = (parent: Investment) => {
    setParentInvestment(parent)
    setIsDialogOpen(true)
  }

  const handleEditSubInvestment = (parent: Investment, subInvestment: Investment) => {
    setParentInvestment(parent)
    setEditingSubInvestment(subInvestment)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingInvestment(null)
    setParentInvestment(null)
    setEditingSubInvestment(null)
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
              Plan de Inversión
            </h1>
            <p className="text-blue-200 mt-2">Gestión de fichas de inversión</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            + Agregar Nueva Ficha
          </Button>
        </div>

        <InvestmentTable
          investments={investments}
          onEdit={handleEditClick}
          onDelete={handleDeleteInvestment}
          onAddSubInvestment={handleAddSubInvestment}
          onDeleteSubInvestment={handleDeleteSubInvestment}
          onEditSubInvestment={handleEditSubInvestment}
        />

        <InvestmentFormDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onSubmit={editingInvestment ? handleEditInvestment : handleAddInvestment}
          editingInvestment={editingInvestment}
          isSubInvestment={!!parentInvestment}
          parentInvestment={parentInvestment}
          editingSubInvestment={editingSubInvestment}
        />
      </div>
    </div>
  )
}
