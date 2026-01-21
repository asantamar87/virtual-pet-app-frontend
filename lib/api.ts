const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// --- Interfaces ---
export interface LoginRequest { username: string; password: string }
export interface RegisterRequest { username: string; password: string }

export interface AuthResponse {
  accessToken: string; 
  tokenType?: string;
  username: string;
  roles: string[];
  token?: string; 
}

export interface PetRequest { name: string; species: string }

export interface PetResponse {
  id: number
  name: string
  species: string
  hunger: number
  happiness: number
  energy: number
  health: number
  ownerUsername: string
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("token");
    if (!token) return null;
    return token.replace(/^["'](.+)["']$/, '$1').trim();
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: Record<string, string> = { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
    if (includeAuth) {
      const token = this.getToken();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse(response: Response) {
    const text = await response.text();
    let data;
    
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }
    
    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.clear();
        if (window.location.pathname !== "/") window.location.href = "/";
      }
      
      // Construimos un objeto de error enriquecido para que el Frontend lo lea fácilmente
      const errorMessage = data?.message || text || "Error en la petición";
      const error = new Error(errorMessage) as any;
      
      // Añadimos la propiedad 'response' para compatibilidad con el catch del Dialog
      error.response = { data: data || { message: errorMessage } };
      
      throw error;
    }

    return data || { message: text };
  }

  // --- Autenticación ---

  async register(data: RegisterRequest): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    
    const result = await this.handleResponse(res);
    
    if (result && result.accessToken) {
      const authData = {
        ...result,
        token: result.accessToken,
        username: result.username || data.username,
        roles: result.roles || ["ROLE_USER"]
      };
      
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify({
        username: authData.username,
        roles: authData.roles
      }));
      
      return authData;
    }
    return result;
  }

  // --- Mascotas ---

  async getMyPets(): Promise<PetResponse[]> {
    const res = await fetch(`${API_BASE_URL}/pets`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse(res);
    return Array.isArray(data) ? data : [];
  }

  async getAllPets(): Promise<PetResponse[]> {
    const res = await fetch(`${API_BASE_URL}/pets/all`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    const data = await this.handleResponse(res);
    return Array.isArray(data) ? data : [];
  }

  async createPet(data: { name: string; species: string }): Promise<PetResponse> {
    const res = await fetch(`${API_BASE_URL}/pets`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  // MÉTODO CORREGIDO: Añadido para habilitar la edición
  async updatePet(id: number, data: { name: string; species: string }): Promise<PetResponse> {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async petAction(id: number, action: 'feed' | 'sleep' | 'play'): Promise<PetResponse> {
    const res = await fetch(`${API_BASE_URL}/pets/${id}/${action}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({}),
    });
    return this.handleResponse(res);
  }

  async deletePet(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!res.ok) await this.handleResponse(res);
  }
}

export const api = new ApiClient();