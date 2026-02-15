import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import selectIcon from "../../../assets/select.svg";
import unselectIcon from "../../../assets/unselect.svg";

const ClientPanel = ({ filters, setFilters }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/dashboard/clients", {
          withCredentials: true,
        });
        setClients(res.data.clients || []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const selectedClients = filters.clients ?? [];

  const toggle = (client) => {
    const exists = selectedClients.includes(client);

    const next = exists
      ? selectedClients.filter((c) => c !== client)
      : [...selectedClients, client];

    setFilters((prev) => {
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy.client;
        return copy;
      }

      return {
        ...prev,
        clients: next,
      };
    });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Clients</h3>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {clients.map((client) => {
        const selected = selectedClients.includes(client);

        return (
          <div
            key={client}
            onClick={() => toggle(client)}
            className="flex items-center gap-2 cursor-pointer py-4 px-2 border-b border-[#C6C8CA]"
          >
            <img
              src={selected ? selectIcon : unselectIcon}
              alt={selected ? "selected" : "unselected"}
              className="w-4 h-4"
            />

            <span className="text-sm">{client}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ClientPanel;
