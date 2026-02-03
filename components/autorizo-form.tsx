"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Autorizo } from "@/app/dashboard/modelo-autorizo/page"
import type { Investment } from "@/app/dashboard/plan-inversion/page"

interface AutorizoFormProps {
  onSubmit: (autorizo: Omit<Autorizo, "id" | "consecutivo"> | Autorizo) => void
  proveedores: string[]
  onAddProveedor: (proveedor: string) => void
  editingAutorizo: Autorizo | null
  nextConsecutivo: number
}

export function AutorizoForm({
  onSubmit,
  proveedores,
  onAddProveedor,
  editingAutorizo,
  nextConsecutivo,
}: AutorizoFormProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const elaboradoCanvasRef = useRef<HTMLCanvasElement>(null)
  const aprobadoCanvasRef = useRef<HTMLCanvasElement>(null)
  const [fecha, setFecha] = useState<Date>(new Date())
  const [descripcion, setDescripcion] = useState("")
  const [numeroContrato, setNumeroContrato] = useState("")
  const [entidadContratada, setEntidadContratada] = useState("")
  const [factura, setFactura] = useState("")
  const [planAprobadoMMT, setPlanAprobadoMMT] = useState("")
  const [planAprobadoImport, setPlanAprobadoImport] = useState("")
  const [valorContratoMMT, setValorContratoMMT] = useState("")
  const [valorContratoImport, setValorContratoImport] = useState("")
  const [selectedFichaId, setSelectedFichaId] = useState<number | null>(null)
  const [componente, setComponente] = useState<"cyM" | "equip" | "ppt" | "otros" | null>(null)
  const [investments, setInvestments] = useState<Investment[]>([])
  const [showAddProveedor, setShowAddProveedor] = useState(false)
  const [newProveedor, setNewProveedor] = useState("")
  const [calendarOpen, setCalendarOpen] = useState(false)

  const [elaboradoNombre, setElaboradoNombre] = useState("")
  const [elaboradoCargo, setElaboradoCargo] = useState("")
  const [elaboradoFirma, setElaboradoFirma] = useState<string | null>(null)
  const [aprobadoNombre, setAprobadoNombre] = useState("")
  const [aprobadoCargo, setAprobadoCargo] = useState("")
  const [aprobadoFirma, setAprobadoFirma] = useState<string | null>(null)
  const [isDrawingElaborado, setIsDrawingElaborado] = useState(false)
  const [isDrawingAprobado, setIsDrawingAprobado] = useState(false)
  const [showElaboradoSignature, setShowElaboradoSignature] = useState(false)
  const [showAprobadoSignature, setShowAprobadoSignature] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("investments")
    if (stored) {
      try {
        setInvestments(JSON.parse(stored))
      } catch (e) {
        console.error("Error loading investments:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (editingAutorizo) {
      setFecha(new Date(editingAutorizo.fecha))
      setDescripcion(editingAutorizo.descripcion)
      setNumeroContrato(editingAutorizo.numeroContrato)
      setEntidadContratada(editingAutorizo.entidadContratada)
      setFactura(editingAutorizo.factura)
      setPlanAprobadoMMT(editingAutorizo.planAprobadoMMT.toString())
      setPlanAprobadoImport(editingAutorizo.planAprobadoImport.toString())
      setValorContratoMMT(editingAutorizo.valorContratoMMT.toString())
      setValorContratoImport(editingAutorizo.valorContratoImport.toString())
      setSelectedFichaId(editingAutorizo.fichaId)
      setComponente(editingAutorizo.componente)
      setElaboradoNombre(editingAutorizo.elaboradoNombre || "")
      setElaboradoCargo(editingAutorizo.elaboradoCargo || "")
      setElaboradoFirma(editingAutorizo.elaboradoFirma || null)
      setAprobadoNombre(editingAutorizo.aprobadoNombre || "")
      setAprobadoCargo(editingAutorizo.aprobadoCargo || "")
      setAprobadoFirma(editingAutorizo.aprobadoFirma || null)
    }
  }, [editingAutorizo])

  const startDrawing = (canvas: HTMLCanvasElement | null, setIsDrawing: (val: boolean) => void) => {
    if (!canvas) return
    setIsDrawing(true)
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement | null, isDrawing: boolean) => {
    if (!isDrawing || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#000"
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = (setIsDrawing: (val: boolean) => void) => {
    setIsDrawing(false)
  }

  const clearCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const saveSignature = (
    canvas: HTMLCanvasElement | null,
    setFirma: (val: string | null) => void,
    setShowModal: (val: boolean) => void,
  ) => {
    if (!canvas) return
    const dataUrl = canvas.toDataURL("image/png")
    setFirma(dataUrl)
    setShowModal(false)
  }

  const selectedFicha = investments.find((inv) => inv.id === selectedFichaId)
  const currentYear = new Date().getFullYear()
  const consecutivoDisplay = editingAutorizo ? editingAutorizo.consecutivo : nextConsecutivo

  const handleSubmit = () => {
    if (!selectedFichaId || !componente || !descripcion) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    const autorizo = {
      ...(editingAutorizo ? { id: editingAutorizo.id, consecutivo: editingAutorizo.consecutivo } : {}),
      fecha: fecha.toISOString(),
      descripcion,
      numeroContrato,
      entidadContratada,
      factura,
      planAprobadoMMT: Number.parseFloat(planAprobadoMMT) || 0,
      planAprobadoImport: Number.parseFloat(planAprobadoImport) || 0,
      valorContratoMMT: Number.parseFloat(valorContratoMMT) || 0,
      valorContratoImport: Number.parseFloat(valorContratoImport) || 0,
      fichaId: selectedFichaId,
      fichaCodigo: selectedFicha?.codigo || "",
      fichaDescripcion: selectedFicha?.descripcion || "",
      componente,
      elaboradoNombre,
      elaboradoCargo,
      elaboradoFirma,
      aprobadoNombre,
      aprobadoCargo,
      aprobadoFirma,
    }

    onSubmit(autorizo as Autorizo)
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Modelo de Autorizo - ${consecutivoDisplay},${currentYear}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #000; padding: 8px; }
            .header { background-color: #FFD700; font-weight: bold; text-align: center; }
            .red { background-color: #FF6B6B; }
            .logo { width: 100px; }
            .title { font-weight: bold; text-align: center; }
            .checkbox { width: 30px; text-align: center; }
            .signature-img { max-height: 60px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleAddProveedorSubmit = () => {
    if (newProveedor.trim()) {
      onAddProveedor(newProveedor.trim())
      setEntidadContratada(newProveedor.trim())
      setNewProveedor("")
      setShowAddProveedor(false)
    }
  }

  const handleNumeroContratoChange = (value: string) => {
    const filtered = value.replace(/[^0-9.,]/g, "")
    if (filtered === "" || Number.parseFloat(filtered.replace(",", ".")) >= 0) {
      setNumeroContrato(filtered)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-4 mb-4">
        <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white">
          Imprimir
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
          {editingAutorizo ? "Guardar Cambios" : "Crear Autorizo"}
        </Button>
      </div>

      <div ref={printRef} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {/* Header with logo */}
            <tr>
              <td rowSpan={2} className="border border-black p-2 w-32">
                <img src="/images/captura-20de-20pantalla-202025-11-20-20162937.png" alt="EMCOMED" className="w-28" />
              </td>
              <td colSpan={6} className="border border-black p-2 text-center font-bold bg-yellow-400 text-black">
                EMPRESA COMERCIALIZADORA Y DISTRIBUIDORA DE MEDICAMENTOS
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black p-2 text-center font-bold bg-yellow-400 text-black">
                MODELO DE AUTORIZO/CONTROL DE INVERSIONES
              </td>
            </tr>

            {/* Fecha y Consecutivo - Changed yellow to white backgrounds */}
            <tr>
              <td className="border border-black p-2 font-bold bg-white text-black">FECHA:</td>
              <td className="border border-black p-2 bg-white">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-white border-0 text-black hover:bg-gray-100"
                    >
                      {format(fecha, "d.MM.yyyy", { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fecha}
                      onSelect={(date) => {
                        if (date) {
                          setFecha(date)
                          setCalendarOpen(false)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </td>
              <td colSpan={2} className="border border-black p-2 font-bold bg-white text-black text-center">
                CONSECUTIVO No
              </td>
              <td colSpan={3} className="border border-black p-2 bg-white text-center text-black font-bold">
                {consecutivoDisplay},{currentYear}
              </td>
            </tr>

            {/* Descripción */}
            <tr>
              <td colSpan={7} className="border border-black p-2 font-bold bg-yellow-400 text-black">
                DESCRIPCIÓN DEL ALCANCE EN CONTRATACIÓN
              </td>
            </tr>
            <tr>
              <td colSpan={7} className="border border-black p-0">
                <Textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ingrese la descripción del alcance..."
                  className="w-full border-0 rounded-none bg-white min-h-[80px] text-black placeholder:text-gray-500"
                />
              </td>
            </tr>

            {/* Número de Contrato y Entidad - Changed to white backgrounds */}
            <tr>
              <td colSpan={2} className="border border-black p-2 font-bold bg-white text-black">
                NÚMERO DE CONTRATO:
              </td>
              <td className="border border-black p-0 bg-white">
                <Input
                  value={numeroContrato}
                  onChange={(e) => handleNumeroContratoChange(e.target.value)}
                  placeholder="0"
                  className="border-0 rounded-none bg-white text-black text-center placeholder:text-gray-500"
                />
              </td>
              <td colSpan={2} className="border border-black p-2 font-bold bg-white text-black text-center">
                ENTIDAD CONTRATADA
              </td>
              <td colSpan={2} className="border border-black p-0 bg-white">
                <Select
                  value={entidadContratada}
                  onValueChange={(value) => {
                    if (value === "__add_new__") {
                      setShowAddProveedor(true)
                    } else {
                      setEntidadContratada(value)
                    }
                  }}
                >
                  <SelectTrigger className="border-0 rounded-none bg-white text-black">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((prov) => (
                      <SelectItem key={prov} value={prov}>
                        {prov}
                      </SelectItem>
                    ))}
                    <SelectItem value="__add_new__" className="text-blue-600 font-semibold">
                      + Añadir proveedor
                    </SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>

            {/* Factura, Oferta, Cotización, Orden Venta */}
            <tr>
              <td className="border border-black p-2 font-bold bg-white text-black">FACTURA:</td>
              <td className="border border-black p-0 bg-white">
                <Input
                  value={factura}
                  onChange={(e) => setFactura(e.target.value)}
                  placeholder="SC-001-23"
                  className="border-0 rounded-none bg-white text-black placeholder:text-gray-500"
                />
              </td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">OFERTA No:</td>
              <td className="border border-black p-2 bg-white text-black"></td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">COTIZACIÓN</td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">ORDEN VENTA No:</td>
              <td className="border border-black p-2 bg-white text-black"></td>
            </tr>

            {/* Fuente de Financiamiento */}
            <tr>
              <td colSpan={4} className="border border-black p-2 font-bold bg-white text-black">
                FUENTE DE FINANCIAMIENTO:
              </td>
              <td colSpan={3} className="border border-black p-2 font-bold bg-white text-black text-center">
                CRÉDITO BFI
              </td>
            </tr>

            {/* Plan Aprobado */}
            <tr>
              <td rowSpan={2} colSpan={4} className="border border-black p-2 font-bold bg-white text-black text-center">
                PLAN APROBADO
              </td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">MMT</td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">IMPORT</td>
              <td className="border border-black p-2 bg-white"></td>
            </tr>
            <tr>
              <td className="border border-black p-0 bg-white">
                <Input
                  type="number"
                  value={planAprobadoMMT}
                  onChange={(e) => setPlanAprobadoMMT(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="border-0 rounded-none bg-white text-black text-center placeholder:text-gray-500"
                />
              </td>
              <td className="border border-black p-0 bg-white">
                <Input
                  type="number"
                  value={planAprobadoImport}
                  onChange={(e) => setPlanAprobadoImport(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="border-0 rounded-none bg-white text-black text-center placeholder:text-gray-500"
                />
              </td>
              <td className="border border-black p-2 bg-white"></td>
            </tr>

            {/* Valor del Contrato */}
            <tr>
              <td rowSpan={2} colSpan={4} className="border border-black p-2 font-bold bg-white text-black text-center">
                VALOR DEL CONTRATO
              </td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">MMT</td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center">IMPORT</td>
              <td className="border border-black p-2 bg-white"></td>
            </tr>
            <tr>
              <td className="border border-black p-0 bg-white">
                <Input
                  type="number"
                  value={valorContratoMMT}
                  onChange={(e) => setValorContratoMMT(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="border-0 rounded-none bg-white text-black text-center placeholder:text-gray-500"
                />
              </td>
              <td className="border border-black p-0 bg-white">
                <Input
                  type="number"
                  value={valorContratoImport}
                  onChange={(e) => setValorContratoImport(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="border-0 rounded-none bg-white text-black text-center placeholder:text-gray-500"
                />
              </td>
              <td className="border border-black p-2 bg-white"></td>
            </tr>

            {/* Código y Nombre de la Inversión */}
            <tr>
              <td colSpan={7} className="border border-black p-2 font-bold bg-white text-black">
                CÓDIGO Y NOMBRE DE LA INVERSIÓN
              </td>
            </tr>
            <tr>
              <td colSpan={7} className="border border-black p-0">
                <Select
                  value={selectedFichaId?.toString() || ""}
                  onValueChange={(value) => setSelectedFichaId(Number.parseInt(value))}
                >
                  <SelectTrigger className="border-0 rounded-none bg-white text-black w-full">
                    <SelectValue placeholder="Seleccionar ficha de inversión" />
                  </SelectTrigger>
                  <SelectContent>
                    {investments.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id.toString()}>
                        {inv.codigo}-{inv.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
            {selectedFicha && (
              <tr>
                <td colSpan={7} className="border border-black p-2 bg-white text-black font-bold">
                  {selectedFicha.codigo}-{selectedFicha.descripcion.toUpperCase()}
                </td>
              </tr>
            )}

            {/* Componentes */}
            <tr>
              <td colSpan={3} className="border border-black p-2 bg-white"></td>
              <td colSpan={4} className="border border-black p-2 font-bold bg-white text-black text-center">
                COMPONENTES
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-2 bg-white"></td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center text-xs">
                C y M<br />
                (Cuent 265)
              </td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center text-xs">
                EQUIP
                <br />
                (Cuenta 266/290)
              </td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center text-xs">
                PPT
                <br />
                (Cuenta 279)
              </td>
              <td className="border border-black p-2 font-bold bg-white text-black text-center text-xs">
                OTROS
                <br />
                (Cuenta 269)
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-2 bg-white"></td>
              <td
                className={`border border-black p-2 text-center cursor-pointer transition-colors ${componente === "cyM" ? "bg-yellow-300" : "bg-white hover:bg-gray-100"}`}
                onClick={() => setComponente("cyM")}
              >
                <span className="text-black font-bold text-lg">{componente === "cyM" ? "X" : ""}</span>
              </td>
              <td
                className={`border border-black p-2 text-center cursor-pointer transition-colors ${componente === "equip" ? "bg-yellow-300" : "bg-white hover:bg-gray-100"}`}
                onClick={() => setComponente("equip")}
              >
                <span className="text-black font-bold text-lg">{componente === "equip" ? "X" : ""}</span>
              </td>
              <td
                className={`border border-black p-2 text-center cursor-pointer transition-colors ${componente === "ppt" ? "bg-yellow-300" : "bg-white hover:bg-gray-100"}`}
                onClick={() => setComponente("ppt")}
              >
                <span className="text-black font-bold text-lg">{componente === "ppt" ? "X" : ""}</span>
              </td>
              <td
                className={`border border-black p-2 text-center cursor-pointer transition-colors ${componente === "otros" ? "bg-yellow-300" : "bg-white hover:bg-gray-100"}`}
                onClick={() => setComponente("otros")}
              >
                <span className="text-black font-bold text-lg">{componente === "otros" ? "X" : ""}</span>
              </td>
            </tr>

            <tr>
              <td colSpan={7} className="border-0 h-8 bg-white"></td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-4 bg-white align-top">
                <div className="space-y-2">
                  <div className="font-bold text-black">Elaborado:</div>
                  <Input
                    value={elaboradoNombre}
                    onChange={(e) => setElaboradoNombre(e.target.value)}
                    placeholder="Nombre completo"
                    className="border border-gray-300 bg-white text-black placeholder:text-gray-500"
                  />
                  <Input
                    value={elaboradoCargo}
                    onChange={(e) => setElaboradoCargo(e.target.value)}
                    placeholder="Cargo"
                    className="border border-gray-300 bg-white text-black placeholder:text-gray-500"
                  />
                  <div className="text-center text-black font-semibold">EMCOMED</div>
                  <div className="border border-dashed border-gray-400 p-2 min-h-[80px] flex items-center justify-center">
                    {elaboradoFirma ? (
                      <div className="relative">
                        <img src={elaboradoFirma || "/placeholder.svg"} alt="Firma" className="max-h-16" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setElaboradoFirma(null)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowElaboradoSignature(true)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        Agregar Firma
                      </Button>
                    )}
                  </div>
                  <div className="text-center text-black text-sm">FIRMA Y CUÑO</div>
                </div>
              </td>
              <td className="border-0 bg-white"></td>
              <td colSpan={3} className="border border-black p-4 bg-white align-top">
                <div className="space-y-2">
                  <div className="font-bold text-black">Aprobado:</div>
                  <Input
                    value={aprobadoNombre}
                    onChange={(e) => setAprobadoNombre(e.target.value)}
                    placeholder="Nombre completo"
                    className="border border-gray-300 bg-white text-black placeholder:text-gray-500"
                  />
                  <Input
                    value={aprobadoCargo}
                    onChange={(e) => setAprobadoCargo(e.target.value)}
                    placeholder="Cargo"
                    className="border border-gray-300 bg-white text-black placeholder:text-gray-500"
                  />
                  <div className="text-center text-black font-semibold">EMCOMED</div>
                  <div className="border border-dashed border-gray-400 p-2 min-h-[80px] flex items-center justify-center">
                    {aprobadoFirma ? (
                      <div className="relative">
                        <img src={aprobadoFirma || "/placeholder.svg"} alt="Firma" className="max-h-16" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAprobadoFirma(null)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAprobadoSignature(true)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        Agregar Firma
                      </Button>
                    )}
                  </div>
                  <div className="text-center text-black text-sm">FIRMA Y CUÑO</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal para añadir proveedor */}
      <Dialog open={showAddProveedor} onOpenChange={setShowAddProveedor}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={newProveedor}
              onChange={(e) => setNewProveedor(e.target.value)}
              placeholder="Nombre del proveedor"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddProveedor(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProveedorSubmit} className="bg-blue-600 hover:bg-blue-700">
              Añadir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showElaboradoSignature} onOpenChange={setShowElaboradoSignature}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Firma Digital - Elaborado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={elaboradoCanvasRef}
                width={380}
                height={200}
                className="w-full cursor-crosshair"
                onMouseDown={() => startDrawing(elaboradoCanvasRef.current, setIsDrawingElaborado)}
                onMouseMove={(e) => draw(e, elaboradoCanvasRef.current, isDrawingElaborado)}
                onMouseUp={() => stopDrawing(setIsDrawingElaborado)}
                onMouseLeave={() => stopDrawing(setIsDrawingElaborado)}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">Dibuje su firma con el mouse</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => clearCanvas(elaboradoCanvasRef.current)}>
              Limpiar
            </Button>
            <Button variant="outline" onClick={() => setShowElaboradoSignature(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => saveSignature(elaboradoCanvasRef.current, setElaboradoFirma, setShowElaboradoSignature)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Guardar Firma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAprobadoSignature} onOpenChange={setShowAprobadoSignature}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Firma Digital - Aprobado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={aprobadoCanvasRef}
                width={380}
                height={200}
                className="w-full cursor-crosshair"
                onMouseDown={() => startDrawing(aprobadoCanvasRef.current, setIsDrawingAprobado)}
                onMouseMove={(e) => draw(e, aprobadoCanvasRef.current, isDrawingAprobado)}
                onMouseUp={() => stopDrawing(setIsDrawingAprobado)}
                onMouseLeave={() => stopDrawing(setIsDrawingAprobado)}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">Dibuje su firma con el mouse</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => clearCanvas(aprobadoCanvasRef.current)}>
              Limpiar
            </Button>
            <Button variant="outline" onClick={() => setShowAprobadoSignature(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => saveSignature(aprobadoCanvasRef.current, setAprobadoFirma, setShowAprobadoSignature)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Guardar Firma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
