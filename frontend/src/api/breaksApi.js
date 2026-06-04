import { api } from "./client";

export const getBreaks = () => api.get("/breaks/");
export const createBreak = (data) => api.post("/breaks/", data);
export const deleteBreak = (id) => api.delete(`/breaks/${id}`);