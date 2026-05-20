import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { DatabaseDeleteService } from './database-delete.service';

@UseGuards(JwtAuthGuard)
@Controller('databases')
export class DatabaseDeleteController {
  constructor(private readonly service: DatabaseDeleteService) {}

  @Delete(':id')
  run(@Param('id', ParseIntPipe) id: number) {
    return this.service.run(id);
  }
}
