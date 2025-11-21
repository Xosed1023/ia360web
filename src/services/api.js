// Configuración base de la API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper para obtener el token
const getToken = () => {
  return localStorage.getItem("token");
};

// Helper para headers con autenticación
const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/log-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al iniciar sesión");
    }

    return await response.json();
  },

  // Register
  register: async (username, names, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: username,
        nombres: names,
        password,
        roleRequest: {
          roleListName: ["USER"],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al registrarse");
    }

    return await response.json();
  },

  // Verify token
  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Token inválido");
    }

    return await response.json();
  },

  // Logout
  logout: async () => {
    /* const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    }) */

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return true;
  },
};

// Chat API
export const chatAPI = {
  // Obtener historial de chats
  getChats: async () => {
    const response = await fetch(`${API_BASE_URL}/llmText/arys-conversations`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener chats");
    }

    return await response.json();
  },

  // Obtener historial de mensajes por contexto
  getChatHistory: async (idContext, paginationSize = 50, paginationKey = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/llmText/arys-history?paginationSize=${paginationSize}&paginationKey=${paginationKey}&idContext=${idContext}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener historial del chat");
    }

    return await response.json();
  },

  // Crear nuevo chat
  createChat: async () => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al crear chat");
    }

    return await response.json();
  },

  // Obtener mensajes de un chat
  getMessages: async (chatId) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener mensajes");
    }

    return await response.json();
  },

  // Enviar mensaje
  sendMessage: async (chatId, message) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar mensaje");
    }

    return await response.json();
  },

  // Enviar mensaje de texto con streaming
  sendTextMessage: async (message, onStreamCallback, idContext = null) => {
    const token = getToken();
    const url = idContext
      ? `${API_BASE_URL}/llmText/arys-txt?idContext=${idContext}`
      : `${API_BASE_URL}/llmText/arys-txt`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userMessage: message }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar mensaje");
    }

    // Leer el stream de respuesta
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (onStreamCallback) {
        onStreamCallback(chunk);
      }
    }
  },

  // Enviar mensaje con archivos
  sendMessageWithFiles: async (formData, onStreamCallback) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/llmFile/arys-file`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al enviar archivos");
    }

    // Leer el stream de respuesta
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (onStreamCallback) {
        onStreamCallback(chunk);
      }
    }
  },

  // Generar imagen con IA
  generateImage: async (prompt) => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/llmImage/arys-img-byte`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ userMessage: prompt }),
    });

    if (!response.ok) {
      throw new Error("Error al generar imagen");
    }

    const data = await response.json();
    return data.imageUrl || data.url || data.data?.url;
  },

  // Eliminar chat
  deleteChat: async (chatId) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return response.ok;
  },
};

// User API
export const userAPI = {
  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener perfil");
    }

    return await response.json();
  },

  // Actualizar perfil
  updateProfile: async (data) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar perfil");
    }

    return await response.json();
  },
};

export default {
  authAPI,
  chatAPI,
  userAPI,
};
