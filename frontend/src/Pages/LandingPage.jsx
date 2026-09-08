import { useNavigate } from 'react-router-dom'
import Navbar from '../components/landing/navbar'
import Hero from '../components/landing/Hero'
import Problems from '../components/landing/Problems'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'
import '../styles/landing.css'

export default function LandingPage() {
  return (
    <div className="landing">
      <Navbar />
      <Hero />
      <Problems />
      <Features />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  )
}