import { api } from "./client";

export const getCruises = () => api.get("/cruises/");
export const createCruise = (data) => api.post("/cruises/", data);
export const deleteCruise = (id) => api.delete(`/cruises/${id}`);