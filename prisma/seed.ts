import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const services = [
    { code: 'process_automation', slug: 'automatizacion-de-procesos', name: 'Automatización de Procesos', description: 'Automatiza tareas repetitivas y reduce errores.', display_order: 10 },
    { code: 'web_integration', slug: 'integracion-plataformas-web', name: 'Integración con Plataformas Web', description: 'Conecta tus sistemas con APIs y terceros.', display_order: 20 },
    { code: 'rpa_consulting', slug: 'consultoria-rpa', name: 'Consultoría RPA', description: 'Diagnóstico y roadmap para automatizar con impacto.', display_order: 30 },
    { code: 'custom_development', slug: 'desarrollo-personalizado', name: 'Desarrollo Personalizado', description: 'Soluciones a medida alineadas al negocio.', display_order: 40 },
    { code: 'workflow_optimization', slug: 'optimizacion-de-flujos-de-trabajo', name: 'Optimización de Flujos de Trabajo', description: 'Rediseño y mejora de procesos.', display_order: 50 },
    { code: 'tech_support', slug: 'soporte-tecnico', name: 'Soporte Técnico', description: 'Soporte continuo y mantenimiento.', display_order: 60 },
  ];

  for (const s of services) {
    const svc = await prisma.service.upsert({
      where: { code: s.code },
      update: { slug: s.slug, name: s.name, description: s.description, display_order: s.display_order, status: 'enabled' },
      create: { code: s.code, slug: s.slug, name: s.name, description: s.description, display_order: s.display_order, status: 'enabled' }
    });

    // ES translation
    await prisma.serviceTranslation.upsert({
      where: { service_id_locale: { service_id: svc.id, locale: 'es' } },
      update: { name: s.name, description: s.description },
      create: { service_id: svc.id, locale: 'es', name: s.name, description: s.description }
    });

    // EN translation
    const enMap: Record<string, {name: string; description: string}> = {
      process_automation: { name: 'Process Automation', description: 'Automate repetitive tasks and reduce errors.' },
      web_integration: { name: 'Web Platform Integration', description: 'Connect your systems with third-party APIs and platforms.' },
      rpa_consulting: { name: 'RPA Consulting', description: 'Assessment and roadmap to automate with impact.' },
      custom_development: { name: 'Custom Development', description: 'Tailor-made solutions aligned to your business.' },
      workflow_optimization: { name: 'Workflow Optimization', description: 'Redesign and improve business processes.' },
      tech_support: { name: 'Technical Support', description: 'Ongoing support and maintenance.' },
    };
    const en = enMap[s.code as keyof typeof enMap];
    await prisma.serviceTranslation.upsert({
      where: { service_id_locale: { service_id: svc.id, locale: 'en' } },
      update: { name: en.name, description: en.description },
      create: { service_id: svc.id, locale: 'en', name: en.name, description: en.description }
    });
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
