// Legal pages content. The texts are pending review by a legal adviser. A missing or
// blank owner detail is shown as PENDING and turns on the draft notice, so an
// invented value is never published.
import { COMPANY } from './company'

export const PENDING = '[Pendiente de completar]'

export interface LegalDetail {
  label: string
  value: string
  href?: string
}

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export interface LegalPageContent {
  path: string
  title: string
  description: string
  identification: { heading: string; items: LegalDetail[] }
  sections: LegalSection[]
}

type OwnerField = 'legalName' | 'taxId' | 'address' | 'email'

// Identification required by LSSI-CE art. 10.1 a and e. There is no Registro Mercantil
// entry (art. 10.1 b): the owner is a sole trader.
export const LEGAL_OWNER: Record<OwnerField, string> = {
  legalName: 'Jhon Mario Hernández Melo',
  taxId: '60415860N',
  address: 'Carrer del Perú, 7, 08921 Santa Coloma de Gramenet (Barcelona)',
  email: 'tecnitextil2@gmail.com',
}

// Date of the last review of the legal texts.
export const LAST_UPDATED: string = '25 de septiembre de 2026'

export function isMissing(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
}

const REQUIRED_OWNER_FIELDS: OwnerField[] = ['legalName', 'taxId', 'address', 'email']

export function missingLegalData(): string[] {
  const missing: string[] = REQUIRED_OWNER_FIELDS.filter((field) => isMissing(LEGAL_OWNER[field]))
  return isMissing(LAST_UPDATED) ? [...missing, 'lastUpdated'] : missing
}

export const hasPendingLegalData = missingLegalData().length > 0

const owner = (field: OwnerField): string =>
  isMissing(LEGAL_OWNER[field]) ? PENDING : LEGAL_OWNER[field]

// An email as a mailto: link, or the pending marker (never a link) while it is missing.
export function emailDetail(email: string): Pick<LegalDetail, 'value' | 'href'> {
  return isMissing(email) ? { value: PENDING } : { value: email, href: `mailto:${email}` }
}

// Owner identification required by LSSI-CE art. 10.1 a and e, shared by the legal
// notice and the sales conditions page (as "Vendedor").
const ownerDetails: LegalDetail[] = [
  { label: 'Titular', value: owner('legalName') },
  { label: 'NIF', value: owner('taxId') },
  { label: 'Domicilio', value: owner('address') },
  { label: 'Email', ...emailDetail(LEGAL_OWNER.email) },
  { label: 'Teléfono', value: COMPANY.phone.display },
]

