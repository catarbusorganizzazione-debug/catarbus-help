import { ApiError, LoginRequest, LoginResponse, CheckpointRequest, CheckpointResponse, UserSearchResponse, RankingResponse, LocationRequest, LocationResponse, UsersResponse } from "../models/Interfaces";
import { Constants } from "./Constants";
import DateHelper from "./DateHelper";

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

      const timestamp = DateHelper.formatDate();

      const updateCheckpointResponse = await fetch(`${Constants.API_BASE_URI}/checkpoints/${request.checkpointId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [userData.username]: timestamp,
          username: userData.username
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

  static async verifyLocation(request: LocationRequest): Promise<LocationResponse | ApiError> {
    try {
      const userData = JSON.parse(localStorage.getItem('catarbus_user') || '{}');

      if(!userData || !userData.username) {
        return {
          success: false,
          message: 'Utente non autenticato'
        };
      }

      const checkLocation = await fetch(`${Constants.API_BASE_URI}/verify?provaId=${request.provaId}&username=${userData.username}&location=${request.destination}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const checkLocationData = (await checkLocation.json()).data;

      if (!checkLocationData) {
        return {
          success: false,
          message: 'Errore durante la verifica della location'
        };
      }

      return {
        success: true,
        check: checkLocationData.verified,
        message: 'Verifica effettuata con successo.',
        info: checkLocationData?.info || ""
      };

    } catch (error) {
      console.error('Destination check error:', error);
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

  static async getUsersRanking(): Promise<RankingResponse | ApiError> {
    try {
      const response = await fetch(`${Constants.API_BASE_URI}/users/ranking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = (await response.json()).data;

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Errore durante il recupero della classifica',
          error: data.error
        };
      }

      return {
        success: true,
        message: data.message,
        ranking: data.ranking
      };

    } catch (error) {
      console.error('Ranking fetch error:', error);
      return {
        success: false,
        message: 'Errore di connessione al server'
      };
    }
  }

  static async getAllUsers(): Promise<UsersResponse | ApiError> {
    try {
      const response = await fetch(`${Constants.API_BASE_URI}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = (await response.json());

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Errore durante il recupero degli utenti',
          error: data.error
        };
      }

      return {
        success: true,
        message: data.message,
        users: data.users
      };

    } catch (error) {
      console.error('Users fetch error:', error);
      return {
        success: false,
        message: 'Errore di connessione al server'
      };
    }
  }
}  

export default ApiHelper;
