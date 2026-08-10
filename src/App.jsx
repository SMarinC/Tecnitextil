import Header from './components/Header/Header.jsx'
import Hero from './components/Hero/Hero.jsx'
import Services from './components/Services/Services.jsx'
import ValueProps from './components/ValueProps/ValueProps.jsx'
import HowItWorks from './components/HowItWorks/HowItWorks.jsx'
import FinalCta from './components/FinalCta/FinalCta.jsx'
import Footer from './components/Footer/Footer.jsx'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton/WhatsAppFloatingButton.jsx'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <ValueProps />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  )
}

export default App
