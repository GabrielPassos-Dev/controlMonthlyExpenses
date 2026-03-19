const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Credenciais inválidas ou erro no servidor");
    }

    return data;
}

export async function registerUser(name, email, password, salary) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            email,
            password,
            salary,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Erro no servidor, tente novamente mais tarde");
    }

    return data;
}