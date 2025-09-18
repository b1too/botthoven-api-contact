// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ContactModule } from './contact/contact.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [PrismaModule, MailModule, ContactModule, ServicesModule],
})
export class AppModule {}
