import { useEffect, useState } from "react";
import api from "../api/axios";
import "./selectedSlots.css";

export default function SelectedSlotsModal({ onClose, onConfirm }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("slot/selected/")
      .then((res) => {
        setSlots(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to load selected slots");
      });
  }, []);

  const deleteSlot = async (slotId) => {
    try {
      await api.delete(`slot/delete/${slotId}/`);
      setSlots((prev) => prev.filter((s) => s.slot !== slotId));
    } catch {
      alert("Unable to delete slot");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Selected Slots</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="slots-row">
          {slots.length === 0 && <p>No slots selected</p>}

          {slots.map((item) => (
            <div key={item.id} className="slot-card">
              <div className="slot-purple">
                <div className="slot-date">
                  {new Date(item.slot_detail.class_date).getDate()}
                </div>
                <div className="slot-info">
                  <strong>Day {item.slot_detail.day_number}</strong>
                  <span>{item.slot_detail.topic_name}</span>
                </div>
              </div>

              <button className="delete-btn" onClick={() => deleteSlot(item.slot)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}> Cancel </button>
          <button className="ok-btn" onClick={onConfirm}> OK </button>
        </div>
      </div>
    </div>
  );
}
