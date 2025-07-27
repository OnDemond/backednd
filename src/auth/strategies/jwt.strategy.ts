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
      // Проверяем пользователя в Supabase
      const { data: user, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.getUserById(payload.sub);

      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      return {
        id: user.user.id,
        email: user.user.email,
        firstName: user.user.user_metadata?.firstName,
        lastName: user.user.user_metadata?.lastName,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 