import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDto } from './auth-login.dto';
import { AuthLoginService } from './auth-login.service';

@Controller('auth')
export class AuthLoginController {
  constructor(private readonly authLoginService: AuthLoginService) {}

  @Post('login')
  run(@Body() dto: AuthLoginDto) {
    return this.authLoginService.run(dto);
  }
}
