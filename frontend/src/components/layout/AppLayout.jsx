import Navbar from "./Navbar";
import Footer from "./Footer";

const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-slate-100 text-slate-800 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;