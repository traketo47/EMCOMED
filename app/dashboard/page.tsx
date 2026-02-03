import { DashboardGrid } from "@/components/dashboard-grid"

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/business-background.jpg")',
        }}
      />
      {/* Light overlay for better content readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-6">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
              SGI
            </h1>
          </div>
          <h2 className="text-3xl font-semibold text-white drop-shadow-lg mb-2">Panel de Administración</h2>
          <p className="text-white drop-shadow-md">Bienvenido al sistema de gestión de inversiones</p>
        </div>

        <DashboardGrid />
      </div>
    </div>
  )
}
