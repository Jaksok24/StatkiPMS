import { api } from "./client";

export const getWebForms = (params = {}) => {
  const search = new URLSearchParams();

  if (params.unread_only) {
    search.append("unread_only", "true");
  }

  const query = search.toString();
  return api.get(`/web-forms/${query ? `?${query}` : ""}`);
};

export const getWebFormsUnreadCount = () => api.get("/web-forms/unread-count");

export const markWebFormAsRead = (id) => api.put(`/web-forms/${id}/mark-read`);

export const markWebFormAsUnread = (id) => api.put(`/web-forms/${id}/mark-unread`);