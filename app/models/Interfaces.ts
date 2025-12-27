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

export interface LocationRequest {
  username: string;
  provaId: string;
  destination: string;
  info?: string
}

export interface CheckpointResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface LocationResponse {
  success: boolean;
  check: boolean;
  message: string;
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

export interface RankingUser {
  name: string;
  colour: string;
  checkpointsCompleted: number;
}

export interface RankingResponse {
  success: boolean;
  message?: string;
  ranking?: RankingUser[];
}

export interface User {
  id: string;
  user: string;
  username: string;
  name: string;
  colour: string;
  role: 'admin' | 'team';
  lastHelp?: string;
  lastMinorCheckpoint?: string;
  lastCheckpoint?: string;
  checkpointsCompleted?: number;
}

export interface UsersResponse {
  success: boolean;
  message?: string;
  users?: User[];
}
