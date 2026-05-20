import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { DatabaseCreateDto } from './database-create.dto';
import { DatabaseCreateService } from './database-create.service';

@UseGuards(JwtAuthGuard)
@Controller('databases')
export class DatabaseCreateController {
  constructor(private readonly service: DatabaseCreateService) {}

  @Post()
  run(@Body() dto: DatabaseCreateDto) {
    return this.service.run(dto);
  }
}
