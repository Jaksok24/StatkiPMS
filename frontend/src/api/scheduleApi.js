import { api } from "./client";

export const getSchedule = (date) => api.get(`/schedule/?date=${date}`);