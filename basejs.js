const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Define el token como variable global para actualizarlo dinámicamente
let token = "";

// Función para manejar el envío del mensaje
async function sendMessage() {
	const message = userInput.value.trim();
	if (!message) return;

	// Mostrar el mensaje del usuario en la interfaz
	const userMessageDiv = appendMessage("user-message", message);

	// Limpiar el campo de entrada
	userInput.value = "";

	// Asegurarse de que hay un token antes de realizar la solicitud
	if (!token) {
		token = await renewToken();
		if (!token) {
			appendMessage("server-message", "Error: No se pudo obtener el token.");
			return;
		}
	}

	// Determinar si se debe generar una imagen
	let shouldGenerateImage = false;

	// Validación avanzada para identificar intención de imagen
	const imageKeywords = ["imagen", "foto", "fotografía", "dibujar", "crear imagen", "crea una imagen"];

	// Convertir el mensaje a minúsculas para garantizar una comparación case-insensitive
	const messageLowerCase = message.toLowerCase();

	// Verificar si contiene palabras clave relacionadas con imágenes
	const containsImageKeyword = imageKeywords.some(keyword =>
		messageLowerCase.includes(keyword)
	);

	// Verificar si tiene intención de acción (crear/generar/etc.)
	const hasImageIntent = /crear|crea|generar|hacer|dibujar|producir/i.test(messageLowerCase);

	// Determinar si se debe generar una imagen basado en ambas condiciones
	if (containsImageKeyword && hasImageIntent) {
		shouldGenerateImage = true;
	}

	// Manejar la solicitud según el caso
	try {
		if (shouldGenerateImage) {
			await fetchImageFromServer(userMessageDiv, message);
		} else {
			await fetchMessagesFromServer(userMessageDiv, message);
		}
	} catch (error) {
		appendMessage("server-message", `Error: ${error.message}`);
	}
}



// Función para obtener el historial de mensajes del servidor
async function fetchMessageHistory(paginationKey = 0, paginationSize = 100) {
	try {
		const response = await fetch(`http://181.50.68.46:3940/llmText/arys-history?paginationSize=${paginationSize}&paginationKey=${paginationKey}`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
		});

		if (response.status === 401) {
			console.warn("Token expirado. Intentando renovar...");
			const newToken = await renewToken();
			if (newToken) {
				token = newToken; // Actualizar el token global
				return await fetchMessageHistory(paginationKey, paginationSize); // Reintentar con el nuevo token
			} else {
				throw new Error("No se pudo renovar el token.");
			}
		}

		if (!response.ok) {
			throw new Error(`Error en la solicitud: ${response.statusText}`);
		}

		const data = await response.json();
		displayMessageHistory(data);
	} catch (error) {
		console.error("Error al obtener el historial de mensajes:", error);
		appendMessage("server-message", "Error: No se pudo cargar el historial.");
	}
}

