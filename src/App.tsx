import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/ui/ScrollProgress'
import CursorFollower from './components/ui/CursorFollower'
import Hero from './components/sections/Hero'
import Manifesto from './components/sections/Manifesto'
import BriefSelection from './components/sections/BriefSelection'
import Persona from './components/sections/Persona'
import Archive from './components/sections/Archive'
import LabNotes from './components/sections/LabNotes'
import Contact from './components/sections/Contact'

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink cursor-none">
      <CursorFollower />
      <ScrollProgress />
      <Header />
      <main className="pb-24">
        <Hero />
        <Manifesto />
        <Persona />
        <BriefSelection />
        <Archive />
        <LabNotes />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
