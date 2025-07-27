import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = registerDto;

    try {
      // Создаем пользователя через signUp
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signUp({
          email,
          password,
          options: {
            data: {
              firstName: firstName || '',
              lastName: lastName || '',
            },
          },
        });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new ConflictException('User already exists');
        }
        throw new UnauthorizedException(error.message);
      }

      if (!data.user) {
        throw new UnauthorizedException('User creation failed');
      }

      const accessToken = this.jwtService.sign({
        sub: data.user.id,
        email: data.user.email || '',
      });

      return {
        accessToken,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          firstName: firstName || '',
          lastName: lastName || '',
        },
      };
    } catch (error) {
      if (error instanceof ConflictException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = this.jwtService.sign({
        sub: data.user.id,
        email: data.user.email || '',
      });

      return {
        accessToken,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          firstName: data.user.user_metadata?.firstName || '',
          lastName: data.user.user_metadata?.lastName || '',
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  async validateUser(userId: string) {
    try {
      // Получаем пользователя через admin API
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: data.id,
        email: data.email || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
      };
    } catch (error) {
      throw new UnauthorizedException('User validation failed');
    }
  }
} 