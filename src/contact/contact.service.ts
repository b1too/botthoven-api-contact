import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ipToBytes } from './helpers/ip-bytes';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async create(dto: CreateContactDto, meta: { ip?: string; userAgent?: string }) {
    const locale: 'es' | 'en' = dto.lang ?? 'es';

    // 0) Verificar si ya envió un correo en los últimos 3 días
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentLead = await this.prisma.lead.findFirst({
      where: {
        email: dto.email,
        created_at: { gte: threeDaysAgo },
      },
      orderBy: { created_at: 'desc' },
    });

    if (recentLead) {
      throw new BadRequestException(
        locale === 'en'
          ? 'Please wait 3 days before sending another request.'
          : 'Por favor espera 3 días antes de enviar otra solicitud.'
      );
    }

    // 1) Resolver servicios por code o id (solo enabled)
    const selected: { id: number }[] = [];
    if (dto.serviceCodes?.length) {
      const rows = await this.prisma.service.findMany({
        where: { code: { in: dto.serviceCodes }, status: 'enabled' }, // 👈 string en vez de enum
        select: { id: true },
      });
      if (!rows.length) throw new BadRequestException('Servicios inválidos');
      selected.push(...rows);
    } else if (dto.serviceIds?.length) {
      const rows = await this.prisma.service.findMany({
        where: { id: { in: dto.serviceIds }, status: 'enabled' }, // 👈 string en vez de enum
        select: { id: true },
      });
      if (!rows.length) throw new BadRequestException('Servicios inválidos');
      selected.push(...rows);
    }

    // 2) Crear lead
    const lead = await this.prisma.lead.create({
      data: {
        first_name: dto.first_name,
        last_name : dto.last_name,
        email     : dto.email,
        company   : dto.company ?? null,
        message   : dto.message ?? null,
        source    : 'web-form',
        status    : 'new',
        ip        : ipToBytes(meta.ip),
        user_agent: meta.userAgent?.slice(0,255) ?? null,
        utm_source: dto.utm_source ?? null,
        utm_medium: dto.utm_medium ?? null,
        utm_campaign: dto.utm_campaign ?? null,
      },
      select: { id: true, first_name: true, last_name: true, email: true },
    });

    // 3) Asociar servicios N:M
    if (selected.length) {
      await this.prisma.leadService.createMany({
        data: selected.map(s => ({ lead_id: lead.id, service_id: s.id })),
        skipDuplicates: true,
      });
    }

    // 4) Nombres traducidos para el correo (locale con fallback ES)
    const svcIds = selected.map(s => s.id);
    let servicesForEmail: { name: string }[] = [];
    if (svcIds.length) {
      // Interfaz local para lo que seleccionamos (evita any)
      type STPick = { service_id: number; name: string };

      const es: STPick[] = await this.prisma.serviceTranslation.findMany({
        where: { service_id: { in: svcIds }, locale: 'es' },
        select: { service_id: true, name: true },
      });

      const reqT: STPick[] = await this.prisma.serviceTranslation.findMany({
        where: { service_id: { in: svcIds }, locale },
        select: { service_id: true, name: true },
      });

      // Record para evitar inferencia rara de Map#get
      const names: Record<number, string> = {};
      for (const r of es)   names[r.service_id] = r.name;
      for (const r of reqT) names[r.service_id] = r.name ?? names[r.service_id];

      servicesForEmail = svcIds.map(id => ({ name: names[id] ?? '' }));
    }

    // 5) Enviar correo de confirmación (React Email)
    await this.mail.sendConfirmation({
      to: lead.email,
      name: `${lead.first_name} ${lead.last_name}`,
      locale,
      services: servicesForEmail,
    });

    return {
      id: lead.id,
      message: locale === 'en'
        ? 'Lead stored and confirmation email sent.'
        : 'Lead guardado y correo de confirmación enviado.',
    };
  }
}
