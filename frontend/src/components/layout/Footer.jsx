const Footer = () => {
  return (
    <footer className="mt-10 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          © {new Date().getFullYear()} Jakub Sokołowski
        </span>{" "}
        — System zarządzania rejsami
      </div>
    </footer>
  );
};

export default Footer;