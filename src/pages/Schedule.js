import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SelectedSlotsModal from "./SelectedSlotsModal";
import "./schedule.css";

export default function Schedule() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("schedule/")
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const deleteSlot = async (slotId) => {
    try {
      await api.delete(`slot/delete/${slotId}/`);
      setData((prev) => prev.filter((item) => item.slot !== slotId));
    } catch {
      alert("Unable to delete slot");
    }
  };

  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.slot_detail.class_date);
    const key = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="schedule-wrapper">
      <div className="schedule-header">
        <h2>Scheduled Classes</h2>

        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add New Slot
        </button>
      </div>

      {Object.keys(grouped).length === 0 && (
        <p>No scheduled classes</p>
      )}

      {Object.entries(grouped).map(([month, slots]) => (
        <div key={month} className="month-block">
          <h3>{month}</h3>

          <div className="slot-grid">
            {slots.map((item) => (
              <div key={item.id} className="slot-card">
                <div className="slot-box">
                  <strong>Day {item.slot_detail.day_number}</strong>
                  <span>{item.slot_detail.topic_name}</span>
                  <div className="date">
                    {new Date(
                      item.slot_detail.class_date
                    ).getDate()}
                  </div>
                </div>

                <button className="delete-btn" onClick={() => deleteSlot(item.slot)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <SelectedSlotsModal
          onClose={() => setShowModal(false)}   
          onConfirm={() => {
            setShowModal(false);               
            navigate("/select-slots");
          }}/>
      )}
    </div>
  );
}
