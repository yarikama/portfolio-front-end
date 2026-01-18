import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ui/ScrollProgress'
import Hero from './components/sections/Hero'
import BriefSelection from './components/sections/BriefSelection'
import Persona from './components/sections/Persona'
import Archive from './components/sections/Archive'
import LabNotes from './components/sections/LabNotes'
import Manifest from './components/sections/Manifest'
import Contact from './components/sections/Contact'

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <ScrollProgress />
      <Header />
      <main className="pb-24">
        <Hero />
        <Persona />
        <BriefSelection />
        <Archive />
        <LabNotes />
        <Manifest />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
