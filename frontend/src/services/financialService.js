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

export async function deleteExpense(token, id) {
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

export async function updateExpense(token, id, expenseData) {
    const response = await fetch(`http://localhost:3000/financial/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function createExpense(token, name, amount, type) {
    const response = await fetch("http://localhost:3000/financial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name,
            amount,
            type
        }),
    });

    const newExpense = await response.json();

    if (!response.ok) {
        throw new Error(newExpense.error);
    }

    return newExpense;
}

export async function updateExpensePaid(id, paid, token) {
    const response = await fetch(
        `http://localhost:3000/expenses/${id}/paid`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ paid })
        }
    );

    const data = response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}

export async function updateSpentAmount(id, spentAmount, token) {
    const response = await fetch(
        `http://localhost:3000/expenses/${id}/spentamount`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ spentAmount })
        }
    );

    const data = response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}
