import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  messageStream = new Subject<string>(); // Emitirá cada fragmento de texto recibido

  constructor(private authSvc: AuthService) { }

  async fetchMessageHistory(paginationKey = 0, paginationSize = 100): Promise<any> {
    try {
      const response = await fetch(`http://181.50.68.46:3940/llmText/arys-history?paginationSize=${paginationSize}&paginationKey=${paginationKey}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.authSvc.getToken()}`,
        },
      });

      if (response.status === 401) {
        console.warn("Token expirado. Intentando renovar...");
        const { username, password } = this.authSvc.getUserInfo() || {};
        const newToken = await this.authSvc.login(username!, password!);
        if (newToken) {
          return await this.fetchMessageHistory(paginationKey, paginationSize); // Reintentar con el nuevo token
        } else {
          throw new Error("No se pudo renovar el token.");
        }
      }

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener el historial de mensajes:", error);
      return { "server-message": "Error: No se pudo cargar el historial." };
    }
  }

  async fetchImageFromServer(userMessage: string): Promise<string> {
    try {
      const response = await fetch("http://181.50.68.46:3940/llmImage/arys-img-byte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.authSvc.getToken()}`,
        },
        body: JSON.stringify({ userMessage }),
      });

      if (response.status === 401) {
        console.warn("Token expirado. Intentando renovar...");
        const { username, password } = this.authSvc.getUserInfo() || {};
        const newToken = await this.authSvc.login(username!, password!);
        if (newToken) {
          return await this.fetchImageFromServer(userMessage); // Reintentar con el nuevo token
        } else {
          throw new Error("No se pudo renovar el token.");
        }
      }
  
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor: " + response.status);
      }
  
      //const serverMessageDiv = appendMessage("server-message", "", false);
      const imageBlob = await response.blob(); // Obtener la imagen como un blob
      const imageUrl = URL.createObjectURL(imageBlob); // Crear una URL para la imagen
  
      // Crear el contenedor para mostrar la imagen en la interfaz
      const imageElement = document.createElement("img");
      imageElement.src = imageUrl;
      imageElement.alt = "Imagen generada";
      imageElement.style.maxWidth = "100%";

      return imageUrl;
  
    } catch (error) {
      console.error("Error al comunicarse con el servidor para generar la imagen:", error);
    }

    return "";
  }

  async fetchMessagesFromServer(userMessage: string): Promise<void> {
    try {
      const response = await fetch('http://181.50.68.46:3940/llmText/arys-txt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authSvc.getToken()}`,
        },
        body: JSON.stringify({ userMessage }),
      });

      if (!response.body) throw new Error('El servidor no soporta streaming');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Procesar JSON válido en el buffer
        while (true) {
          try {
            const jsonEndIndex = buffer.indexOf('}{');
            if (jsonEndIndex === -1) break;

            const jsonString = buffer.slice(0, jsonEndIndex + 1);
            buffer = buffer.slice(jsonEndIndex + 1);

            const parsed = JSON.parse(jsonString);
            if (parsed.text) {
              this.messageStream.next(parsed.text); // Emitir el fragmento al componente
            }
          } catch {
            break; // Salir si no hay JSON completo aún
          }
        }
      }
    } catch (error) {
      console.error('Error al comunicarse con el servidor:', error);
      this.messageStream.next('Error: No se pudo procesar la solicitud.');
    }
  }

  formatResponse(text: string) {
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
  
}
