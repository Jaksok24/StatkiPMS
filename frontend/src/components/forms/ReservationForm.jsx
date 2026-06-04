import { useEffect, useState } from "react";
import { getCruises } from "../../api/cruisesApi";
import {
  createReservation,
  updateReservation,
} from "../../api/reservationsApi";
import { getShips } from "../../api/shipsApi";

const emptyForm = {
  cruise_id: "",
  customer: "",
  phone: "",
  date: "",
  hour: "",
  ship: "",
  people: "",
  fee: "",
  catering: false,
  note: "",
};

const ReservationForm = ({
  onCreated,
  editingReservation = null,
  onUpdated,
  onCancelEdit,
}) => {
  const [cruises, setCruises] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loadingCruises, setLoadingCruises] = useState(false);
  const [error, setError] = useState("");
  const [ships, setShips] = useState([]);

  useEffect(() => {
    loadCruises();
    loadShips();
  }, []);

  useEffect(() => {
    if (editingReservation) {
      setForm({
        cruise_id: editingReservation.cruise_id?.toString() || "",
        customer: editingReservation.customer || "",
        phone: editingReservation.phone || "",
        date: editingReservation.date || "",
        hour: editingReservation.hour?.slice(0, 5) || "",
        ship: editingReservation.ship || "",
        people: editingReservation.people?.toString() || "",
        fee: editingReservation.fee?.toString() || "",
        catering: !!editingReservation.catering,
        note: editingReservation.note || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingReservation]);

  const loadCruises = async () => {
    setLoadingCruises(true);
    setError("");

    try {
      const res = await getCruises();
      const data = Array.isArray(res.data) ? res.data : [];
      setCruises(data);
    } catch (err) {
      console.error("Błąd pobierania rejsów:", err);
      setCruises([]);
      setError("Nie udało się pobrać listy rejsów.");
    } finally {
      setLoadingCruises(false);
    }
  };

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
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      cruise_id: Number(form.cruise_id),
      people: Number(form.people),
      fee: Number(form.fee),
    };

    try {
      if (editingReservation) {
        await updateReservation(editingReservation.id, payload);

        if (onUpdated) {
          onUpdated();
        }
      } else {
        await createReservation(payload);

        if (onCreated) {
          onCreated();
        }
      }

      setForm(emptyForm);
    } catch (err) {
      console.error("Błąd zapisu rezerwacji:", err);
      setError(err?.response?.data?.detail || "Nie udało się zapisać rezerwacji.");
    }
  };

  return (
    <form
      className="space-y-4 rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold">
          {editingReservation ? "Edycja rezerwacji" : "Nowa rezerwacja"}
        </h3>

        {editingReservation && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
          >
            Anuluj edycję
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">Rejs</label>
        <select
          name="cruise_id"
          value={form.cruise_id}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          required
          disabled={loadingCruises}
        >
          <option value="">
            {loadingCruises ? "Ładowanie rejsów..." : "Wybierz rejs"}
          </option>

          {Array.isArray(cruises) &&
            cruises.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.duration} min)
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Klient</label>
        <input
          name="customer"
          placeholder="Imię i nazwisko"
          value={form.customer}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Telefon</label>
        <input
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Godzina</label>
          <input
            type="time"
            name="hour"
            value={form.hour}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Statek</label>
        <select
          name="ship"
          value={form.ship}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          required
        >
          <option value="">Wybierz statek</option>

          {ships.map((ship) => (
            <option key={ship} value={ship}>
              {ship}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Liczba osób</label>
          <input
            type="number"
            name="people"
            min="1"
            max="60"
            value={form.people}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Np. 12"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Opłata</label>
          <input
            type="number"
            name="fee"
            placeholder="Np. 500"
            value={form.fee}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
        <input
          type="checkbox"
          name="catering"
          checked={form.catering}
          onChange={handleChange}
        />
        <span>Catering</span>
      </label>

      <div>
        <label className="mb-2 block text-sm font-medium">Uwagi</label>
        <textarea
          name="note"
          placeholder="Dodatkowe informacje"
          value={form.note}
          onChange={handleChange}
          className="min-h-[110px] w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-ocean-600 p-3 font-semibold text-white transition hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={loadingCruises || cruises.length === 0}
      >
        {editingReservation ? "Zapisz zmiany" : "Dodaj rezerwację"}
      </button>
    </form>
  );
};

export default ReservationForm;