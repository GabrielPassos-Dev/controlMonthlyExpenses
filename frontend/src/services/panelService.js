export async function createPanel(token, month, year) {
    const response = await fetch("http://localhost:3000/dashboard/panel", {
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
        "http://localhost:3000/dashboard/panel/active",
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
        "http://localhost:3000/dashboard/panel/finished",
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
        "http://localhost:3000/dashboard/panel/status",
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
