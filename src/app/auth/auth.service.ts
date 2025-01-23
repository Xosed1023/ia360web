import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = false;
  private token: string | null = null;

  constructor(private router: Router) { }

  async login(username: string, password: string): Promise<boolean> {
    
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    
    try {
      let response = await fetch("http://181.50.68.46:3940/auth/log-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: String(username),
          password: String(password),
        }),
      });

      if (!response.ok) {
        console.error("Error al renovar el token:", response.status);
        return false;
      }

      const data = await response.json();
      console.log("Respuesta del servidor en login:", data);
      
      if (data.jwt) {
        this.token = data.jwt;
        localStorage.setItem('accessToken', data.jwt);
        this.isLoggedIn = true;
        return true;
      } else {
        console.error("Token no encontrado en la respuesta.");
        return false;
      }
    } catch (error) {
      console.error("Error al comunicarse con el servidor para renovar el token:", error);
      return false;
    }
  }

  async register(username: string, password: string, name: string): Promise<boolean> {
    try {
      const response = await fetch("http://181.50.68.46:3940/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: String(username),
          password: String(password),
          nombres: String(name),
          roleRequest: {
            roleListName: ["USER"],
          },
        }),
      });

      if (!response.ok) {
        console.error("Error al registrar usuario:", response.status);
        return false;
      }

      console.log("Registro completado con éxito");
      return true;
    } catch (error) {
      console.error("Error al comunicarse con el servidor para registrar el usuario:", error);
      return false;
    }
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    console.log("Estado de autenticación:", this.isLoggedIn, this.token);
    return this.isLoggedIn;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserInfo(): User | null {
    return {
      username: localStorage.getItem('username') || '',
      password: localStorage.getItem('password') || '',
    };
  }
}
