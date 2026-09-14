// Contenido de las páginas legales. BORRADOR: revisar con una asesoría antes
// de publicar. Los datos del titular que falten se muestran como PENDING y la
// página avisa de ello, para que nunca se publique un dato inventado.
import { COMPANY } from './company.js'

export const PENDING = '[Pendiente de completar]'

// Datos que debe aportar el titular de la web (LSSI-CE art. 10).
export const LEGAL_OWNER = {
  legalName: null, // Razón social, o nombre y apellidos si es autónomo
  taxId: null, // NIF / CIF
  address: null, // Domicilio completo
  email: null, // Email de contacto para asuntos legales y de privacidad
  registry: null, // Inscripción en el Registro Mercantil (solo sociedades)
}

export const LAST_UPDATED = null // Fecha de la última revisión, p. ej. '14 de septiembre de 2026'

export const hasPendingLegalData = Object.values(LEGAL_OWNER).some((value) => value === null)

const owner = (field) => LEGAL_OWNER[field] ?? PENDING

const OWNER_DETAILS = [
  { label: 'Titular', value: owner('legalName') },
  { label: 'NIF / CIF', value: owner('taxId') },
  { label: 'Domicilio', value: owner('address') },
  { label: 'Email', value: owner('email') },
  { label: 'Teléfono', value: COMPANY.phone.display },
  { label: 'Datos registrales', value: owner('registry') },
]

export const LEGAL_NOTICE = {
  path: '/aviso-legal',
  title: 'Aviso legal',
  description: `Aviso legal e información del titular del sitio web de ${COMPANY.name}.`,
  details: OWNER_DETAILS,
  sections: [
    {
      heading: 'Objeto',
      paragraphs: [
        `Este sitio web informa sobre los servicios de ${COMPANY.name}: reparación, mantenimiento, venta y asesoría técnica de maquinaria textil e industrial. El contacto se realiza por WhatsApp o por teléfono; la web no dispone de formularios ni tienda online.`,
      ],
    },
    {
      heading: 'Condiciones de uso',
      paragraphs: [
        'El acceso a esta web es gratuito e implica la aceptación de este aviso legal. La persona usuaria se compromete a hacer un uso adecuado de los contenidos, conforme a la ley y a la buena fe.',
      ],
    },
    {
      heading: 'Propiedad intelectual e industrial',
      paragraphs: [
        `Los textos, el logotipo y el diseño de esta web pertenecen a su titular o se usan con autorización. Queda prohibida su reproducción sin permiso.`,
        'Las marcas de fabricantes que se mencionan (por ejemplo, Juki, Brother, Singer o Pfaff) pertenecen a sus respectivos titulares. Se citan únicamente para indicar con qué equipos se trabaja, sin que exista relación comercial con ellos salvo que se indique lo contrario.',
      ],
    },
    {
      heading: 'Enlaces a servicios de terceros',
      paragraphs: [
        'Los botones de contacto abren WhatsApp, un servicio de Meta. Al usarlo se aplican sus propias condiciones y política de privacidad.',
      ],
    },
    {
      heading: 'Legislación aplicable',
      paragraphs: ['Este aviso legal se rige por la legislación española.'],
    },
  ],
}

export const PRIVACY_POLICY = {
  path: '/privacidad',
  title: 'Política de privacidad',
  description: `Cómo trata ${COMPANY.name} los datos personales de quienes visitan su web o le contactan.`,
  details: OWNER_DETAILS,
  sections: [
    {
      heading: 'Qué datos tratamos',
      paragraphs: [
        'Si nos escribes por WhatsApp o nos llamas: tu nombre, número de teléfono y la información que decidas compartir sobre tu máquina o avería.',
        'Al visitar la web: estadísticas de uso agregadas (páginas vistas, país, tipo de dispositivo y página de procedencia) mediante Vercel Web Analytics, que según su proveedor funciona sin cookies y sin identificar a la persona visitante.',
      ],
    },
    {
      heading: 'Para qué los usamos y con qué base legal',
      paragraphs: [
        'Para responder a tu consulta y, en su caso, prestarte el servicio solicitado: base legal de aplicación de medidas precontractuales o ejecución de un contrato a petición tuya (art. 6.1.b RGPD).',
        'Para conocer de forma agregada cómo se usa la web y mejorarla: interés legítimo del titular (art. 6.1.f RGPD).',
      ],
    },
    {
      heading: 'Cuánto tiempo los conservamos',
      paragraphs: [
        'Los datos de contacto se conservan mientras sea necesario para atender tu consulta o el servicio y, después, durante los plazos que exija la ley.',
      ],
    },
    {
      heading: 'Con quién los compartimos',
      paragraphs: [
        'Vercel Inc. aloja la web y proporciona las estadísticas de uso. WhatsApp (Meta) trata los mensajes cuando eliges ese canal, como responsable independiente. Estos proveedores pueden tratar datos fuera del Espacio Económico Europeo con las garantías previstas en el RGPD, según su propia documentación.',
        'No vendemos ni cedemos tus datos a terceros con fines comerciales.',
      ],
    },
    {
      heading: 'Tus derechos',
      paragraphs: [
        `Puedes pedir acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos escribiendo a ${owner('email')}. Si consideras que no se han respetado tus derechos, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).`,
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'Esta web no instala cookies propias ni de terceros con fines analíticos o publicitarios. Si esto cambia, se informará aquí y se pedirá tu consentimiento cuando sea necesario.',
      ],
    },
  ],
}

export const LEGAL_LINKS = [
  { label: LEGAL_NOTICE.title, href: LEGAL_NOTICE.path },
  { label: PRIVACY_POLICY.title, href: PRIVACY_POLICY.path },
]
