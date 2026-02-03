"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Investment } from "@/app/dashboard/plan-inversion/page"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PROVINCE_CODES = {
  Artemisa: "21",
  Aseguramiento: "41",
  "BNT Santiago": "38",
  Camaguey: "28",
  "Ciego de Ávila": "27",
  Cienfuegos: "24",
  Granma: "31",
  Guantánamo: "33",
  Holguín: "30",
  "Isla de la Juventud": "34",
  "La Habana": "22",
  "Las Tunas": "29",
  Matanzas: "23",
  Mayabeque: "45",
  Operaciones: "36",
  "Pinar del Río": "20",
  Plataforma: "35",
  "Sancti Spíritus": "26",
  "Santiago de Cuba": "32",
  "Suministros Farmaceuticos": "46",
  "Villa Clara": "25",
} as const

export { PROVINCE_CODES }

type InvestmentFormDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (investment: any) => void
  editingInvestment: Investment | null
  isSubInvestment?: boolean
  parentInvestment?: Investment | null
  editingSubInvestment?: Investment | null
}

export function InvestmentFormDialog({
  open,
  onClose,
  onSubmit,
  editingInvestment,
  isSubInvestment = false,
  parentInvestment,
  editingSubInvestment,
}: InvestmentFormDialogProps) {
  const [formData, setFormData] = useState({
    tipo: isSubInvestment ? "Artemisa" : ("E" as string),
    codigo: "",
    descripcion: "",
    fundamentacion: "",
    ueb: "Artemisa",
    planAnio: {
      total: 0,
      cyM: 0,
      equipo: 0,
      otros: 0,
      ppt: 0,
      importacion: 0,
      fb: 0,
    },
    archivo: null as File | null,
    archivoData: null as { name: string; type: string; data: string } | null,
  })

  const calculateTotal = (planAnio: typeof formData.planAnio) => {
    return planAnio.cyM + planAnio.equipo + planAnio.otros
  }

  useEffect(() => {
    if (editingSubInvestment) {
      setFormData({
        tipo: editingSubInvestment.tipo,
        codigo: editingSubInvestment.codigo,
        descripcion: editingSubInvestment.descripcion,
        fundamentacion: editingSubInvestment.fundamentacion,
        ueb: editingSubInvestment.ueb || "Artemisa",
        planAnio: editingSubInvestment.planAnio,
        archivo: null,
        archivoData: editingSubInvestment.archivoData || null,
      })
    } else if (editingInvestment) {
      setFormData({
        tipo: editingInvestment.tipo,
        codigo: editingInvestment.codigo,
        descripcion: editingInvestment.descripcion,
        fundamentacion: editingInvestment.fundamentacion,
        ueb: editingInvestment.ueb || "Artemisa",
        planAnio: editingInvestment.planAnio,
        archivo: null,
        archivoData: editingInvestment.archivoData || null,
      })
    } else {
      let codigo = ""
      let descripcion = ""
      if (isSubInvestment && parentInvestment) {
        const last4 = parentInvestment.codigo.slice(-4)
        codigo = last4 + PROVINCE_CODES["Artemisa"]
        descripcion = parentInvestment.descripcion
      }

      setFormData({
        tipo: isSubInvestment ? "Artemisa" : "E",
        codigo: codigo,
        descripcion: descripcion,
        fundamentacion: "",
        ueb: "Artemisa",
        planAnio: {
          total: 0,
          cyM: 0,
          equipo: 0,
          otros: 0,
          ppt: 0,
          importacion: 0,
          fb: 0,
        },
        archivo: null,
        archivoData: null,
      })
    }
  }, [editingInvestment, editingSubInvestment, open, isSubInvestment, parentInvestment])

  useEffect(() => {
    if (isSubInvestment && parentInvestment && formData.tipo in PROVINCE_CODES && !editingSubInvestment) {
      const last4 = parentInvestment.codigo.slice(-4)
      const provinceCode = PROVINCE_CODES[formData.tipo as keyof typeof PROVINCE_CODES]
      setFormData((prev) => ({ ...prev, codigo: last4 + provinceCode }))
    }
  }, [formData.tipo, isSubInvestment, parentInvestment, editingSubInvestment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSubInvestment && formData.codigo.length !== 7) {
      alert("El código debe tener exactamente 7 dígitos")
      return
    }

    const hasPPT = formData.planAnio.ppt > 0
    const hasOthers = formData.planAnio.cyM > 0 || formData.planAnio.equipo > 0 || formData.planAnio.otros > 0

    if (hasPPT && hasOthers) {
      alert("Si PPT tiene valor, no puede llenar C y M, Equipo u Otros (y viceversa)")
      return
    }

    const total = calculateTotal(formData.planAnio)

    let archivoData = formData.archivoData
    if (formData.archivo) {
      const reader = new FileReader()
      archivoData = await new Promise<{ name: string; type: string; data: string }>((resolve) => {
        reader.onload = () => {
          resolve({
            name: formData.archivo!.name,
            type: formData.archivo!.type,
            data: reader.result as string,
          })
        }
        reader.readAsDataURL(formData.archivo!)
      })
    }

    const submitData = {
      ...formData,
      planAnio: {
        ...formData.planAnio,
        total,
      },
      archivoData,
      archivo: null,
    }

    if (editingInvestment) {
      onSubmit({ ...submitData, id: editingInvestment.id })
    } else if (editingSubInvestment) {
      onSubmit({ ...submitData, id: editingSubInvestment.id })
    } else {
      onSubmit(submitData)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, archivo: e.target.files[0] })
    }
  }

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 7)
    setFormData({ ...formData, codigo: value })
  }

  const handleMoneyInput = (field: keyof typeof formData.planAnio, value: string) => {
    const numValue = value === "" ? 0 : Math.abs(Number(value))

    if (field === "ppt" && numValue > 0) {
      setFormData({
        ...formData,
        planAnio: { ...formData.planAnio, cyM: 0, equipo: 0, otros: 0, [field]: numValue },
      })
    } else if (["cyM", "equipo", "otros"].includes(field) && numValue > 0) {
      setFormData({ ...formData, planAnio: { ...formData.planAnio, ppt: 0, [field]: numValue } })
    } else {
      setFormData({ ...formData, planAnio: { ...formData.planAnio, [field]: numValue } })
    }
  }

  const currentTotal = calculateTotal(formData.planAnio)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-blue-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {isSubInvestment
              ? editingSubInvestment
                ? "Editar Sub-Ficha"
                : `Nueva Sub-Ficha (${parentInvestment?.id}.${(parentInvestment?.subInvestments?.length || 0) + 1})`
              : editingInvestment
                ? "Editar Ficha de Inversión"
                : "Nueva Ficha de Inversión"}
          </DialogTitle>
          <DialogDescription className="text-blue-200">
            Complete todos los campos para registrar la ficha
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo" className="text-blue-200">
                {isSubInvestment ? "Provincia/Entidad" : "Tipo"}
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: string) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="bg-slate-700 border-blue-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-blue-500/30 max-h-[300px]">
                  {isSubInvestment ? (
                    <>
                      {Object.keys(PROVINCE_CODES).map((province) => (
                        <SelectItem key={province} value={province} className="text-white">
                          {province}
                        </SelectItem>
                      ))}
                    </>
                  ) : (
                    <>
                      <SelectItem value="E" className="text-white">
                        E - Específica
                      </SelectItem>
                      <SelectItem value="M" className="text-white">
                        M - Múltiple
                      </SelectItem>
                      <SelectItem value="C" className="text-white">
                        C - Centralizada
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="codigo" className="text-blue-200">
                {isSubInvestment ? "Código (auto-generado, 6 dígitos)" : "Código (7 dígitos)"}
              </Label>
              <Input
                id="codigo"
                type="text"
                value={formData.codigo}
                onChange={handleCodigoChange}
                className="bg-slate-700 border-blue-500/30 text-white"
                placeholder={isSubInvestment ? "000000" : "0000000"}
                maxLength={isSubInvestment ? 6 : 7}
                disabled={isSubInvestment}
                required
              />
              <p className="text-xs text-blue-300/50 mt-1">
                {formData.codigo.length}/{isSubInvestment ? 6 : 7} dígitos
              </p>
            </div>
          </div>

          {!isSubInvestment && (
            <div>
              <Label htmlFor="ueb" className="text-blue-200">
                UEB (Provincia/Entidad)
              </Label>
              <Select value={formData.ueb} onValueChange={(value: string) => setFormData({ ...formData, ueb: value })}>
                <SelectTrigger className="bg-slate-700 border-blue-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-blue-500/30 max-h-[300px]">
                  {Object.keys(PROVINCE_CODES).map((province) => (
                    <SelectItem key={province} value={province} className="text-white">
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="descripcion" className="text-blue-200">
              Descripción
            </Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="bg-slate-700 border-blue-500/30 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="fundamentacion" className="text-blue-200">
              Fundamentación
            </Label>
            <Textarea
              id="fundamentacion"
              value={formData.fundamentacion}
              onChange={(e) => setFormData({ ...formData, fundamentacion: e.target.value })}
              className="bg-slate-700 border-blue-500/30 text-white min-h-[100px]"
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Plan del Año (MCUP)</h3>
            <p className="text-xs text-yellow-300 mb-4">
              Si llena PPT, no puede llenar C y M, Equipo u Otros (y viceversa)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="total" className="text-blue-200 text-sm">
                  Total (auto-calculado)
                </Label>
                <Input
                  id="total"
                  type="number"
                  value={currentTotal}
                  disabled
                  className="bg-slate-600 border-blue-500/30 text-white cursor-not-allowed"
                />
              </div>
              <div>
                <Label htmlFor="cyM" className="text-blue-200 text-sm">
                  C y M
                </Label>
                <Input
                  id="cyM"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.planAnio.cyM || ""}
                  onChange={(e) => handleMoneyInput("cyM", e.target.value)}
                  className="bg-slate-700 border-blue-500/30 text-white"
                  disabled={formData.planAnio.ppt > 0}
                />
              </div>
              <div>
                <Label htmlFor="equipo" className="text-blue-200 text-sm">
                  Equipo
                </Label>
                <Input
                  id="equipo"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.planAnio.equipo || ""}
                  onChange={(e) => handleMoneyInput("equipo", e.target.value)}
                  className="bg-slate-700 border-blue-500/30 text-white"
                  disabled={formData.planAnio.ppt > 0}
                />
              </div>
              <div>
                <Label htmlFor="otros" className="text-blue-200 text-sm">
                  Otros
                </Label>
                <Input
                  id="otros"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.planAnio.otros || ""}
                  onChange={(e) => handleMoneyInput("otros", e.target.value)}
                  className="bg-slate-700 border-blue-500/30 text-white"
                  disabled={formData.planAnio.ppt > 0}
                />
              </div>
              <div>
                <Label htmlFor="ppt" className="text-blue-200 text-sm">
                  PPT
                </Label>
                <Input
                  id="ppt"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.planAnio.ppt || ""}
                  onChange={(e) => handleMoneyInput("ppt", e.target.value)}
                  className="bg-slate-700 border-blue-500/30 text-white"
                  disabled={formData.planAnio.cyM > 0 || formData.planAnio.equipo > 0 || formData.planAnio.otros > 0}
                />
              </div>
              <div>
                <Label htmlFor="importacion" className="text-blue-200 text-sm">
                  Importación
                </Label>
                <Input
                  id="importacion"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.planAnio.importacion || ""}
                  onChange={(e) => handleMoneyInput("importacion", e.target.value)}
                  className="bg-slate-700 border-blue-500/30 text-white"
                />
              </div>
              <div>
                <Label htmlFor="fb" className="text-blue-200 text-sm">
                  FB
                </Label>
                <Input
                  id="fb"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.planAnio.fb || ""}
                  onChange={(e) => handleMoneyInput("fb", e.target.value)}
                  className="bg-slate-700 border-blue-500/30 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="archivo" className="text-blue-200">
              Archivo Adjunto (Foto/PDF/Word)
            </Label>
            <Input
              id="archivo"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="bg-slate-700 border-blue-500/30 text-white file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded file:mr-4"
            />
            {(formData.archivo || formData.archivoData) && (
              <p className="text-xs text-green-400 mt-2">
                Archivo: {formData.archivo?.name || formData.archivoData?.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-blue-500/30 text-blue-300 hover:bg-slate-700 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              {editingInvestment || editingSubInvestment ? "Actualizar Ficha" : "Crear Ficha"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
