const API_URL = import.meta.env.VITE_API_URL;

export async function createPanel(token, month, year) {
    const response = await fetch(`${API_URL}/dashboard/panel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
            month,
            year,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function checkPanel(token) {
    const response = await fetch(
        `${API_URL}/dashboard/panel/active`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok && response.status !== 404) {
        throw new Error(data.error);
    }

    return data;
}

export async function finishedPanel(token) {
    const response = await fetch(
        `${API_URL}/dashboard/panel/finished`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok && response.status !== 404) {
        throw new Error(data.error);
    }

    return data;
}

export async function updateStatusPanel(token) {
    const response = await fetch(
        `${API_URL}/dashboard/panel/status`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok && response.status !== 404) {
        throw new Error(data.error);
    }

    return data;
}
