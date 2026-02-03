"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Autorizo } from "@/app/dashboard/modelo-autorizo/page"

interface AutorizoListProps {
  autorizos: Autorizo[]
  onEdit: (autorizo: Autorizo) => void
  onDelete: (id: number) => void
}

export function AutorizoList({ autorizos, onEdit, onDelete }: AutorizoListProps) {
  const [selectedAutorizo, setSelectedAutorizo] = useState<Autorizo | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = (autorizo: Autorizo) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Modelo de Autorizo - ${autorizo.consecutivo},${new Date(autorizo.fecha).getFullYear()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #000; padding: 8px; }
            .header { background-color: #FFD700; font-weight: bold; text-align: center; }
            .red { background-color: #FF6B6B; }
            .logo { width: 100px; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 30px; }
            .signature-box { width: 45%; text-align: center; }
            .signature-img { max-height: 60px; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td rowspan="2" style="width: 120px;">
                <img src="/images/captura-20de-20pantalla-202025-11-20-20162937.png" style="width: 100px;" />
              </td>
              <td colspan="6" style="background-color: #FFD700; text-align: center; font-weight: bold;">
                EMPRESA COMERCIALIZADORA Y DISTRIBUIDORA DE MEDICAMENTOS
              </td>
            </tr>
            <tr>
              <td colspan="6" style="background-color: #FFD700; text-align: center; font-weight: bold;">
                MODELO DE AUTORIZO/CONTROL DE INVERSIONES
              </td>
            </tr>
            <tr>
              <td style="font-weight: bold;">FECHA:</td>
              <td>${format(new Date(autorizo.fecha), "d.MM.yyyy", { locale: es })}</td>
              <td colspan="2" style="font-weight: bold; text-align: center;">CONSECUTIVO No</td>
              <td colspan="3" style="text-align: center; font-weight: bold;">
                ${autorizo.consecutivo},${new Date(autorizo.fecha).getFullYear()}
              </td>
            </tr>
            <tr>
              <td colspan="7" style="background-color: #FFD700; font-weight: bold;">DESCRIPCIÓN DEL ALCANCE EN CONTRATACIÓN</td>
            </tr>
            <tr>
              <td colspan="7">${autorizo.descripcion}</td>
            </tr>
            <tr>
              <td colspan="2" style="font-weight: bold;">NÚMERO DE CONTRATO:</td>
              <td style="text-align: center;">${autorizo.numeroContrato}</td>
              <td colspan="2" style="font-weight: bold; text-align: center;">ENTIDAD CONTRATADA</td>
              <td colspan="2">${autorizo.entidadContratada}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">FACTURA:</td>
              <td>${autorizo.factura}</td>
              <td style="font-weight: bold; text-align: center;">OFERTA No:</td>
              <td></td>
              <td style="font-weight: bold; text-align: center;">COTIZACIÓN</td>
              <td style="font-weight: bold; text-align: center;">ORDEN VENTA No:</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" style="font-weight: bold;">FUENTE DE FINANCIAMIENTO:</td>
              <td colspan="3" style="font-weight: bold; text-align: center;">CRÉDITO BFI</td>
            </tr>
            <tr>
              <td colspan="4" rowspan="2" style="background-color: #FFD700; font-weight: bold; text-align: center;">PLAN APROBADO</td>
              <td style="font-weight: bold; text-align: center;">MMT</td>
              <td style="font-weight: bold; text-align: center;">IMPORT</td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align: center;">${autorizo.planAprobadoMMT}</td>
              <td style="text-align: center;">${autorizo.planAprobadoImport}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" rowspan="2" style="background-color: #FFD700; font-weight: bold; text-align: center;">VALOR DEL CONTRATO</td>
              <td style="font-weight: bold; text-align: center;">MMT</td>
              <td style="font-weight: bold; text-align: center;">IMPORT</td>
              <td></td>
            </tr>
            <tr>
              <td style="text-align: center;">${autorizo.valorContratoMMT}</td>
              <td style="text-align: center;">${autorizo.valorContratoImport}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="7" style="background-color: #FFD700; font-weight: bold;">CÓDIGO Y NOMBRE DE LA INVERSIÓN</td>
            </tr>
            <tr>
              <td colspan="7" style="background-color: #FF6B6B; font-weight: bold;">
                ${autorizo.fichaCodigo}-${autorizo.fichaDescripcion.toUpperCase()}
              </td>
            </tr>
            <tr>
              <td colspan="3"></td>
              <td colspan="4" style="font-weight: bold; text-align: center;">COMPONENTES</td>
            </tr>
            <tr>
              <td colspan="3"></td>
              <td style="font-weight: bold; text-align: center; font-size: 10px;">C y M<br/>(Cuent 265)</td>
              <td style="font-weight: bold; text-align: center; font-size: 10px;">EQUIP<br/>(Cuenta 266/290)</td>
              <td style="font-weight: bold; text-align: center; font-size: 10px;">PPT<br/>(Cuenta 279)</td>
              <td style="font-weight: bold; text-align: center; font-size: 10px;">OTROS<br/>(Cuenta 269)</td>
            </tr>
            <tr>
              <td colspan="3"></td>
              <td style="text-align: center; font-weight: bold;">
                ${autorizo.componente === "cyM" ? "X" : ""}
              </td>
              <td style="text-align: center; font-weight: bold;">
                ${autorizo.componente === "equip" ? "X" : ""}
              </td>
              <td style="text-align: center; font-weight: bold;">
                ${autorizo.componente === "ppt" ? "X" : ""}
              </td>
              <td style="text-align: center; font-weight: bold;">
                ${autorizo.componente === "otros" ? "X" : ""}
              </td>
            </tr>
          </table>
          <div class="signature-section">
            <div class="signature-box">
              <p><strong>Elaborado:</strong></p>
              <p>${autorizo.elaboradoNombre || ""}</p>
              <p>${autorizo.elaboradoCargo || ""}</p>
              <p><strong>EMCOMED</strong></p>
              ${autorizo.elaboradoFirma ? `<img src="${autorizo.elaboradoFirma}" class="signature-img" />` : ""}
              <p>FIRMA Y CUÑO</p>
            </div>
            <div class="signature-box">
              <p><strong>Aprobado:</strong></p>
              <p>${autorizo.aprobadoNombre || ""}</p>
              <p>${autorizo.aprobadoCargo || ""}</p>
              <p><strong>EMCOMED</strong></p>
              ${autorizo.aprobadoFirma ? `<img src="${autorizo.aprobadoFirma}" class="signature-img" />` : ""}
              <p>FIRMA Y CUÑO</p>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const componenteLabels = {
    cyM: "C y M",
    equip: "EQUIP",
    ppt: "PPT",
    otros: "OTROS",
  }

  if (autorizos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No hay modelos de autorizo</h3>
        <p className="text-blue-200">Crea tu primer modelo de autorizo para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Modelos de Autorizo Creados</h2>

      <div className="grid gap-4">
        {autorizos.map((autorizo) => (
          <Card key={autorizo.id} className="border-blue-500/30 bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-lg font-bold text-blue-400">
                      Consecutivo: {autorizo.consecutivo},{new Date(autorizo.fecha).getFullYear()}
                    </span>
                    <span className="text-sm text-blue-200">
                      {format(new Date(autorizo.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-1">{autorizo.fichaDescripcion}</p>
                  <p className="text-blue-200 text-sm line-clamp-2">{autorizo.descripcion}</p>
                  <div className="flex gap-4 mt-2 text-sm text-blue-300">
                    <span>Contrato: {autorizo.numeroContrato || "N/A"}</span>
                    <span>Entidad: {autorizo.entidadContratada || "N/A"}</span>
                    <span>Componente: {componenteLabels[autorizo.componente]}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => setSelectedAutorizo(autorizo)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Ver
                  </Button>
                  <Button
                    onClick={() => handlePrint(autorizo)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    Imprimir
                  </Button>
                  <Button
                    onClick={() => onEdit(autorizo)}
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm("¿Está seguro de eliminar este autorizo?")) {
                        onDelete(autorizo.id)
                      }
                    }}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal para ver el autorizo */}
      <Dialog open={!!selectedAutorizo} onOpenChange={() => setSelectedAutorizo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-white">
          {selectedAutorizo && (
            <div ref={printRef}>
              <table className="w-full border-collapse text-sm">
                <tbody>
                  <tr>
                    <td rowSpan={2} className="border border-black p-2 w-32">
                      <img
                        src="/images/captura-20de-20pantalla-202025-11-20-20162937.png"
                        alt="EMCOMED"
                        className="w-28"
                      />
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
                  <tr>
                    <td className="border border-black p-2 font-bold bg-white text-black">FECHA:</td>
                    <td className="border border-black p-2 bg-white text-black">
                      {format(new Date(selectedAutorizo.fecha), "d.MM.yyyy", { locale: es })}
                    </td>
                    <td colSpan={2} className="border border-black p-2 font-bold bg-white text-black text-center">
                      CONSECUTIVO No
                    </td>
                    <td colSpan={3} className="border border-black p-2 bg-white text-center text-black font-bold">
                      {selectedAutorizo.consecutivo},{new Date(selectedAutorizo.fecha).getFullYear()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="border border-black p-2 font-bold bg-yellow-400 text-black">
                      DESCRIPCIÓN DEL ALCANCE EN CONTRATACIÓN
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="border border-black p-2 bg-white text-black">
                      {selectedAutorizo.descripcion}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="border border-black p-2 font-bold bg-white text-black">
                      NÚMERO DE CONTRATO:
                    </td>
                    <td className="border border-black p-2 bg-white text-black text-center">
                      {selectedAutorizo.numeroContrato}
                    </td>
                    <td colSpan={2} className="border border-black p-2 font-bold bg-white text-black text-center">
                      ENTIDAD CONTRATADA
                    </td>
                    <td colSpan={2} className="border border-black p-2 bg-white text-black">
                      {selectedAutorizo.entidadContratada}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold bg-white text-black">FACTURA:</td>
                    <td className="border border-black p-2 bg-white text-black">{selectedAutorizo.factura}</td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">OFERTA No:</td>
                    <td className="border border-black p-2 bg-white text-black"></td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">COTIZACIÓN</td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">
                      ORDEN VENTA No:
                    </td>
                    <td className="border border-black p-2 bg-white text-black"></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-black p-2 font-bold bg-white text-black">
                      FUENTE DE FINANCIAMIENTO:
                    </td>
                    <td colSpan={3} className="border border-black p-2 font-bold bg-white text-black text-center">
                      CRÉDITO BFI
                    </td>
                  </tr>
                  <tr>
                    <td
                      rowSpan={2}
                      colSpan={4}
                      className="border border-black p-2 font-bold bg-yellow-400 text-black text-center"
                    >
                      PLAN APROBADO
                    </td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">MMT</td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">IMPORT</td>
                    <td className="border border-black p-2 bg-white"></td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 bg-white text-black text-center">
                      {selectedAutorizo.planAprobadoMMT}
                    </td>
                    <td className="border border-black p-2 bg-white text-black text-center">
                      {selectedAutorizo.planAprobadoImport}
                    </td>
                    <td className="border border-black p-2 bg-white"></td>
                  </tr>
                  <tr>
                    <td
                      rowSpan={2}
                      colSpan={4}
                      className="border border-black p-2 font-bold bg-yellow-400 text-black text-center"
                    >
                      VALOR DEL CONTRATO
                    </td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">MMT</td>
                    <td className="border border-black p-2 font-bold bg-white text-black text-center">IMPORT</td>
                    <td className="border border-black p-2 bg-white"></td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 bg-white text-black text-center">
                      {selectedAutorizo.valorContratoMMT}
                    </td>
                    <td className="border border-black p-2 bg-white text-black text-center">
                      {selectedAutorizo.valorContratoImport}
                    </td>
                    <td className="border border-black p-2 bg-white"></td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="border border-black p-2 font-bold bg-yellow-400 text-black">
                      CÓDIGO Y NOMBRE DE LA INVERSIÓN
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="border border-black p-2 bg-red-400 text-black font-bold">
                      {selectedAutorizo.fichaCodigo}-{selectedAutorizo.fichaDescripcion.toUpperCase()}
                    </td>
                  </tr>
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
                    <td className="border border-black p-2 bg-white text-black text-center font-bold">
                      {selectedAutorizo.componente === "cyM" ? "X" : ""}
                    </td>
                    <td className="border border-black p-2 bg-white text-black text-center font-bold">
                      {selectedAutorizo.componente === "equip" ? "X" : ""}
                    </td>
                    <td className="border border-black p-2 bg-white text-black text-center font-bold">
                      {selectedAutorizo.componente === "ppt" ? "X" : ""}
                    </td>
                    <td className="border border-black p-2 bg-white text-black text-center font-bold">
                      {selectedAutorizo.componente === "otros" ? "X" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} className="border-0 h-4 bg-white"></td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="border border-black p-4 bg-white align-top">
                      <div className="text-center space-y-1">
                        <div className="font-bold text-black">Elaborado:</div>
                        <div className="text-black">{selectedAutorizo.elaboradoNombre || "-"}</div>
                        <div className="text-black">{selectedAutorizo.elaboradoCargo || "-"}</div>
                        <div className="font-semibold text-black">EMCOMED</div>
                        {selectedAutorizo.elaboradoFirma && (
                          <img
                            src={selectedAutorizo.elaboradoFirma || "/placeholder.svg"}
                            alt="Firma"
                            className="mx-auto max-h-16"
                          />
                        )}
                        <div className="text-black text-sm">FIRMA Y CUÑO</div>
                      </div>
                    </td>
                    <td className="border-0 bg-white"></td>
                    <td colSpan={3} className="border border-black p-4 bg-white align-top">
                      <div className="text-center space-y-1">
                        <div className="font-bold text-black">Aprobado:</div>
                        <div className="text-black">{selectedAutorizo.aprobadoNombre || "-"}</div>
                        <div className="text-black">{selectedAutorizo.aprobadoCargo || "-"}</div>
                        <div className="font-semibold text-black">EMCOMED</div>
                        {selectedAutorizo.aprobadoFirma && (
                          <img
                            src={selectedAutorizo.aprobadoFirma || "/placeholder.svg"}
                            alt="Firma"
                            className="mx-auto max-h-16"
                          />
                        )}
                        <div className="text-black text-sm">FIRMA Y CUÑO</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
