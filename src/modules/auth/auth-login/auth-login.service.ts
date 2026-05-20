import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SqliteService } from '../../../providers/sqlite/sqlite.service';
import { AuthLoginDto } from './auth-login.dto';

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
}

@Injectable()
export class AuthLoginService implements OnModuleInit {
  private readonly logger = new Logger(AuthLoginService.name);

  constructor(
    private readonly sqlite: SqliteService,
    private readonly jwt: JwtService,
  ) {}

  async onModuleInit() {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const existing = this.sqlite.db
      .prepare('SELECT id FROM users WHERE username = ?')
      .get(adminUser);
    if (!existing) {
      const hash = await bcrypt.hash(adminPassword, 10);
      this.sqlite.db
        .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
        .run(adminUser, hash);
      this.logger.log(`Admin "${adminUser}" criado automaticamente.`);
    }
  }

  async run(dto: AuthLoginDto): Promise<{ access_token: string }> {
    const user = this.sqlite.db
      .prepare('SELECT * FROM users WHERE username = ?')
      .get(dto.username) as UserRow | undefined;
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');
    return {
      access_token: this.jwt.sign({ sub: user.id, username: user.username }),
    };
  }
}