// Función para mostrar el historial de mensajes en la interfaz
function displayMessageHistory(data) {
    const { data: messages, pagination } = data;
    const chatContainer = document.getElementById("chatContainer"); // Asegúrate de que este contenedor esté en el HTML

    // Iterar sobre los mensajes y mostrarlos en la interfaz
    messages.forEach((message) => {
        if (message.user) {
            appendMessage("user-message", message.user);
        }

        if (message.imgLink != null) {
            const serverMessageDiv = appendMessage("server-message", "", false);
            // Crear el elemento de imagen
            const imageElement = document.createElement("img");
            imageElement.src = message.imgLink; // Usar directamente el link de la imagen
            imageElement.alt = "Imagen generada";
            imageElement.style.maxWidth = "100%";

            // Insertar la imagen en el contenedor del mensaje
            serverMessageDiv.appendChild(imageElement);
        } else if (message.arys) {
            appendMessage("server-message", formatResponse(message.arys));
        }
    });

    // Asegurar el scroll automático después de que el DOM se actualice
    setTimeout(() => {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, 100); // 100ms para asegurar la actualización del DOM antes del scroll

	chatContainer.scrollTop = chatContainer.scrollHeight;
    // Información de paginación (opcional para futuras implementaciones)
    console.log("Paginación actual11111111111111:", pagination);
}

// Ejemplo de llamada para cargar el historial inicial
fetchMessageHistory();



async function sendMessage1() {
	const message = userInput.value.trim();
	if (!message) return;

	// Mostrar el mensaje del usuario en la interfaz
	const userMessageDiv = appendMessage("user-message", message);

	// Limpiar el campo de entrada
	userInput.value = "";

	// Asegurarse de que hay un token antes de realizar la solicitud
	if (!token) {
		token = await renewToken();
		if (!token) {
			appendMessage("server-message", "Error: No se pudo obtener el token.");
			return;
		}
	}

	// Analizar si el mensaje tiene palabras relacionadas con crear una imagen
	const keywords = ["crear imagen", "genera imagen", "dibuja", "ilustración", "imagen"];
	const shouldGenerateImage = keywords.some(keyword => message.toLowerCase().includes(keyword));

	if (shouldGenerateImage) {
		await fetchImageFromServer(userMessageDiv, message);
	} else {
		// Enviar el mensaje al servidor
		await fetchMessagesFromServer(userMessageDiv, message);
	}
}

// Función para manejar la generación de imágenes mediante streaming
async function fetchImageFromServer(userMessageDiv, userMessage) {
	try {
		const response = await fetch("http://181.50.68.46:3940/llmImage/arys-img-byte", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({ userMessage }),
		});

		if (response.status === 401) {
			console.warn("Token expirado. Intentando renovar...");
			const newToken = await renewToken();
			if (newToken) {
				token = newToken; // Actualizar el token global
				return await fetchImageFromServer(userMessageDiv, userMessage); // Reintentar con el nuevo token
			} else {
				throw new Error("No se pudo renovar el token.");
			}
		}

		if (!response.ok) {
			throw new Error("Error en la respuesta del servidor: " + response.status);
		}

		const serverMessageDiv = appendMessage("server-message", "", false);
		const imageBlob = await response.blob(); // Obtener la imagen como un blob
		const imageUrl = URL.createObjectURL(imageBlob); // Crear una URL para la imagen

		// Crear el contenedor para mostrar la imagen en la interfaz
		const imageElement = document.createElement("img");
		imageElement.src = imageUrl;
		imageElement.alt = "Imagen generada";
		imageElement.style.maxWidth = "100%";

		// Insertar la imagen en el contenedor del mensaje
		serverMessageDiv.appendChild(imageElement);
		chatContainer.scrollTop = chatContainer.scrollHeight; // Hacer scroll hacia abajo

	} catch (error) {
		console.error("Error al comunicarse con el servidor para generar la imagen:", error);
		appendMessage("server-message", "Error: No se pudo generar la imagen.");
	}

	chatContainer.scrollTop = chatContainer.scrollHeight; // Hacer scroll hacia abajo
}


// Evento para el botón "Enviar"
sendButton.addEventListener("click", sendMessage);

// Evento para enviar el mensaje al presionar "Enter"
userInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter" || event.keyCode === 13) {
		event.preventDefault(); // Prevenir salto de línea en el campo de texto
		sendMessage();
	}
});

// Función para agregar mensajes a la interfaz
function appendMessage(type, text, append = true) {
	let messageDiv = document.querySelector(`.message.${type}:last-child`);

	// Crear un nuevo contenedor si no se encuentra uno previo o si no se desea anexar
	if (!append || !messageDiv) {
		messageDiv = document.createElement("div");
		messageDiv.className = `message ${type}`;
		chatContainer.appendChild(messageDiv);
	}

	// Agregar o actualizar el contenido del mensaje
	messageDiv.innerHTML = text;

	// Desplazarse automáticamente hacia el último mensaje
	chatContainer.scrollTop = chatContainer.scrollHeight;

	return messageDiv;
}

// Función para formatear la respuesta del servidor
function formatResponse(text) {
	let formattedText = text.replace(/\n/g, "<br>"); // Reemplazar saltos de línea por <br>

	// Convertir asteriscos (*) a etiquetas <strong> para negritas
	formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // **texto** a <strong>texto</strong>
	formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>"); // *texto* a <em>texto</em>

	// Identificar títulos (puedes ajustarlo según tu formato de mensaje)
	const lines = formattedText.split("<br>");
	if (lines.length > 0) {
		// Convertir la primera línea en un título de nivel 1
		//lines[0] = `<h1>${lines[0]}</h1>`; // Asigna negrita al primer título
	}

	// Vuelve a juntar las líneas después de formatear
	formattedText = lines.join("<br>");

	// Convertir listas numeradas y poner los números en negrita
	formattedText = formattedText.replace(/^(\d+\.)\s+/gm, (match, p1) => {
		return `<li><strong>${p1}</strong> </li>`;  // Solo agregamos <li> con negrita al número
	});

	// Si ya hemos encontrado alguna lista numerada, agregamos <ol> alrededor de la lista
	if (formattedText.includes('<li>')) {
		formattedText = `<ol>${formattedText}</ol>`;
	}

	// Convertir viñetas en listas con <ul> y <li>
	formattedText = formattedText.replace(/^\*\s+/gm, "<ul><li>"); // Transformar viñetas en <ul><li>

	// Si se han encontrado viñetas, agregar <ul> alrededor
	if (formattedText.includes('<ul>')) {
		formattedText = `<ul>${formattedText}</ul>`;
	}

	return formattedText;
}

