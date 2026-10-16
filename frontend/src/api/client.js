const API_BASE_URL = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("staff_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("staff_token");
    localStorage.removeItem("staff_user");
    window.dispatchEvent(new Event("staff:unauthorized"));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.data = data;
    throw err;
  }
  return data;
};

export const authApi = {
  login: async (staffId, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId, password })
    });
    return handleResponse(res);
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  changePassword: async (currentPassword, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse(res);
  },
  getDirectory: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/directory`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export const appointmentApi = {
  getAppointments: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/appointments${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateStatus: async (id, status, notes = "", reason = "") => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes, reason })
    });
    return handleResponse(res);
  },
  reschedule: async (id, newDate, newTime, reason = "") => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/reschedule`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ newDate, newTime, reason })
    });
    return handleResponse(res);
  },
  cancel: async (id, reason) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  },
  updateNotes: async (id, notes) => {
    const res = await fetch(`${API_BASE_URL}/appointments/${id}/notes`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes })
    });
    return handleResponse(res);
  }
};

export const patientApi = {
  getPatients: async (search = "") => {
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${API_BASE_URL}/patients${q}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  checkDuplicates: async (phone = "", email = "", name = "") => {
    const q = new URLSearchParams({ phone, email, name }).toString();
    const res = await fetch(`${API_BASE_URL}/patients/check-duplicates?${q}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/patients/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateDemographics: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/patients/${id}/demographics`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};

export const queueApi = {
  getLiveQueue: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/queue${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  checkIn: async (data) => {
    const res = await fetch(`${API_BASE_URL}/queue/check-in`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  updateStatus: async (id, status, notes = "") => {
    const res = await fetch(`${API_BASE_URL}/queue/${id}/status`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    return handleResponse(res);
  },
  notifyDoctor: async (id) => {
    const res = await fetch(`${API_BASE_URL}/queue/${id}/notify-doctor`, {
      method: "POST",
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export const doctorApi = {
  getDoctors: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/doctors${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  getSlots: async (doctorId, date = "") => {
    const q = date ? `?date=${encodeURIComponent(date)}` : "";
    const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}/slots${q}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export const communicationApi = {
  getCallList: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/communication/list${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  logCall: async (data) => {
    const res = await fetch(`${API_BASE_URL}/communication/log`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  getCallHistory: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/communication/history${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  sendReminder: async (data) => {
    const res = await fetch(`${API_BASE_URL}/communication/send-reminder`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};

export const notificationApi = {
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  markRead: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  markAllRead: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};

export const reportApi = {
  getMetrics: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/reports/metrics${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },
  exportCSVUrl: `${API_BASE_URL}/reports/export/csv`
};

export const auditApi = {
  getAuditLogs: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/audit${q ? `?${q}` : ""}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
