import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      // Проверяем пользователя в таблице users
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .from('users')
        .select('*')
        .eq('id', payload.sub)
        .single();

      if (error || !data) {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        id: data.id,
        email: data.email || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 