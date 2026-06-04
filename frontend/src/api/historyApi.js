import { api } from "./client";

export const getHistory = (params = {}) => {
  const search = new URLSearchParams();

  if (params.date_from) search.append("date_from", params.date_from);
  if (params.date_to) search.append("date_to", params.date_to);
  if (params.ship) search.append("ship", params.ship);
  if (params.type) search.append("type", params.type);

  const query = search.toString();
  return api.get(`/history/${query ? `?${query}` : ""}`);
};