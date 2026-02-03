import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image with blur and overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/business-background.jpg")',
        }}
      />

      {/* Light overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 text-center">
            <div className="bg-gradient-to-br from-white via-blue-100 to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
              <h1 className="text-8xl font-bold tracking-tight mb-2">SGI</h1>
            </div>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-white to-transparent rounded-full" />
          </div>
          <h2 className="text-2xl font-semibold text-white drop-shadow-lg mb-2">Sistema de Gestión de Inversiones</h2>
          <p className="text-white drop-shadow-md text-center">Ingrese sus credenciales para acceder al sistema</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
