import ButtonGradient from "./assets/svg/ButtonGradient";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import About from "./components/About";
import Nitrogen from "./components/Nitrogen";
import TeamSection from "./components/TeamSection";
import Animated from "./components/Animated";
import Media from "./components/Media";
import Oxygen from "./components/Oxygen";
import Follow from "./components/Follow"


// import TestSection from "./components/TestSection";

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <About />
        <Animated />
        <Nitrogen />
        
       
        <Oxygen/>
        <Media/>
        <TeamSection />
        <Follow/>

        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
