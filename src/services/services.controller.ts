import { Controller, Get, Query } from '@nestjs/common';
import { ServicesService, ServiceOption, ServiceOptionBoth } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly svc: ServicesService) {}

  /**
   * GET /services?lang=es|en|both
   * - es|en → listado con un solo idioma (usa SP con fallback a ES)
   * - both  → listado con ambos idiomas en una sola respuesta
   */
  @Get()
  async getServices(
    @Query('lang') lang?: 'es' | 'en' | 'both',
  ): Promise<ServiceOption[] | ServiceOptionBoth[]> {
    if (lang === 'both') {
      return this.svc.listBoth();
    }
    const locale: 'es' | 'en' = lang === 'en' ? 'en' : 'es';
    return this.svc.list(locale);
  }
}
