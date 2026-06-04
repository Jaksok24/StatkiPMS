import { api } from "./client";

export const getShips = () => api.get("/ships/");