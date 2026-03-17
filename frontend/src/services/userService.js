const API_URL = import.meta.env.VITE_API_URL;

export async function salaryEdit(token, salary) {
    const response = await fetch(`${API_URL}/user/salary`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ salary: Number(salary) }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error);
    }

    return data;
}