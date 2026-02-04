import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./page1.css";

export default function Page1SelectSlots() {
  const navigate = useNavigate();
  const [cells, setCells] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  useEffect(() => {
    setLoading(true);

    api.get(`calendar/${year}/${month}/`)
      .then((res) => {
        setCells(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate("/login");
        }
      });
  }, [year, month, navigate]);

  const changeMonth = (direction) => {
    setMonth((prev) => {
      if (prev + direction === 0) {
        setYear((y) => y - 1);
        return 12;
      }
      if (prev + direction === 13) {
        setYear((y) => y + 1);
        return 1;
      }
      return prev + direction;
    });
  };

  const selectSlot = async (slotId) => {
    if (!slotId) return;

    try {
      await api.post("slot/add/", { slot_id: slotId });
      setCells((prev) =>
        prev.map((c) =>
          c.slot_id === slotId ? { ...c, is_selected: true } : c
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || "Unable to select slot");
    }
  };

  if (loading) return <p>Loading calendar...</p>;

  return (
    <div className="page1-container">
      <div className="calendar-section">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>‹</button>

          <h2>
            {new Date(year, month - 1).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <button onClick={() => changeMonth(1)}>›</button>
        </div>

        <div className="weekday-row">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="weekday">{d}</div>
          ))}
        </div>

        <div className="calendar-grid">
          {cells.map((cell, index) => {
            const clickable =
              cell.is_selectable &&
              !cell.is_selected &&
              cell.slot_id !== null;

            return (
              <div
                key={index}
                className={`calendar-cell
                  ${!cell.is_current_month ? "outside" : ""}
                  ${cell.is_sunday ? "disabled" : ""}
                  ${cell.is_selected ? "selected" : ""}
                  ${clickable ? "selectable" : ""}`}
                onClick={() => clickable && selectSlot(cell.slot_id)}>
                <span className="date">{cell.day}</span>
                {cell.day_number && (
                  <div className="slot-info">
                    <strong>Day {cell.day_number}</strong>
                    <small>{cell.topic}</small>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="side-panel">
        <h3>Monthly Schedule</h3>

        <ul>
          {cells
            .filter((c) => c.day_number && c.is_current_month)
            .sort((a, b) => a.day_number - b.day_number)
            .map((c) => (
              <li key={c.slot_id}>Day {c.day_number} : {c.topic}</li>
            ))}
        </ul>

        <button className="submit-btn" onClick={() => navigate("/schedule")}>Submit</button>
      </div>
    </div>
  );
}
