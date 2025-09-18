import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ServiceOption = {
  id: number;
  code: string;
  slug: string;
  icon: string | null;
  display_order: number;
  status: 'enabled' | 'disabled' | 'archived';
  name: string;
  description: string | null;
};

export type ServiceOptionBoth = {
  id: number;
  code: string;
  slug: string;
  icon: string | null;
  display_order: number;
  status: 'enabled' | 'disabled' | 'archived';
  translations: {
    es: { name: string; description: string | null };
    en: { name: string; description: string | null };
  };
};

type SProcRow = {
  id: number;
  code: string;
  slug: string;
  icon: string | null;
  display_order: number;
  status: 'enabled' | 'disabled' | 'archived';
  name_resolved: string;
  description_resolved: string | null;
};

type STRow = {
  service_id: number;
  locale: 'es' | 'en';
  name: string;
  description: string | null;
};

function normalizeCallResult<T>(res: unknown): T[] {
  if (Array.isArray(res)) {
    const first = (res as unknown[])[0];
    const rows = Array.isArray(first) ? first : res;
    return (rows as any[]).map(row => {
      const normalized = { ...row };
      for (const key in normalized) {
        if (typeof normalized[key] === 'bigint') {
          normalized[key] = Number(normalized[key]);
        }
      }
      return normalized as T;
    });
  }
  return [];
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Modo "single locale" (usa el SP con fallback a ES).
   */
  async list(locale: 'es' | 'en' = 'es'): Promise<ServiceOption[]> {
    const raw = await this.prisma.$queryRawUnsafe<unknown>('CALL sp_services_i18n(?)', locale);
    const rows = normalizeCallResult<SProcRow>(raw);
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      slug: r.slug,
      icon: r.icon,
      display_order: r.display_order,
      status: r.status,
      name: r.name_resolved,
      description: r.description_resolved,
    }));
  }

  /**
   * Modo "both": devuelve ES + EN en una sola respuesta.
   * - 1 query a services (enabled)
   * - 1 query a service_translations (IN es,en)
   * - Fallback: ES usa base s.name/description si falta; EN cae a ES y luego a base.
   */
  async listBoth(): Promise<ServiceOptionBoth[]> {
    const services = await this.prisma.service.findMany({
      where: { status: 'enabled' },
      select: {
        id: true,
        code: true,
        slug: true,
        icon: true,
        display_order: true,
        status: true,
        name: true,          // base ES (fallback)
        description: true,   // base ES (fallback)
      },
      orderBy: [{ display_order: 'asc' }, { id: 'asc' }],
    });

    if (!services.length) return [];

    const ids = services.map((s) => s.id);
    const translations = await this.prisma.serviceTranslation.findMany({
      where: { service_id: { in: ids }, locale: { in: ['es', 'en'] } },
      select: { service_id: true, locale: true, name: true, description: true },
    });

    // indexamos por service_id y locale
    const byService: Record<number, { es?: STRow; en?: STRow }> = {};
    for (const t of translations as STRow[]) {
      const bucket = (byService[t.service_id] ||= {});
      if (t.locale === 'es') bucket.es = t;
      if (t.locale === 'en') bucket.en = t;
    }

    // armamos respuesta con ambos idiomas y fallback
    const out: ServiceOptionBoth[] = services.map((s): ServiceOptionBoth => {
      const t = byService[s.id] || {};
      const esName = t.es?.name ?? s.name;
      const esDesc = t.es?.description ?? s.description ?? null;

      const enName = t.en?.name ?? esName;
      const enDesc = t.en?.description ?? esDesc;

      return {
        id: s.id,
        code: s.code,
        slug: s.slug,
        icon: s.icon,
        display_order: s.display_order,
        status: s.status as 'enabled' | 'disabled' | 'archived',
        translations: {
          es: { name: esName, description: esDesc },
          en: { name: enName, description: enDesc },
        },
      };
    });

    return out;
  }
}
