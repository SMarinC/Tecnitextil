import Header from '../components/Header/Header.jsx'
import Hero from '../components/Hero/Hero.jsx'
import Toldos from '../components/Toldos/Toldos.jsx'
import Services from '../components/Services/Services.jsx'
import MachineTypes from '../components/MachineTypes/MachineTypes.jsx'
import Marcas from '../components/Marcas/Marcas.jsx'
import ValueProps from '../components/ValueProps/ValueProps.jsx'
import HowItWorks from '../components/HowItWorks/HowItWorks.jsx'
import FinalCta from '../components/FinalCta/FinalCta.jsx'
import Footer from '../components/Footer/Footer.jsx'
import WhatsAppCta from '../components/WhatsAppCta/WhatsAppCta.jsx'
import { WHATSAPP_CTA } from '../content/home.js'

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Toldos />
        <Services />
        <MachineTypes />
        <Marcas />
        <ValueProps />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppCta variant="floating" label={WHATSAPP_CTA.floatingLabel} />
    </>
  )
}

export default HomePage
