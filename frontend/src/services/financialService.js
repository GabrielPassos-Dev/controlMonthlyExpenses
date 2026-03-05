export async function fetchExpenses(token) {
    const response = await fetch("http://localhost:3000/financial", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function deletedExpense(token, id) {
    const response = await fetch(`http://localhost:3000/financial/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function createExpenses(token, name, amount) {
    const response = await fetch("http://localhost:3000/financial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            amount,
        }),
    });

    const newExpense = await response.json();

    if (!response.ok) {
        throw new Error(newExpense.error);
    }

    return newExpense;
}