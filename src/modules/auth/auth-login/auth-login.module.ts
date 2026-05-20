import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthLoginController } from './auth-login.controller';
import { AuthLoginService } from './auth-login.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'fallback-secret-change-me',
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  controllers: [AuthLoginController],
  providers: [AuthLoginService],
})
export class AuthLoginModule {}
