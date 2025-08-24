import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import './Reclame.css';
// ✅ Define your API base URL once
const API_BASE_URL = "http://localhost:4000/api/reclam";

function ReclamationStudent() {
  const [reclamations, setReclamations] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchReclamations();
    console.table(reclamations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Correct GET request with headers
  const fetchReclamations = async () => {
    let userId  = user._id ;
    try {
      const { data } = await axios.get(`${API_BASE_URL}/me`,    { userId}   , {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setReclamations(data);
    } catch (err) {
      console.error("Erreur lors du chargement des réclamations", err);
    }
  };

  // ✅ Correct POST request with headers + body
  const createReclamation = async () => {
    let userId  = user._id ;
    console.table(user);
    try {
      await axios.post(
        API_BASE_URL,
        { title, description ,userId}, // body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReclamations();
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la réclamation", err);
    }
  };

  return (
    <div style={{ background: "grey", padding: "1rem", borderRadius: "8px" }}>
      <h2>Mes Réclamations</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre"
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <button onClick={createReclamation}>Envoyer</button>

      <ul style={{ marginTop: "20px" , background:"grey"}}>
        {reclamations.map((r) => (
          <li key={r._id} style={{ marginBottom: "15px" }}>
            <strong>{r.title}</strong> - <em>{r.status}</em> <br />
            {r.description} <br />
            {r.response && <em>Réponse: {r.response}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReclamationStudent;
