import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthLoginModule } from './auth-login/auth-login.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule, AuthLoginModule],
  providers: [JwtStrategy],
})
export class AuthModule {}
