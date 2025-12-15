export interface LoginRequest {
  username: string;
  password: string; // Password in chiaro che verrà hashata
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    user: string;
    name: string;
    role: 'admin' | 'team';
    lastHelp?: Date;
    lastCheckpoint?: Date;
    checkpointsCompleted?: number;
  };
  token?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

export interface CheckpointRequest {
  username: string;
  checkpointId: string;
}

export interface CheckpointResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface UserSearchResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    user: string;
    name: string;
    role: 'admin' | 'team';
    lastHelp?: Date;
    lastMinorCheckpoint?: Date;
    lastCheckpoint?: Date; //MAJOR
    checkpointsCompleted?: number;
  };
}