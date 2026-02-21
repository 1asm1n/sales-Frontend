const BASE = "http://localhost:8080";

async function handleResponse(r) {
    const text = await r.text();

    if (r.ok) {
        // pode vir JSON ou vazio
        return text ? JSON.parse(text) : null;
    }

    // erro: tenta mostrar algo útil
    throw new Error(`HTTP ${r.status} - ${text || r.statusText}`);
}

export async function listEvents() {
    const r = await fetch(`${BASE}/events`);
    return handleResponse(r);
}

export async function createEvent(event) {
    const r = await fetch(`${BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
    });
    return handleResponse(r);
}

export async function listSales() {
    const r = await fetch(`${BASE}/sales`);
    return handleResponse(r);
}

export async function createSale(sale) {
    const r = await fetch(`${BASE}/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sale),
    });
    return handleResponse(r);
}

export async function updateSale(id, sale) {
    const r = await fetch(`${BASE}/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sale),
    });
    return handleResponse(r);
}