import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface ContactConfirmationEmailProps {
  name: string;
  locale: 'es' | 'en';
  services: { name: string }[];
  message?: string;
  appUrl?: string;
}

export const ContactConfirmationEmail = ({
  name,
  locale = 'es',
  services = [],
  message,
  appUrl,
}: ContactConfirmationEmailProps) => {
  const t = {
    es: {
      preview: 'Gracias por contactar con Botthoven - Tu solicitud ha sido recibida',
      title: '¡Gracias por contactar con Botthoven!',
      intro: 'Hemos recibido tu solicitud de contacto. Nuestro equipo revisará los detalles y te contactará dentro de las próximas 24 horas para discutir cómo podemos ayudarte.',
      services_title: 'Servicios de interés:',
      message_title: 'Tu mensaje:',
      next_steps: 'Próximos pasos:',
      step1: 'Recibirás una llamada o email de nuestro equipo',
      step2: 'Programaremos una demo personalizada',
      step3: 'Crearemos un plan adaptado a tus necesidades',
      need_help: '¿Necesitas ayuda inmediata?',
      copyright: '© 2025 Botthoven. Todos los derechos reservados.',
    },
    en: {
      preview: 'Thank you for contacting Botthoven - Your request has been received',
      title: 'Thank you for contacting Botthoven!',
      intro: 'We have received your contact request. Our team will review the details and contact you within the next 24 hours to discuss how we can help you.',
      services_title: 'Services of interest:',
      message_title: 'Your message:',
      next_steps: 'Next steps:',
      step1: 'You will receive a call or email from our team',
      step2: 'We will schedule a personalized demo',
      step3: 'We will create a plan tailored to your needs',
      need_help: 'Need immediate help?',
      copyright: '© 2025 Botthoven. All rights reserved.',
    },
  }[locale];
  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Tailwind>
        <Body className="bg-[#f8fafc] font-sans">
          {/* Header con gradiente */}
          <Section className="bg-gradient-to-r from-[#08152c] to-[#356de2]">
            <Container className="px-6 py-8">
              <Section className="text-center">
                <Img
                  src="https://i.imgur.com/tg2hW9E.png"
                  width="60"
                  height="60"
                  alt="Botthoven"
                  className="inline-block mx-2 drop-shadow-lg"
                />
              </Section>
              <Heading className="text-[#08152c] text-xl font-bold text-center mt-6 mb-0">
                {t.title}
              </Heading>
            </Container>
          </Section>

          {/* Contenido principal */}
          <Container className="px-6 py-8 bg-white rounded-lg shadow-lg mx-auto mt-4 max-w-xl">
            <Section>
              <Text className="text-[#08152c] text-lg mb-4">
                {locale === 'es' ? `Hola ${name},` : `Hi ${name},`}
              </Text>
              <Text className="text-[#08152c] mb-6">
                {t.intro}
              </Text>

              {/* Servicios seleccionados */}
              <Section className="bg-[#f8fafc] rounded-lg p-4 mb-6">
                <Text className="text-[#08152c] font-semibold mb-2">
                  {t.services_title}
                </Text>
                {services.map((service, index) => (
                  <Text key={index} className="text-[#08152c] ml-4 mb-1 flex items-center">
                    <span className="text-[#356de2] mr-2">•</span>
                    {service.name}
                  </Text>
                ))}
              </Section>

              {/* Mensaje del usuario */}
              {message && (
                <Section className="mb-6">
                  <Text className="text-[#08152c] font-semibold mb-2">
                    {t.message_title}
                  </Text>
                  <Text className="text-[#08152c] italic">
                    "{message}"
                  </Text>
                </Section>
              )}

              {/* Próximos pasos */}
              <Section className="bg-[#f8fafc] rounded-lg p-4 mb-6">
                <Text className="text-[#08152c] font-semibold mb-2">
                  {t.next_steps}
                </Text>
                <Text className="text-[#08152c] mb-1">
                  1. {t.step1}
                </Text>
                <Text className="text-[#08152c] mb-1">
                  2. {t.step2}
                </Text>
                <Text className="text-[#08152c]">
                  3. {t.step3}
                </Text>
              </Section>

            </Section>

            {/* Footer */}
            <Section className="bg-[#356de2] mt-8 py-6 px-4 rounded-lg">
              <Container className="text-center">
                <Text className="text-white text-sm mb-2">
                  {t.need_help}
                </Text>
                <Link
                  href="mailto:hola@botthoven.com"
                  className="text-white hover:text-white/90"
                >
                  hola@botthoven.com
                </Link>
                <Text className="text-white/80 text-xs mt-4">
                  {t.copyright}
                </Text>
              </Container>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactConfirmationEmail;
