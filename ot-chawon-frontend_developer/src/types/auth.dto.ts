export namespace AuthDto {
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface SignupRequest {
    email: string;
    password: string;
    name: string;
  }

  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  export interface UserProfile {
    id: number;
    email: string;
    name: string;
    role: UserRole;
  }

  export type UserRole = 'USER' | 'ADMIN';
}
