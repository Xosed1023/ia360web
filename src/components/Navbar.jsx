function Navbar({ onOpenAuth }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 60
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">Arys</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('prueba')} 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Prueba
            </button>
            <button 
              onClick={() => scrollToSection('caracteristicas')} 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Características
            </button>
            <button 
              onClick={() => scrollToSection('testimonios')} 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Testimonios
            </button>
            <button 
              onClick={() => scrollToSection('precios')} 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Precios
            </button>
          </div>

          {/* Auth Button */}
          <button 
            onClick={onOpenAuth}
            className="border-2 border-teal-500 text-teal-500 hover:bg-teal-50 px-6 py-2 rounded-lg font-medium transition"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar