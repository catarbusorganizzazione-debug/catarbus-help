import { ApiError, LoginRequest, LoginResponse, CheckpointRequest, CheckpointResponse, UserSearchResponse } from "../models/Interfaces";
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

      const data = (await response.json()).data;

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

  static async registerCheckpoint(request: CheckpointRequest): Promise<CheckpointResponse | ApiError> {
    try {
      const userData = JSON.parse(localStorage.getItem('catarbus_user') || '{}');

      if(!userData || !userData.username) {
        return {
          success: false,
          message: 'Utente non autenticato'
        };
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      const timestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;

      const updateCheckpointResponse = await fetch(`${Constants.API_BASE_URI}/checkpoints/${request.checkpointId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [userData.username]: timestamp
        })
      });

      const checkpointData = (await updateCheckpointResponse.json()).data;

      if (!updateCheckpointResponse.ok) {
        return {
          success: false,
          message: checkpointData.message || 'Errore durante la registrazione del checkpoint',
          error: checkpointData.error
        };
      }

      const updateUserResponse = await fetch(`${Constants.API_BASE_URI}/users/editbyusername/${userData.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          checkpointsCompleted: checkpointData.isMajorCheckpoint ? userData.checkpointsCompleted + 1 : userData.checkpointsCompleted + 0.1,
          [checkpointData.isMajorCheckpoint ? 'lastMajorCheckpoint' : 'lastMinorCheckpoint']: timestamp
        })
      });

      const userUpdateResponse = (await updateUserResponse.json()).data;

      if (!updateUserResponse.ok) {
        return {
          success: false,
          message: userUpdateResponse.message || 'Errore durante l\'aggiornamento del progresso dell\'utente',
          error: userUpdateResponse.error
        };
      }

      return {
        success: true,
        message: checkpointData.message || 'Checkpoint registrato con successo',
        data: checkpointData.result
      };

    } catch (error) {
      console.error('Checkpoint registration error:', error);
      return {
        success: false,
        message: 'Errore di connessione al server'
      };
    }
  }

  static async searchUser(username: string): Promise<UserSearchResponse | ApiError> {
    try {
      const response = await fetch(`${Constants.API_BASE_URI}/users/search/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = (await response.json()).users[0];

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Errore durante la ricerca dell\'utente',
          error: data.error
        };
      }

      return {
        success: true,
        message: data.message,
        user: data
      };

    } catch (error) {
      console.error('User search error:', error);
      return {
        success: false,
        message: 'Errore di connessione al server'
      };
    }
  }
}  

export default ApiHelper;