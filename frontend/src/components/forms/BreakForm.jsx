import { useEffect, useState } from "react";
import { getShips } from "../../api/shipsApi";
import { createBreak } from "../../api/breaksApi";

const emptyForm = {
  date: "",
  start_time: "",
  end_time: "",
  ship: "",
  note: "",
};

const BreakForm = ({ onCreated }) => {
  const [ships, setShips] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadShips();
  }, []);

  const loadShips = async () => {
    try {
      const res = await getShips();
      const data = Array.isArray(res.data) ? res.data : [];
      setShips(data);
    } catch (err) {
      console.error("Błąd pobierania statków:", err);
      setShips([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.date || !form.start_time || !form.end_time || !form.ship) {
      setError("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    try {
      await createBreak(form);

      setForm(emptyForm);
      setSuccess("Przerwa została dodana.");

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error("Błąd dodawania przerwy:", err);

      const backendMessage =
        err?.response?.data?.detail ||
        err?.message ||
        "Nie udało się dodać przerwy.";

      setError(String(backendMessage));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900"
    >
      <h2 className="mb-4 text-xl font-bold">Dodaj przerwę</h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Statek</label>
          <select
            name="ship"
            value={form.ship}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Wybierz statek</option>
            {ships.map((ship) => (
              <option key={ship} value={ship}>
                {ship}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Od</label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Do</label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium">Uwagi</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Np. przerwa techniczna, serwis, odpoczynek"
          className="min-h-[100px] w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <button
        type="submit"
        className="mt-4 rounded-2xl bg-ocean-600 px-5 py-3 font-semibold text-white transition hover:bg-ocean-700"
      >
        Dodaj przerwę
      </button>
    </form>
  );
};

export default BreakForm;