export const LEGAL_NOTICE: LegalPageContent = {
  path: '/aviso-legal',
  title: 'Aviso legal',
  description: `Aviso legal e información del titular del sitio web de ${COMPANY.name}.`,
  identification: {
    heading: 'Datos del titular',
    items: ownerDetails,
  },
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
        'Las marcas y nombres comerciales citados pertenecen a sus respectivos titulares y se usan para identificar los productos y servicios ofrecidos.',
        'Las fotografías de la sección de máquinas de coser toldos son imágenes de referencia de sus fabricantes. En ese servicio, TECNITEXTIL actúa como servicio técnico independiente, sin vinculación con dichas marcas.',
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

export const PRIVACY_POLICY: LegalPageContent = {
  path: '/privacidad',
  title: 'Política de privacidad',
  description: `Cómo trata ${COMPANY.name} los datos personales de quienes visitan su web o le contactan.`,
  // GDPR art. 13.1 a: controller identity and contact. The NIF and the address only
  // appear in the legal notice.
  identification: {
    heading: 'Responsable del tratamiento',
    items: [
      { label: 'Responsable', value: owner('legalName') },
      { label: 'Email de contacto', ...emailDetail(LEGAL_OWNER.email) },
      { label: 'Identificación completa', value: LEGAL_NOTICE.title, href: LEGAL_NOTICE.path },
    ],
  },
  sections: [
    {
      heading: 'Qué datos tratamos',
      paragraphs: [
        'Si nos escribes por WhatsApp o nos llamas: tu nombre, número de teléfono y la información que decidas compartir sobre tu máquina o avería.',
        'Al visitar la web: estadísticas de uso agregadas (páginas vistas, país, tipo de dispositivo y página de procedencia) mediante Vercel Web Analytics, que según su proveedor funciona sin cookies y sin identificar a la persona visitante.',
        'Al servir la web, el proveedor de alojamiento (Vercel) registra de forma técnica la dirección IP y el tipo de navegador de cada visita, algo necesario para mostrar la web y protegerla frente a abusos.',
      ],
    },
    {
      heading: 'Para qué los usamos y con qué base legal',
      paragraphs: [
        'Para responder a tu consulta y, en su caso, prestarte el servicio solicitado: base legal de aplicación de medidas precontractuales o ejecución de un contrato a petición tuya (art. 6.1.b RGPD).',
        'Para conocer de forma agregada cómo se usa la web y mejorarla: interés legítimo del titular (art. 6.1.f RGPD).',
        'Para mostrar la web y mantenerla segura (el registro técnico de la IP y del navegador): interés legítimo del titular (art. 6.1.f RGPD).',
        'Si compras una máquina, también para emitir la factura y cumplir las obligaciones contables y fiscales: base legal de cumplimiento de una obligación legal (art. 6.1.c RGPD).',
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
    // GDPR art. 13.2 e and f: whether providing data is required, and automated decisions.
    {
      heading: 'Datos voluntarios y decisiones automatizadas',
      paragraphs: [
        'Darnos tus datos es voluntario y no es un requisito legal ni contractual. Sí es necesario para responder a tu consulta o preparar un presupuesto: sin ellos no podremos atenderte.',
        'No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos.',
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

// Generic art. 97 LGDCU pre-contractual information for a consumer buying a machine:
// withdrawal, legal warranty and complaints. Each quote links here; the site itself is
// not an online shop (LSSI art. 27.2.b), since every sale closes by WhatsApp, phone or
// email.
export const SALES_CONDITIONS: LegalPageContent = {
  path: '/condiciones-de-venta',
  title: 'Condiciones de venta',
  description: `Información para comprar una máquina a ${COMPANY.name} como consumidor: desistimiento, garantía y reclamaciones.`,
  identification: { heading: 'Vendedor', items: ownerDetails },
  sections: [
    {
      heading: 'Antes de comprar',
      paragraphs: [
        'Esta web no es una tienda online: cada venta se acuerda por WhatsApp, teléfono o correo electrónico. Antes de la compra te enviamos por escrito un presupuesto con las características de la máquina, el precio total con impuestos, los gastos de envío, la forma de pago, el plazo de entrega y el coste estimado de devolverla si desistes. Cuando lo aceptas, te confirmamos la compra por escrito.',
        'La información de esta página se aplica cuando compras como consumidor. Si compras como empresa o profesional, no se aplican el derecho de desistimiento ni la garantía legal de consumo.',
      ],
    },
    {
      heading: 'Derecho de desistimiento',
      paragraphs: [
        'Si la compra se ha cerrado a distancia (por WhatsApp, teléfono o correo electrónico) o fuera de nuestras instalaciones, tienes derecho a desistir del contrato en un plazo de 14 días naturales sin necesidad de justificación. El plazo de desistimiento expirará a los 14 días naturales del día en que tú o un tercero indicado por ti, distinto del transportista, adquiera la posesión material de la máquina.',
        `Para ejercer el derecho de desistimiento, deberás notificarnos tu decisión de desistir del contrato a través de una declaración inequívoca, por ejemplo por WhatsApp o por teléfono al ${COMPANY.phone.display}, o por correo electrónico a ${owner('email')}. Podrás utilizar el modelo de formulario de desistimiento que figura a continuación, aunque su uso no es obligatorio. Para cumplir el plazo, basta con que la comunicación se envíe antes de que venza.`,
        'En caso de desistimiento, te devolveremos todos los pagos recibidos, incluidos los gastos de entrega (con la excepción de los gastos adicionales resultantes de la elección de una modalidad de entrega diferente a la modalidad menos costosa de entrega ordinaria que ofrezcamos), sin ninguna demora indebida y, en todo caso, a más tardar 14 días naturales a partir de la fecha en la que se nos informe de tu decisión de desistir. El reembolso se hará con el mismo medio de pago que usaste, salvo que dispongas expresamente lo contrario, y no te supondrá ningún gasto. Podremos retener el reembolso hasta haber recibido la máquina o hasta que presentes una prueba de su devolución, según qué condición se cumpla primero.',
        'Deberás devolvernos la máquina sin ninguna demora indebida y, en cualquier caso, a más tardar en el plazo de 14 días naturales a partir de la fecha en que nos comuniques tu decisión de desistir. Deberás asumir el coste directo de la devolución; como las máquinas no pueden devolverse normalmente por correo, su coste estimado se indica en el presupuesto. Solo serás responsable de la disminución de valor de la máquina resultante de una manipulación distinta a la necesaria para establecer su naturaleza, sus características y su funcionamiento.',
        `Modelo de formulario de desistimiento (solo debes cumplimentarlo y enviarlo si deseas desistir del contrato): A la atención de ${owner('legalName')}, ${owner('address')}, ${owner('email')}. Por la presente le comunico que desisto de mi contrato de venta del siguiente bien: [máquina y modelo]. Pedido el / recibido el: [fecha]. Nombre del consumidor: [nombre]. Domicilio del consumidor: [domicilio]. Firma del consumidor (solo si el presente formulario se presenta en papel). Fecha: [fecha].`,
      ],
    },
    {
      heading: 'Garantía',
      paragraphs: [
        'Como consumidor, tienes la garantía legal de conformidad: respondemos de las faltas de conformidad que se manifiesten en los tres años siguientes a la entrega de la máquina.',
        'Además, las máquinas tienen la garantía comercial del fabricante, en las condiciones que este establece. Te ayudamos a tramitarla, y no limita tus derechos de la garantía legal.',
      ],
    },
    {
      heading: 'Reclamaciones',
      paragraphs: [
        `Puedes presentar cualquier queja o reclamación por WhatsApp o por teléfono al ${COMPANY.phone.display}, o por correo electrónico a ${owner('email')}.`,
      ],
    },
  ],
}

export const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: SALES_CONDITIONS.title, href: SALES_CONDITIONS.path },
  { label: LEGAL_NOTICE.title, href: LEGAL_NOTICE.path },
  { label: PRIVACY_POLICY.title, href: PRIVACY_POLICY.path },
]
