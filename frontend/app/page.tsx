"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Event = {
  _id?: string;
  title: string;
  date: string;
  location: string;
  description: string;
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Event[]>("http://localhost:5000/events").then((res) => setEvents(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const res = await axios.put<Event>(`http://localhost:5000/events/${editingId}`, newEvent);
      setEvents(events.map(event => (event._id === editingId ? res.data : event)));
      setEditingId(null);
    } else {
      const res = await axios.post<Event>("http://localhost:5000/events", newEvent);
      setEvents([...events, res.data]);
    }
    setNewEvent({ title: "", date: "", location: "", description: "" });
  };

  const handleEdit = (event: Event) => {
    setNewEvent(event);
    setEditingId(event._id || null);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/events/${id}`);
    setEvents(events.filter(event => event._id !== id));
  };

  const handleSwitchMode = () => {
    setEditingId(null);
    setNewEvent({ title: "", date: "", location: "", description: "" });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto flex flex-col gap-8 items-center justify-center min-h-screen">
      {/* Formulaire */}
      <div className="w-full p-8 border rounded-lg shadow-lg flex flex-col justify-center items-center">
        <div className="flex justify-between items-center w-full mb-4">
          <h1 className="text-2xl font-bold">{editingId ? "Modifier l'événement" : "Ajouter un événement"}</h1>
          <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={handleSwitchMode}>
            {editingId ? "Annuler modification" : "Réinitialiser"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2 w-full">
          <input
            className="border p-2 w-full text-black"
            placeholder="Titre"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            required
          />
          <input
            className="border p-2 w-full text-black"
            placeholder="Date"
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            required
          />
          <input
            className="border p-2 w-full text-black"
            placeholder="Lieu"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            required
          />
          <textarea
            className="border p-2 w-full text-black"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            required
          />
          <button className="bg-blue-500 text-white p-2 w-full rounded">{editingId ? "Mettre à jour" : "Ajouter"}</button>
        </form>
      </div>

      {/* Liste des événements */}
      <div className="w-full p-8 border rounded-lg shadow-lg flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Liste des événements</h1>
        <div className="w-full max-h-64 overflow-y-auto"> {/* Conteneur scrollable */}
          <ul className="space-y-2 w-full">
            {events.map((event) => (
              <li key={event._id} className="border p-4 rounded-lg shadow flex justify-between items-center w-full">
                <div>
                  <strong>{event.title}</strong> - {event.date} <br />
                  <span className="text-sm text-gray-600">{event.location}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => handleEdit(event)}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(event._id!)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
