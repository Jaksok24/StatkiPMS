import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="flex-1 px-4 py-6 md:px-6">
        <Routes>
          {/* Twoje routy */}
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;