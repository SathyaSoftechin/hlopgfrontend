import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./PGMembers.css";

const PGMembers = () => {
  const { pgId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get(`/pg/members/${pgId}`);
        setMembers(res.data || []);
      } catch (err) {
        console.error("Error fetching members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [pgId]);

  if (loading) return <p>Loading members...</p>;

  return (
    <div className="pg-members-page">
      <h3>PG Members</h3>
      {members.length === 0 ? (
        <p>No members found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Share Type</th>
              <th>Joining Date</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id || m.user_id}>
                <td>{m.name}</td>
                <td>{m.age}</td>
                <td>{m.sharing}</td>
                <td>{m.joiningDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PGMembers;
