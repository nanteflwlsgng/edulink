import Navbar from "./components/Navbar";
import ScrollHeroSection from "./components/ScrollHeroSection";
import CategoriesSection from "./components/CategoriesSection";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-[200vh] relative font-sans text-slate-800">
        <ScrollHeroSection />
        <CategoriesSection />
      </div>
    </>
  );
}

export default App;