// Función para obtener mensajes del servidor y manejar streaming
async function fetchMessagesFromServer(userMessageDiv, userMessage) {
	try {
		const response = await fetch("http://181.50.68.46:3940/llmText/arys-txt", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({ userMessage }),
		});

		if (response.status === 401) {
			console.warn("Token expirado. Intentando renovar...");
			const newToken = await renewToken();
			if (newToken) {
				token = newToken; // Actualizar el token global
				return await fetchMessagesFromServer(userMessageDiv, userMessage); // Reintentar con el nuevo token
			} else {
				throw new Error("No se pudo renovar el token.");
			}
		}

		if (!response.body) throw new Error("El servidor no soporta streaming");

		const reader = response.body.getReader();
		const decoder = new TextDecoder("utf-8");
		let serverMessage = "";
		let buffer = ""; // Buffer para acumular fragmentos no procesados

		// Crear el contenedor para el mensaje del servidor
		const serverMessageDiv = appendMessage("server-message", "", false);

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true }); // Procesar fragmento
			console.log("Fragmento recibido:", chunk);
			buffer += chunk; // Acumular los datos en el buffer

			// Procesar JSON válido en el buffer
			while (true) {
				try {
					// Intentar encontrar un JSON completo
					const jsonEndIndex = buffer.indexOf('}{'); // Buscar el lugar donde el JSON se cierra y comienza otro
					if (jsonEndIndex === -1) break; // No hay JSON completo aún

					const jsonString = buffer.slice(0, jsonEndIndex + 1); // Extraer el JSON completo
					buffer = buffer.slice(jsonEndIndex + 1); // Remover el JSON procesado del buffer

					const parsed = JSON.parse(jsonString); // Intentar parsear el JSON

					if (parsed.text) {
						serverMessage += parsed.text; // Agregar el texto al mensaje completo
						serverMessageDiv.innerHTML = formatResponse(serverMessage); // Actualizar la interfaz con formato
						
						vibrateOnMobile(50);
						
						// Hacer scroll hacia abajo después de cada fragmento procesado
						chatContainer.scrollTop = chatContainer.scrollHeight;
					}
				} catch (error) {
					console.warn("No se pudo procesar JSON, esperando más datos...");
					break; // Salir del bucle si el JSON aún no está completo
				}
			}
		}
	} catch (error) {
		console.error("Error al comunicarse con el servidor:", error);
		appendMessage("server-message", "Error: No se pudo procesar la solicitud.");
	}
}




const audioInput = document.getElementById("audioInput");
const sendAudioButton = document.getElementById("sendAudioButton");

// Función para manejar el envío del audio
async function sendAudio() {
	const audioFile = audioInput.files[0];
	if (!audioFile) {
		appendMessage("server-message", "Por favor selecciona un archivo de audio.");
		return;
	}

	// Crear un FormData para enviar el archivo
	const formData = new FormData();
	formData.append("file", audioFile);

	// Asegurarse de que hay un token antes de realizar la solicitud
	if (!token) {
		token = await renewToken();
		if (!token) {
			appendMessage("server-message", "Error: No se pudo obtener el token.");
			return;
		}
	}

	// Enviar el archivo al servidor
	await fetchAudioFromServer(formData);
}

// Evento para el botón "Enviar Audio"
//sendAudioButton.addEventListener("click", sendAudio);

// Variable global para controlar si el audio está reproduciéndose
let isPlaying = false;

// Cola para almacenar los fragmentos de audio
let audioQueue = [];

