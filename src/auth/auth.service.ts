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
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.createUser({
          email,
          password,
          user_metadata: {
            firstName: firstName || '',
            lastName: lastName || '',
          },
          email_confirm: true, // Автоматически подтверждаем email
        });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new ConflictException('User already exists');
        }
        throw new UnauthorizedException(error.message);
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
          firstName: data.user.user_metadata?.firstName,
          lastName: data.user.user_metadata?.lastName,
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
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.getUserById(userId);

      if (error || !data.user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.firstName,
        lastName: data.user.user_metadata?.lastName,
      };
    } catch (error) {
      throw new UnauthorizedException('User validation failed');
    }
  }
} 