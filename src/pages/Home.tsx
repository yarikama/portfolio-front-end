import Hero from '../components/sections/Hero'
import Manifesto from '../components/sections/Manifesto'
import BriefSelection from '../components/sections/BriefSelection'
import Experience from '../components/sections/Experience'
import Toolkit from '../components/sections/Toolkit'
import LabNotes from '../components/sections/LabNotes'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Experience />
      <Toolkit />
      <BriefSelection />
      <LabNotes />
      <Contact />
    </>
  )
}
