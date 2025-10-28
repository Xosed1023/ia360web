import {
  ChevronDown,
  Clock,
  CreditCard,
  File,
  Image,
  Keyboard,
  LogOut,
  MessageCircle,
  Mic,
  MicOff,
  PanelLeft,
  PanelLeftClose,
  Paperclip,
  Plus,
  Send,
  Settings,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import HybridSphere from "../components/HybridSphere";
import { authAPI, chatAPI } from "../services/api";
import chatInSound from "../assets/audio/chat-in.mp3";
import chatOutSound from "../assets/audio/chat-out.mp3";

export default function ArysChat() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("user")).contact);
  const [userPlan] = useState("Free");
  const [activeChat, setActiveChat] = useState(1);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hola, soy Arys. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceStatus] = useState("Escuchando...");

  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const dropdownOptions = [
    {
      icon: Settings,
      text: "Configuración",
      callback: () => alert("Abrir Configuración"),
    },
    {
      icon: CreditCard,
      text: "Mejorar Plan",
      callback: () => alert("Mejorar a Premium"),
    },
    {
      icon: LogOut,
      text: "Cerrar Sesión",
      callback: () => {
        authAPI.logout() && navigate("/");
      },
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    const fetchConversations = async () => {
      try {
        const data = await chatAPI.getChats();
        setConversations(data);
      } catch (error) {
        console.error("Error al obtener chats:", error);
      }
    };

    fetchConversations();

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isVoiceMode && !isMuted) {
      // Simular cambios de estado de escucha
      const interval = setInterval(() => {
        setIsListening((prev) => !prev);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isVoiceMode, isMuted]);

  const simulateTyping = async (text) => {
    setIsTyping(true);
    setStreamingText("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    for (let i = 0; i < text.length; i++) {
      setStreamingText(text.slice(0, i + 1));
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "assistant",
        text: text,
        timestamp: new Date(),
      },
    ]);
    setStreamingText("");
  };

  const handleSend = async () => {
    if (message.trim() || attachedFiles.length > 0) {
      const userMessage = {
        id: Date.now(),
        sender: "user",
        text: message.trim(),
        attachments: [...attachedFiles],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setAttachedFiles([]);

      const responses = [
        "Entiendo tu consulta. Basándome en los datos disponibles, puedo ayudarte a analizar esta situación desde diferentes perspectivas.",
        "Excelente pregunta. Déjame explicarte esto de manera detallada para que puedas tomar la mejor decisión.",
        "He procesado tu solicitud. Aquí está la información que necesitas, organizada de forma clara y concisa.",
        "Perfecto, puedo ayudarte con eso. Te proporciono una respuesta completa a tu consulta.",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      await simulateTyping(randomResponse);
    }
  };

  const handleNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `Nuevo Chat ${conversations.length + 1}`,
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChat(newChatId);
    setMessages([
      {
        id: Date.now(),
        sender: "assistant",
        text: "Hola, soy Arys. ¿En qué puedo ayudarte hoy?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleFileSelect = (event, type) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: type,
          preview: type === "image" ? e.target.result : null,
        };

        setAttachedFiles((prev) => [...prev, newFile]);
      };

      if (type === "image") {
        reader.readAsDataURL(file);
      } else {
        reader.readAsDataURL(file);
      }
    });

    setShowAttachmentMenu(false);
  };

  const removeAttachment = (id) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleVoiceMode = () => {
    // Reproducir sonido de entrada
    const audio = new Audio(chatInSound);
    audio.play().catch(err => console.log('Error al reproducir audio:', err));
    
    setIsVoiceMode(true);
    setIsListening(true);
    setIsMuted(false);
  };

  const handleExitVoiceMode = () => {
    // Reproducir sonido de salida
    const audio = new Audio(chatOutSound);
    audio.play().catch(err => console.log('Error al reproducir audio:', err));
    
    setIsVoiceMode(false);
    setIsListening(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setIsListening(!isMuted);
  };

  return (
    <AnimatePresence mode="wait">
      {isVoiceMode ? (
        <motion.div
          key="voice-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 flex flex-col items-center justify-center relative overflow-hidden"
        >
          {/* Background glow effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent"
          ></motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-3xl font-light text-gray-300 mb-12 z-10"
          >
            Hablando con Arys
          </motion.h1>

          {/* 3D Sphere */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.5, y: 30 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="w-96 h-96 mb-12 z-10 flex items-center justify-center"
          >
            <div className="w-full h-full">
              <HybridSphere
                enableMouseInteraction={false}
                isListening={isListening}
              />
            </div>
          </motion.div>

          {/* Status Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className="text-gray-400 text-lg mb-16 z-10"
          >
            {isMuted ? "Silenciado" : voiceStatus}
          </motion.p>

          {/* Control Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center gap-8 z-10"
          >
            {/* Mute/Unmute Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700/70 transition-all">
                {isMuted ? (
                  <MicOff className="w-7 h-7 text-gray-300" />
                ) : (
                  <Mic className="w-7 h-7 text-gray-300" />
                )}
              </div>
              <span className="text-sm text-gray-400">
                {isMuted ? "Silenciar" : "Activar"}
              </span>
            </motion.button>

            {/* End Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExitVoiceMode}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-20 h-20 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center transition-all shadow-lg shadow-teal-500/50">
                <X className="w-10 h-10 text-white" />
              </div>
              <span className="text-sm text-gray-300 font-medium">
                Terminar
              </span>
            </motion.button>

            {/* Switch to Text Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExitVoiceMode}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-700/50 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700/70 transition-all">
                <Keyboard className="w-7 h-7 text-gray-300" />
              </div>
              <span className="text-sm text-gray-400">Volver a texto</span>
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="chat-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex h-screen bg-gray-50 font-sans"
        >
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="text-xl font-semibold text-gray-900">Arys</span>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg py-3 px-4 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nuevo Chat</span>
          </button>
        </div>

        {/* Temporal Chat */}
        <div className="px-4 py-3">
          <button className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Chat Temporal</span>
          </button>
        </div>

        {/* History Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Historial
            </h3>
          </div>

          <div className="px-2 space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveChat(conv.idContext)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 transition-colors text-left ${
                  activeChat === conv.idContext
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm truncate">{conv.pregunta}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile with Dropdown */}
        <div
          className="p-4 border-t border-gray-200 relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-gray-900">{user}</div>
              <div className="text-xs text-gray-500">Plan: {userPlan}</div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {dropdownOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.callback();
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <option.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-900">{option.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            title={isSidebarCollapsed ? "Expandir panel" : "Colapsar panel"}
          >
            {isSidebarCollapsed ? (
              <PanelLeft className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Arys</h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.sender === "assistant" ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`flex flex-col ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  } max-w-2xl`}
                >
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    {msg.sender === "assistant" ? "Arys" : "Tú"}
                  </div>

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div
                      className={`mb-2 flex flex-wrap gap-2 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.attachments.map((file) => (
                        <div
                          key={file.id}
                          className={`rounded-lg overflow-hidden border ${
                            msg.sender === "user"
                              ? "border-gray-700"
                              : "border-gray-200"
                          }`}
                        >
                          {file.type === "image" ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="max-w-xs max-h-64 object-cover"
                            />
                          ) : (
                            <div
                              className={`px-4 py-3 flex items-center gap-3 ${
                                msg.sender === "user"
                                  ? "bg-gray-700"
                                  : "bg-gray-50"
                              }`}
                            >
                              <File
                                className={`w-8 h-8 ${
                                  msg.sender === "user"
                                    ? "text-white"
                                    : "text-gray-600"
                                }`}
                              />
                              <div>
                                <div
                                  className={`text-sm font-medium ${
                                    msg.sender === "user"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {file.name}
                                </div>
                                <div
                                  className={`text-xs ${
                                    msg.sender === "user"
                                      ? "text-gray-300"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.text && (
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.sender === "assistant"
                          ? "bg-gray-100 text-gray-900 rounded-tl-sm"
                          : "bg-gray-800 text-white rounded-tr-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Streaming Message */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                </div>
                <div className="flex flex-col items-start max-w-2xl">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Arys
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3">
                    {streamingText ? (
                      <p className="leading-relaxed">
                        {streamingText}
                        <span className="inline-block w-1 h-4 bg-gray-900 ml-1 animate-pulse"></span>
                      </p>
                    ) : (
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    {file.type === "image" ? (
                      <div className="relative">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removeAttachment(file.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative bg-white border-2 border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
                        <File className="w-5 h-5 text-gray-600" />
                        <div className="max-w-32">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAttachment(file.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 px-4 py-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !isTyping && handleSend()
                }
                placeholder="Escribe tu mensaje para Arys..."
                disabled={isTyping}
                className="flex-1 outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50"
              />

              {/* Attachment Menu */}
              <div className="relative" ref={attachmentMenuRef}>
                <button
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {showAttachmentMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-48">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Image className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-900">
                        Agregar Foto
                      </span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <File className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-900">
                        Agregar Archivo
                      </span>
                    </button>
                  </div>
                )}

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e, "image")}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e, "file")}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleVoiceMode}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={handleSend}
                disabled={
                  isTyping || (!message.trim() && attachedFiles.length === 0)
                }
                className="bg-gray-900 hover:bg-black text-white p-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
