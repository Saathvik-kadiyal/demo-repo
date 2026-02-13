import React, { useEffect, useState } from "react";

const ClientPanel = ({ filters, setFilters }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/dashboard/clients");
        const data = await res.json();
        setClients(data.clients || []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const toggle = (client) => {
    const list = filters.client.includes(client)
      ? filters.client.filter((c) => c !== client)
      : [...filters.client, client];

    setFilters({ ...filters, client: list });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Clients</h3>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {clients.map((client) => {
        const selected = filters.client.includes(client);

        return (
          <div
            key={client}
            onClick={() => toggle(client)}
            className="flex items-center gap-2 cursor-pointer py-1"
          >
            {/* Custom Tick */}
            <span
              className={`text-lg font-bold ${
                selected ? "text-blue-600" : "text-gray-400"
              }`}
            >
              ✓
            </span>

            <span className="text-sm">{client}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ClientPanel;
