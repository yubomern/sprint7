import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:4000/api/detail";

export default function ProfileDetail() {
  const { token } = useSelector((state) => state.auth);
  const {user} =  useSelector((state) => state.profile);

  const [phone, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  const checkPhone = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/check/${phoneNumber}`);
      if (data.exists) {
        Swal.fire("Oops!", "Phone number already found", "warning");
      } else {
        Swal.fire("Good!", "You can continue updating profile", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userId  = user._id ;
    let phoneNumber = "+216" + phone;

    try {
      const { data } = await axios.post(
        `${API_BASE}/update`,
        { phoneNumber, bio ,userId},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        Swal.fire("Success!", "Profile updated & SMS sent!", "success");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <h2>Update Profile</h2>
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhoneNumber( e.target.value)}
        onBlur={checkPhone}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleSubmit} className="btn btn-success"  style={{background:"grey"}}>Save Profile</button>
    </div>
  );
}
