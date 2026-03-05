export async function salaryEdit(token, salary) {
    const response = await fetch("http://localhost:3000/user/salary", {
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