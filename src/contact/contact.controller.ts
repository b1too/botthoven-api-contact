import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('contact')
export class ContactController {
  constructor(private service: ContactService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() dto: CreateContactDto, @Req() req: any) {
    const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '').trim();
    const userAgent = req.headers['user-agent'];
    return this.service.create(dto, { ip, userAgent });
  }
}