// Función para manejar la respuesta de audio vía streaming
async function fetchAudioFromServer(formData) {
	try {
		const response = await fetch("http://181.50.68.46:3940/llmBos/arys-bos-streaming", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${token}`,
			},
			body: formData,
		});

		// Manejo de token expirado
		if (response.status === 401) {
			console.warn("Token expirado. Intentando renovar...");
			const newToken = await renewToken();
			if (newToken) {
				token = newToken;
				return await fetchAudioFromServer(formData);
			} else {
				throw new Error("No se pudo renovar el token.");
			}
		}

		// Verificar si el servidor soporta streaming
		if (!response.body) throw new Error("El servidor no soporta streaming");

		const reader = response.body.getReader();
		console.log("Iniciando streaming de audio...");

		const audioContext = new AudioContext();
		let totalBytesReceived = 0;

		// Leer y procesar todos los fragmentos de audio
		while (true) {
			const { done, value } = await reader.read();
			if (done) break; // Terminar cuando no haya más datos

			if (value) {
				totalBytesReceived += value.byteLength;
				console.log(`Fragmento de audio recibido: ${value.byteLength} bytes, Total recibido: ${totalBytesReceived} bytes`);
				audioQueue.push(value); // Agregar fragmento a la cola
				await playNextAudio(audioContext); // Intentar reproducir inmediatamente
			}
		}

		console.log("Streaming completado.");
	} catch (error) {
		console.error("Error al comunicarse con el servidor:", error);
	}
}

// Función para reproducir el siguiente fragmento de audio
async function playNextAudio(audioContext) {
	// Si ya hay audio reproduciéndose, no hacemos nada
	if (isPlaying) {
		return;
	}

	// Si hay fragmentos en la cola, comienza a reproducir el siguiente
	if (audioQueue.length > 0) {
		const audioData = audioQueue.shift(); // Saca el primer fragmento de la cola
		await playAudioFragment(audioContext, audioData); // Reproducir el fragmento
	}
}

// Función para decodificar y reproducir un fragmento de audio
async function playAudioFragment(audioContext, audioData) {
	return new Promise((resolve, reject) => {
		// Verifica si los datos del audio son válidos
		if (audioData && audioData.buffer) {
			const audioBuffer = audioData.buffer;

			// Aquí puedes intentar recrear el buffer para asegurarte de que está alineado correctamente
			audioContext.decodeAudioData(audioBuffer)
				.then((audioBuffer) => {
					const sourceNode = audioContext.createBufferSource();
					sourceNode.buffer = audioBuffer;
					sourceNode.connect(audioContext.destination);

					// Marca que el audio está reproduciéndose
					isPlaying = true;

					// Cuando el audio termine, marca que terminó y llama a la función de resolución
					sourceNode.onended = () => {
						isPlaying = false; // Actualiza el estado de la reproducción
						resolve(); // Resuelve la promesa y permite continuar con el siguiente fragmento
						playNextAudio(audioContext); // Llama a playNextAudio para seguir con el siguiente fragmento
					};

					// Comienza a reproducir
					sourceNode.start();
				})
				.catch((decodeError) => {
					console.warn("Error al decodificar el fragmento actual:", decodeError);
					resolve(); // Resuelve para continuar, incluso si hay error en la decodificación
					playNextAudio(audioContext); // Asegúrate de continuar con el siguiente fragmento
				});
		} else {
			console.warn("Fragmento de audio inválido recibido", audioData);
			resolve(); // Resuelve de todos modos para continuar con el siguiente fragmento
			playNextAudio(audioContext); // Continúa con el siguiente fragmento
		}
	});
}

function generateLong() {
    const timestamp = Date.now(); // Milisegundos desde 1970
    const randomPart = Math.floor(Math.random() * 100000); // Número aleatorio de 5 dígitos
    return BigInt(`${timestamp}${randomPart}`); // Combina y devuelve como BigInt
}

let firstNumber = localStorage.getItem('firstNumber');
let secondNumber = localStorage.getItem('secondNumber');

// Si los números no existen, se generan y almacenan
if (!firstNumber || !secondNumber) {
    firstNumber = generateLong().toString(); // Genera primer número
    secondNumber = generateLong().toString(); // Genera segundo número
    localStorage.setItem('firstNumber', firstNumber);
    localStorage.setItem('secondNumber', secondNumber);
    
    // Mostrar la alerta personalizada
    showCustomAlert();
}

console.log('First Number:', firstNumber);
console.log('Second Number:', secondNumber);

// Función para mostrar la alerta personalizada
function showCustomAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'block'; // Muestra la alerta
}

// Función para cerrar la alerta
function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'none'; // Cierra la alerta
}


// Función para detectar si el dispositivo es móvil
function isMobileDevice() {
	return /Mobi|Android/i.test(navigator.userAgent);
}

// Función para vibrar el dispositivo si es móvil
function vibrateOnMobile(duration = 50) {
    if ("vibrate" in navigator) {
        navigator.vibrate(duration);
    } else {
        console.warn("Vibration API no está soportada en este dispositivo.");
    }
}

const updateScrollOnKeyboardToggle = (inputElement, chatContainer) => {
  const initialHeight = window.innerHeight;

  // Listener para cuando el input obtiene el foco (teclado mostrado)
  inputElement.addEventListener('focus', () => {
    setTimeout(() => {
      const currentHeight = window.innerHeight;
      chatContainer.style.height = `${currentHeight - inputElement.offsetHeight}px`;
      chatContainer.scrollTop = chatContainer.scrollHeight; // Desplazar al final del chat
    }, 300);
  });

  // Listener para cuando el input pierde el foco (teclado oculto)
  inputElement.addEventListener('blur', () => {
    setTimeout(() => {
      document.body.style.height = `${initialHeight}px`; // Restaurar el alto original
      chatContainer.style.height = `calc(100vh - ${inputElement.offsetHeight}px)`;
      chatContainer.scrollTop = chatContainer.scrollHeight; // Desplazar al final del chat
    }, 300);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const userInput = document.getElementById('userInput');
  const chatContainer = document.getElementById('chatContainer');
  if (userInput && chatContainer) {
    updateScrollOnKeyboardToggle(userInput, chatContainer);
  }
});
