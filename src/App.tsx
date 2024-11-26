import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureArray from "./components/FeatureArray";
import About from "./components/About";
import WorkProcess from "./components/WorkProcess";
import Services from "./components/Services";
import FeatureStrip from "./components/FeatureStrip";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import KeyDates from "./components/KeyDates";

function App() {

  return <>
    <Header />
    <Hero />
    <FeatureArray />
    <About />
    <WorkProcess />
    <Services />
    <FeatureStrip />
    <WhyUs />
    <KeyDates/>
    <Testimonials />
    <Footer/>
  </>;
}

export default App;
