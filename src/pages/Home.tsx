import Hero from '../components/sections/Hero'
import Manifesto from '../components/sections/Manifesto'
import BriefSelection from '../components/sections/BriefSelection'
import Persona from '../components/sections/Persona'
import LabNotes from '../components/sections/LabNotes'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Persona />
      <BriefSelection />
      <LabNotes />
      <Contact />
    </>
  )
}
