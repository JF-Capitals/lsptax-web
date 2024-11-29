import "./App.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import FeatureStrip from "./components/FeatureStrip";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import KeyDates from "./components/KeyDates";
import FeatureArray from "./components/FeatureArray";
import WorkProcess from "./components/WorkProcess";

function App() {

  return <>
    <Header />
    <Hero />
    <FeatureArray/>
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
