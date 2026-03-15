"use client";

import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [userIds, setUserIds] = useState<any[]>([]);
  const [newId, setNewId] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    fetchLogs();
    fetchUserIds();
  }, []);

  const fetchLogs = async () => {
    const res = await fetch("/api/upload");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  };

  const fetchUserIds = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUserIds(data);
  };

  const handleCreateId = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ userId: newId }),
      headers: { "Content-Type": "application/json" }
    });
    if (res.ok) {
      setNewId("");
      fetchUserIds();
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!confirm("Delete this log?")) return;
    await fetch(`/api/upload?id=${id}`, { method: "DELETE" });
    setEvents(events.filter(e => e._id !== id));
  };

  const handleDeleteUserId = async (id: string) => {
    if (!confirm("Revoke access for this ID?")) return;
    await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    setUserIds(userIds.filter(u => u._id !== id));
  };

  return (
    <div className="adm-container">
      <div className="adm-max-width-wrapper">
        
        {/* TOP SECTION: ID MANAGEMENT */}
        <div className="adm-management-grid">
          {/* Create ID Form */}
          <section className="adm-panel adm-panel-accent">
            <span className="adm-label-small adm-text-neon">Command // Generate_Access_Token</span>
            <form onSubmit={handleCreateId} className="adm-input-group">
              <input 
                type="text"
                placeholder="Enter Target ID"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="adm-cyber-input"
              />
              <button className="adm-btn adm-btn-primary">ACTIVATE_NEW_NODE</button>
            </form>
          </section>

          {/* List of active IDs */}
          <section className="adm-panel">
            <span className="adm-label-small">Authorized_Nodes // Active</span>
            <div className="adm-custom-scrollbar" style={{ maxHeight: "140px", overflowY: "auto" }}>
              {userIds.map((u) => (
                <div key={u._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", borderBottom: "1px solid #1a1c30" }}>
                  <span style={{ fontSize: "12px", color: "#00ffcc" }}>{u.userId}</span>
                  <span 
                    onClick={() => handleDeleteUserId(u._id)}
                    className="adm-text-danger"
                    style={{ cursor: "pointer", fontSize: "10px", fontWeight: "bold" }}
                  >
                    [ REVOKE ]
                  </span>
                </div>
              ))}
              {userIds.length === 0 && <p style={{ fontSize: "10px", color: "#444" }}>No active nodes found.</p>}
            </div>
          </section>
        </div>

        {/* LOGS TABLE */}
        <div className="adm-table-container adm-panel">
          <span className="adm-label-small">Security_Event_Logs</span>
          <table className="adm-cyber-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Amount</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt._id}>
                  <td>{new Date(evt.date).toLocaleString()}</td>
                  <td className="adm-text-neon" style={{ fontWeight: "bold" }}>{evt.amount}</td>
                  <td style={{ textAlign: "right" }}>
                    <button 
                      onClick={() => setSelectedEvent(evt)} 
                      className="adm-btn adm-btn-primary" 
                      style={{ padding: "0.4rem 0.8rem", marginRight: "0.5rem" }}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleDeleteLog(evt._id)} 
                      className="adm-btn adm-btn-danger" 
                      style={{ padding: "0.4rem 0.8rem" }}
                    >
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* IMAGE MODAL */}
        {selectedEvent && (
          <div className="adm-modal-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="adm-modal-content adm-panel adm-panel-accent" onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #1a1c30" }}>
                <span className="adm-label-small adm-text-neon" style={{ margin: 0 }}>Payload_Inspection</span>
                <span className="adm-text-danger" style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => setSelectedEvent(null)}>
                  [ CLOSE ]
                </span>
              </div>
              <div className="adm-image-grid adm-custom-scrollbar">
                {selectedEvent.images.map((img: string, i: number) => (
                  <img key={i} src={img} alt="evidence" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}