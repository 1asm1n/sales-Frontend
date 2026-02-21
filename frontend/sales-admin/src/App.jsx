import { useEffect, useState } from "react";
import {
    listEvents,
    createEvent,
    listSales,
    createSale,
    updateSale,
} from "./services/api";

export default function App() {
    const [events, setEvents] = useState([]);
    const [sales, setSales] = useState([]);

    const [msg, setMsg] = useState("");

    const [eventForm, setEventForm] = useState({
        type: "",
        description: "",
        eventDateTime: "",
        salesStart: "",
        salesEnd: "",
        ticketPrice: 0,
    });

    const [saleForm, setSaleForm] = useState({
        eventId: 0,
        userId: "",
        quantity: 1,
        status: "EM_ABERTO",
    });

    async function refreshAll() {
        const [ev, sa] = await Promise.all([listEvents(), listSales()]);
        setEvents(ev || []);
        setSales(sa || []);
    }

    useEffect(() => {
        refreshAll().catch((e) => {
            console.error(e);
            setMsg("Erro ao carregar dados: " + e.message);
        });
    }, []);

    async function handleCreateEvent(e) {
        e.preventDefault();
        setMsg("");

        const payload = {
            type: eventForm.type.trim(),
            description: eventForm.description.trim(),
            eventDateTime: eventForm.eventDateTime.trim(),
            salesStart: eventForm.salesStart.trim(),
            salesEnd: eventForm.salesEnd.trim(),
            ticketPrice: Number(eventForm.ticketPrice),
        };

        console.log("POST /events payload:", payload);

        try {
            await createEvent(payload);

            setEventForm({
                type: "",
                description: "",
                eventDateTime: "",
                salesStart: "",
                salesEnd: "",
                ticketPrice: 0,
            });

            await refreshAll();
            setMsg("✅ Evento cadastrado!");
        } catch (e2) {
            console.error(e2);
            setMsg("❌ Falhou ao cadastrar evento: " + e2.message);
        }
    }

    async function handleCreateSale(e) {
        e.preventDefault();
        setMsg("");

        if (!saleForm.eventId) {
            setMsg("❌ Selecione um evento.");
            return;
        }

        const payload = {
            event: { id: Number(saleForm.eventId) },
            quantity: Number(saleForm.quantity),
            status: saleForm.status,
            userId: saleForm.userId ? Number(saleForm.userId) : undefined,
        };

        console.log("POST /sales payload:", payload);

        try {
            await createSale(payload);

            setSaleForm({
                eventId: 0,
                userId: "",
                quantity: 1,
                status: "EM_ABERTO",
            });

            await refreshAll();
            setMsg("✅ Venda cadastrada!");
        } catch (e2) {
            console.error(e2);
            setMsg("❌ Falhou ao cadastrar venda: " + e2.message);
        }
    }

    async function handleChangeStatus(sale, newStatus) {
        setMsg("");

        try {
            const updated = { ...sale, status: newStatus };
            console.log("PUT /sales/" + sale.id, updated);

            await updateSale(sale.id, updated);
            await refreshAll();
            setMsg("✅ Status atualizado!");
        } catch (e2) {
            console.error(e2);
            setMsg("❌ Falhou ao atualizar status: " + e2.message);
        }
    }

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", fontFamily: "Arial" }}>
            <h1>Admin - Sistema de Ingressos</h1>

            <div style={{ padding: 10, marginBottom: 10 }}>
                {msg && <b>{msg}</b>}
            </div>

            <button onClick={() => refreshAll().catch((e) => setMsg(e.message))}>
                Recarregar listas
            </button>

            <hr />

            <h2>1) Cadastro de Eventos (CREATE)</h2>

            <form onSubmit={handleCreateEvent} style={{ display: "grid", gap: 8 }}>
                <input
                    placeholder="Tipo (Show, Palestra...)"
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                />

                <input
                    placeholder="Descrição"
                    value={eventForm.description}
                    onChange={(e) =>
                        setEventForm({ ...eventForm, description: e.target.value })
                    }
                />

                <input
                    placeholder="Data/hora (YYYY-MM-DDTHH:MM:SS)"
                    value={eventForm.eventDateTime}
                    onChange={(e) =>
                        setEventForm({ ...eventForm, eventDateTime: e.target.value })
                    }
                />

                <input
                    placeholder="Início vendas (YYYY-MM-DDTHH:MM:SS)"
                    value={eventForm.salesStart}
                    onChange={(e) =>
                        setEventForm({ ...eventForm, salesStart: e.target.value })
                    }
                />

                <input
                    placeholder="Fim vendas (YYYY-MM-DDTHH:MM:SS)"
                    value={eventForm.salesEnd}
                    onChange={(e) =>
                        setEventForm({ ...eventForm, salesEnd: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Preço"
                    value={eventForm.ticketPrice}
                    onChange={(e) =>
                        setEventForm({ ...eventForm, ticketPrice: Number(e.target.value) })
                    }
                />

                <button type="submit">Cadastrar Evento</button>
            </form>

            <hr />

            <h2>2) Lista de Vendas</h2>

            {sales.length === 0 ? (
                <div>Nenhuma venda cadastrada.</div>
            ) : (
                sales.map((s) => (
                    <div
                        key={s.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: 10,
                            marginBottom: 10,
                            borderRadius: 8,
                        }}
                    >
                        <div>
                            <b>ID:</b> {s.id}
                        </div>
                        <div>
                            <b>Status:</b> {s.status}
                        </div>
                        <div>
                            <b>Quantidade:</b> {s.quantity}
                        </div>
                        <div>
                            <b>Evento ID:</b> {s.event?.id}
                        </div>

                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                            <button onClick={() => handleChangeStatus(s, "EM_ABERTO")}>
                                Em Aberto
                            </button>
                            <button onClick={() => handleChangeStatus(s, "PAGO")}>
                                Pago
                            </button>
                            <button onClick={() => handleChangeStatus(s, "CANCELADO")}>
                                Cancelado
                            </button>
                        </div>
                    </div>
                ))
            )}

            <hr />

            <h2>3) Cadastro de Venda</h2>

            <form onSubmit={handleCreateSale} style={{ display: "grid", gap: 8 }}>
                <select
                    value={saleForm.eventId || ""}
                    onChange={(e) =>
                        setSaleForm({ ...saleForm, eventId: Number(e.target.value) })
                    }
                >
                    <option value="">Selecione um evento</option>
                    {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                            {ev.id} - {ev.description}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="User ID (se existir no modelo)"
                    value={saleForm.userId}
                    onChange={(e) => setSaleForm({ ...saleForm, userId: e.target.value })}
                />

                <input
                    type="number"
                    min="1"
                    value={saleForm.quantity}
                    onChange={(e) =>
                        setSaleForm({ ...saleForm, quantity: Number(e.target.value) })
                    }
                />

                <button type="submit">Cadastrar Venda</button>
            </form>

            <hr />

            <h2>Eventos carregados</h2>
            {events.length === 0 ? (
                <div>Nenhum evento cadastrado.</div>
            ) : (
                <ul>
                    {events.map((ev) => (
                        <li key={ev.id}>
                            {ev.id} - {ev.type} - {ev.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}