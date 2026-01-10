import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollHeroSection from "./components/ScrollHeroSection";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[200vh] relative font-sans text-slate-800">
        <ScrollHeroSection />
        <Footer/>
      </div>
    </>
  );
}

export default App;