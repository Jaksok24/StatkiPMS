import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "../api/usersApi";
import { roleLabel } from "../utils/roles";

const emptyCreateForm = {
  username: "",
  email: "",
  password: "",
  role: "worker",
};

const emptyEditForm = {
  username: "",
  email: "",
  password: "",
  role: "worker",
  is_active: true,
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
    } catch (err) {
      console.error("Błąd pobierania użytkowników:", err);
      setUsers([]);
      setError(err?.response?.data?.detail || "Nie udało się pobrać użytkowników.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createUser(createForm);
      setCreateForm(emptyCreateForm);
      setSuccess("Użytkownik został dodany.");
      await loadUsers();
    } catch (err) {
      console.error("Błąd dodawania użytkownika:", err);
      setError(err?.response?.data?.detail || "Nie udało się dodać użytkownika.");
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      is_active: user.is_active,
    });
    setError("");
    setSuccess("");
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditForm(emptyEditForm);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        username: editForm.username,
        email: editForm.email,
        role: editForm.role,
        is_active: editForm.is_active,
      };

      if (editForm.password.trim()) {
        payload.password = editForm.password;
      }

      await updateUser(editingUserId, payload);
      setEditingUserId(null);
      setEditForm(emptyEditForm);
      setSuccess("Użytkownik został zaktualizowany.");
      await loadUsers();
    } catch (err) {
      console.error("Błąd edycji użytkownika:", err);
      setError(err?.response?.data?.detail || "Nie udało się zaktualizować użytkownika.");
    }
  };

  const handleDelete = async (userId) => {
    setError("");
    setSuccess("");

    const confirmed = window.confirm("Czy na pewno chcesz usunąć tego użytkownika?");
    if (!confirmed) return;

    try {
      await deleteUser(userId);
      setSuccess("Użytkownik został usunięty.");
      await loadUsers();
    } catch (err) {
      console.error("Błąd usuwania użytkownika:", err);
      setError(err?.response?.data?.detail || "Nie udało się usunąć użytkownika.");
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="text-2xl font-bold">Użytkownicy</h1>
        <p className="mt-2 text-red-600 dark:text-red-400">
          Brak uprawnień. Tę stronę może otworzyć tylko administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-bold">Użytkownicy</h1>

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

        <form onSubmit={handleCreateSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input
            name="username"
            value={createForm.username}
            onChange={handleCreateChange}
            placeholder="Login"
            required
            className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <input
            name="email"
            type="email"
            value={createForm.email}
            onChange={handleCreateChange}
            placeholder="Email"
            className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <input
            name="password"
            type="password"
            value={createForm.password}
            onChange={handleCreateChange}
            placeholder="Hasło"
            required
            className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          <select
            name="role"
            value={createForm.role}
            onChange={handleCreateChange}
            className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="worker">Pracownik</option>
            <option value="admin">Administrator</option>
          </select>

          <div className="md:col-span-2 xl:col-span-4">
            <button
              type="submit"
              className="rounded-2xl bg-ocean-600 px-5 py-3 font-semibold text-white transition hover:bg-ocean-700"
            >
              Dodaj użytkownika
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-bold">Lista użytkowników</h2>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              {editingUserId === user.id ? (
                <form onSubmit={handleEditSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <input
                    name="username"
                    value={editForm.username}
                    onChange={handleEditChange}
                    required
                    className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />

                  <input
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="Email (opcjonalnie)"
                    className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />

                  <input
                    name="password"
                    type="password"
                    value={editForm.password}
                    onChange={handleEditChange}
                    placeholder="Nowe hasło (opcjonalnie)"
                    className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />

                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="rounded-xl border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <option value="worker">worker</option>
                    <option value="admin">admin</option>
                  </select>

                  <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-3 dark:border-slate-700">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editForm.is_active}
                      onChange={handleEditChange}
                    />
                    Aktywny
                  </label>

                  <div className="md:col-span-2 xl:col-span-5 flex gap-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-ocean-600 px-4 py-2 text-white hover:bg-ocean-700"
                    >
                      Zapisz
                    </button>

                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-xl border border-slate-300 px-4 py-2 dark:border-slate-700"
                    >
                      Anuluj
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold">{user.username}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {user.email}
                    </div>
                    <div className="mt-1 text-sm">
                      Rola: <span className="font-medium">{roleLabel(user.role)}</span> | Status:{" "}
                      <span className="font-medium">{user.is_active ? "aktywny" : "nieaktywny"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="rounded-xl border border-slate-300 px-4 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      Edytuj
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="rounded-xl border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;