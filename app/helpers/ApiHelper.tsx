import { ApiError, LoginRequest, LoginResponse } from "../models/Interfaces";
import { Constants } from "./Constants";

// Utility per calcolare SHA256
async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

class ApiHelper {
    static async login(credentials: LoginRequest): Promise<LoginResponse | ApiError> {
    try {
      // Calcola SHA256 della password
      const hashedPassword = await sha256(credentials.password);
      
      const response = await fetch(`${Constants.API_BASE_URI}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: hashedPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Errore durante il login',
          error: data.error
        };
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
        message: data.message
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Errore di connessione al server'
      };
    }
  }
}  

export default ApiHelper;