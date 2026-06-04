import { useEffect, useState } from "react";
import ReservationForm from "../components/forms/ReservationForm";
import { deleteReservation, getReservations } from "../api/reservationsApi";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [editingReservation, setEditingReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getReservations();
      const data = Array.isArray(res.data) ? res.data : [];
      setReservations(data);
    } catch (err) {
      console.error("Błąd pobierania rezerwacji:", err);
      setReservations([]);
      setError("Nie udało się pobrać rezerwacji.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleDelete = async (id) => {
    setError("");
    setSuccess("");

    const confirmed = window.confirm(
      "Czy na pewno chcesz usunąć tę rezerwację?"
    );

    if (!confirmed) return;

    try {
      await deleteReservation(id);

      if (editingReservation?.id === id) {
        setEditingReservation(null);
      }

      setSuccess("Rezerwacja została usunięta.");
      await loadReservations();
    } catch (err) {
      console.error("Błąd usuwania rezerwacji:", err);
      setError(
        err?.response?.data?.detail || "Nie udało się usunąć rezerwacji."
      );
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCreated = async () => {
    setSuccess("Rezerwacja została dodana.");
    setEditingReservation(null);
    await loadReservations();
  };

  const handleUpdated = async () => {
    setSuccess("Rezerwacja została zaktualizowana.");
    setEditingReservation(null);
    await loadReservations();
  };

  const handleCancelEdit = () => {
    setEditingReservation(null);
    setError("");
  };

  const formatDate = (value) => {
    if (!value) return "-";

    try {
      return new Date(value).toLocaleDateString("pl-PL");
    } catch {
      return value;
    }
  };

  const formatTime = (value) => {
    if (!value) return "-";
    return String(value).slice(0, 5);
  };

  return (
    <div className="space-y-6">
      <ReservationForm
        onCreated={handleCreated}
        editingReservation={editingReservation}
        onUpdated={handleUpdated}
        onCancelEdit={handleCancelEdit}
      />

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Lista rezerwacji</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tutaj możesz przeglądać, edytować i usuwać zapisane rezerwacje.
            </p>
          </div>

          {loading && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Ładowanie...
            </span>
          )}
        </div>

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

        {!loading && reservations.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            Brak rezerwacji.
          </p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`rounded-2xl border p-4 transition ${
                  editingReservation?.id === reservation.id
                    ? "border-ocean-400 bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-950/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">
                      {reservation.customer || "Brak klienta"}
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(reservation.date)} | {formatTime(reservation.hour)} |{" "}
                      {reservation.ship || "-"}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Rejs:{" "}
                      <span className="font-medium">
                        {reservation.cruise_name || reservation.cruise?.name || "-"}
                      </span>
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Telefon: {reservation.phone || "-"}
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Liczba osób: {reservation.people ?? "-"} | Opłata:{" "}
                      {reservation.fee ?? "-"} zł
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Catering: {reservation.catering ? "Tak" : "Nie"}
                    </div>

                    {reservation.note && (
                      <div className="pt-1 text-sm italic text-slate-600 dark:text-slate-300">
                        Uwagi: {reservation.note}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(reservation)}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Edytuj
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(reservation.id)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsPage;