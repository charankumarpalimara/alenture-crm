const api_url = "https://alantur-api.softplix.com/v1/";

export async function getCrmNotifications({ crmId }) {
  try {
    const response = await fetch(`${api_url}get-crm-notifications/${crmId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
export async function getCrmNotificationsDetails({ id }) {
  try {
    const response = await fetch(`${api_url}get-experience-details/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
export async function markNotificationRead({ id }) {
  try {
    const response = await fetch(`${api_url}mark-notification-read/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const res = await response.json();

    return res;
  } catch (e) {
    throw new Error("something went wrong");
  }
}
