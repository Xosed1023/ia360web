import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "../components/AuthModal";
import Navbar from "../components/Navbar";
import HybridSphere from "../components/HybridSphere";

// Variantes de animación reutilizables
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

function Landing() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onOpenAuth={() => setIsModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
            >
              <motion.h1
                className="text-5xl font-bold text-gray-900 mb-6"
                variants={fadeInUp}
              >
                La Inteligencia Artificial que Trabaja para Ti
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 mb-8"
                variants={fadeInUp}
              >
                Arys es tu asistente virtual personal que optimiza tus tareas
                diarias, gestiona tu agenda y te proporciona información al
                instante, permitiéndote enfocarte en lo que realmente importa.
              </motion.p>
              <motion.button
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
                variants={fadeInUp}
              >
                Comenzar
              </motion.button>
            </motion.div>

            <div
              className="h-96"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
            >
              <HybridSphere />
            </div>
          </div>
        </div>
      </section>

      {/* Prueba Arys */}
      <section id="prueba" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center flex flex-col gap-6 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-5xl font-bold text-gray-900 mb-4 tracking-tight"
              variants={fadeInUp}
            >
              Prueba Arys
            </motion.h2>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              Automatiza tareas, mejora la productividad y toma decisiones más
              inteligentes con el poder de la IA.
            </motion.p>
            <motion.button
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
              variants={fadeInUp}
            >
              Comenzar
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Características Principales */}
      <section id="caracteristicas" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center flex flex-col gap-4 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              Características Principales
            </motion.h1>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              Descubre cómo Arys puede transformar tu forma de trabajar con sus
              potentes funcionalidades.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div
              className="bg-white p-8 rounded-xl hover:shadow-lg transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Análisis de Datos Avanzado
              </h3>
              <p className="text-gray-600">
                Obtén insights valiosos a partir de tus datos con nuestros
                algoritmos de IA de última generación.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white p-8 rounded-xl hover:shadow-lg transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Automatización de Flujos de Trabajo
              </h3>
              <p className="text-gray-600">
                Automatiza tareas repetitivas y optimiza tus procesos para
                enfocarte en lo que realmente importa.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white p-8 rounded-xl hover:shadow-lg transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Integración Sencilla
              </h3>
              <p className="text-gray-600">
                Conecta Arys con tus herramientas favoritas en cuestión de
                minutos, sin necesidad de código.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="bg-white p-8 rounded-xl hover:shadow-lg transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Soporte 24/7
              </h3>
              <p className="text-gray-600">
                Nuestro equipo de expertos está disponible para ayudarte en
                cualquier momento.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Testimonios de Usuarios
            </motion.h2>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              La opinión de nuestros clientes es nuestro mayor aval.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Testimonio 1 */}
            <motion.div
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Juan Pérez, CEO de TechCorp
                </h4>
                <p className="text-gray-600 italic">
                  "Arys ha revolucionado nuestra forma de analizar datos. ¡Es
                  una herramienta indispensable!"
                </p>
              </div>
            </motion.div>

            {/* Testimonio 2 */}
            <motion.div
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Ana García, Directora de Marketing
                </h4>
                <p className="text-gray-600 italic">
                  "La automatización de flujos de trabajo nos ha ahorrado
                  incontables horas. ¡Totalmente recomendado!"
                </p>
              </div>
            </motion.div>

            {/* Testimonio 3 */}
            <motion.div
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition border-2 border-gray-200"
              variants={scaleIn}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Carlos Rodríguez, Desarrollador
                </h4>
                <p className="text-gray-600 italic">
                  "La integración fue increíblemente sencilla. En pocos minutos
                  ya estaba conectado a todas mis herramientas."
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Planes de Suscripción */}
      <section id="precios" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Nuestros Planes de Suscripción
            </motion.h2>
            <motion.p className="text-xl text-gray-600" variants={fadeInUp}>
              Elige el plan que mejor se adapte a tus necesidades y comienza a
              potenciar tu negocio.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Plan Gratis */}
            <motion.div
              className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:shadow-lg transition"
              variants={scaleIn}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratis</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€0</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <motion.button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition mb-6">
                Empezar Ahora
              </motion.button>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">Funcionalidades básicas</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">1 integración</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">Soporte por email</span>
                </li>
              </ul>
            </motion.div>

            {/* Plan Pro */}
            <motion.div
              className="bg-white border-2 border-teal-500 p-8 rounded-2xl shadow-xl relative transform scale-105"
              variants={scaleIn}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Más Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">€49</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <motion.button className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition mb-6">
                Contratar Pro
              </motion.button>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">Herramientas avanzadas</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">10 integraciones</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">Soporte prioritario</span>
                </li>
              </ul>
            </motion.div>

            {/* Plan Empresarial */}
            <motion.div
              className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:shadow-lg transition"
              variants={scaleIn}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Empresarial
              </h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">
                  Contacto
                </span>
              </div>
              <motion.button className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition mb-6">
                Contactar Ventas
              </motion.button>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">Soluciones a medida</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">
                    Integraciones ilimitadas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-teal-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-600">Soporte dedicado 24/7</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-4 gap-12 mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Columna 1 - Arys */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
                <span className="text-xl font-bold text-gray-900">Arys</span>
              </div>
              <p className="text-gray-600">
                Tu agente virtual impulsado por IA para una experiencia de
                cliente superior.
              </p>
            </motion.div>

            {/* Columna 2 - Navegación */}
            <motion.div variants={fadeInUp}>
              <h4 className="font-bold text-gray-900 mb-4">Navegación</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#caracteristicas"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#precios"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-600 hover:text-teal-500">
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contacto"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Columna 3 - Empresa */}
            <motion.div variants={fadeInUp}>
              <h4 className="font-bold text-gray-900 mb-4">Empresa</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#nosotros"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a
                    href="#carreras"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Carreras
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Columna 4 - Legal */}
            <motion.div variants={fadeInUp}>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#terminos"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Términos y condiciones
                  </a>
                </li>
                <li>
                  <a
                    href="#privacidad"
                    className="text-gray-600 hover:text-teal-500"
                  >
                    Política de privacidad
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-gray-600 hover:text-teal-500">
                    FAQs
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Separador y Copyright */}
          <motion.div
            className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <p className="text-gray-600 text-sm">
              © 2024 Arys. Todos los derechos reservados.
            </p>

            {/* Redes Sociales */}
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-teal-500 transition"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-teal-500 transition"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-teal-500 transition"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Modal de Auth */}
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Landing;
