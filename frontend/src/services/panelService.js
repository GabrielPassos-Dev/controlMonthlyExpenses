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
            headers: {
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
