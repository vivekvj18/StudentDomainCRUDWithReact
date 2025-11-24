import { useEffect, useState } from "react";
import "../styles/App.css";

const Dashboard = ({ onLogout }) => {
  const [domains, setDomains] = useState([]);
  const [email, setEmail] = useState("");

  // --- Modals State (Popup kholne/band karne ke liye) ---
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // --- Domain Form State (Add/Edit ke liye) ---
  const [domainForm, setDomainForm] = useState({
    domainId: "",
    program: "",
    batch: "",
    capacity: "",
    qualification: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  // --- Students View State ---
  const [selectedDomainName, setSelectedDomainName] = useState("");
  const [students, setStudents] = useState([]);

  // 1. Initial Load
  useEffect(() => {
    setEmail(sessionStorage.getItem("authEmail"));
    fetchDomains();
  }, []);

  const getToken = () => sessionStorage.getItem("authToken");

  // 2. Fetch All Domains
  const fetchDomains = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/domains", {
        headers: { Authorization: "Basic " + getToken() },
      });
      if (response.ok) {
        const data = await response.json();
        setDomains(data);
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
    }
  };

  // 3. Delete Domain
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this domain?")) return;
    try {
      await fetch(`http://localhost:8080/api/domains/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Basic " + getToken() },
      });
      fetchDomains(); // Refresh List
    } catch (error) {
      alert("Error deleting domain");
    }
  };

  // 4. Handle Add/Edit Form Submit
  const handleSaveDomain = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:8080/api/domains/${domainForm.domainId}`
      : "http://localhost:8080/api/domains";
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + getToken(),
        },
        body: JSON.stringify(domainForm),
      });

      if (response.ok) {
        setShowDomainModal(false);
        fetchDomains(); // List Update karo
        alert(isEditing ? "Domain Updated!" : "Domain Added!");
      } else {
        alert("Failed to save domain");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 5. Open Modal for Add
  const openAddModal = () => {
    setDomainForm({ domainId: "", program: "", batch: "", capacity: "", qualification: "" });
    setIsEditing(false);
    setShowDomainModal(true);
  };

  // 6. Open Modal for Edit
  const openEditModal = (domain) => {
    setDomainForm(domain);
    setIsEditing(true);
    setShowDomainModal(true);
  };

  // 7. View Students Logic
  const handleViewStudents = async (id, programName) => {
    setSelectedDomainName(programName);
    setShowStudentModal(true);
    setStudents([]); // Clear old data

    try {
      const response = await fetch(`http://localhost:8080/api/domains/${id}/students`, {
        headers: { Authorization: "Basic " + getToken() },
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error("Error fetching students");
    }
  };

  return (
    <div className="dashboard-body">
      <div className="dashboard-container glass-panel">
        {/* --- Header --- */}
        <div className="header">
          <div>
            <h2>🎓 Domain Manager</h2>
            <p>Hello, <span>{email || "Admin"}</span></p>
          </div>
          <button onClick={onLogout} className="btn btn-danger">Logout</button>
        </div>

        {/* --- Add Button --- */}
        <div className="action-bar">
          <button className="btn btn-add" onClick={openAddModal}>
            <i className="fas fa-plus-circle"></i> Add New Domain
          </button>
        </div>

        {/* --- Table --- */}
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th>Batch</th>
                <th>Capacity</th>
                <th>Qualification</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((d) => (
                <tr key={d.domainId}>
                  <td><strong>{d.program}</strong></td>
                  <td>{d.batch}</td>
                  <td>
                    <span style={{ background: "#e0f2f1", color: "#00695c", padding: "4px 8px", borderRadius: "4px" }}>
                      {d.capacity} Seats
                    </span>
                  </td>
                  <td>{d.qualification}</td>
                  <td>
                    {/* View Students Button */}
                    <button className="action-btn view-btn" onClick={() => handleViewStudents(d.domainId, d.program)} title="View Students">
                        👁️
                    </button>
                    {/* Edit Button */}
                    <button className="action-btn edit-btn" onClick={() => openEditModal(d)} title="Edit">
                        ✏️
                    </button>
                    {/* Delete Button */}
                    <button className="action-btn delete-btn" onClick={() => handleDelete(d.domainId)} title="Delete">
                        🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* === MODAL: ADD / EDIT DOMAIN === */}
      {showDomainModal && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowDomainModal(false)}>&times;</span>
            <h3>{isEditing ? "Edit Domain" : "Add New Domain"}</h3>
            <br />
            <form onSubmit={handleSaveDomain}>
              <div className="form-group">
                <label>Program Name</label>
                <input 
                    type="text" 
                    value={domainForm.program} 
                    onChange={(e) => setDomainForm({...domainForm, program: e.target.value})} 
                    required 
                />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <input 
                    type="text" 
                    value={domainForm.batch} 
                    onChange={(e) => setDomainForm({...domainForm, batch: e.target.value})} 
                    required 
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input 
                    type="number" 
                    value={domainForm.capacity} 
                    onChange={(e) => setDomainForm({...domainForm, capacity: e.target.value})} 
                    required 
                />
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input 
                    type="text" 
                    value={domainForm.qualification} 
                    onChange={(e) => setDomainForm({...domainForm, qualification: e.target.value})} 
                    required 
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Domain</button>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL: VIEW STUDENTS === */}
      {showStudentModal && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowStudentModal(false)}>&times;</span>
            <h3>🧑‍🎓 Enrolled Students</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>Program: {selectedDomainName}</p>
            <hr style={{ margin: "10px 0", border: "0", borderTop: "1px solid #eee" }} />

            <ul id="studentList">
              {students.length === 0 ? (
                <li style={{ color: "#888", padding: "10px" }}>No students enrolled yet.</li>
              ) : (
                students.map((s) => (
                  <li key={s.studentId} style={{ padding: "10px", borderBottom: "1px solid #eee", display: "flex", gap: "10px" }}>
                    <div className="student-avatar" style={{width:"30px", height:"30px", background:"#ddd", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        {s.firstName.charAt(0)}
                    </div>
                    <div>
                      <strong>{s.firstName} {s.lastName}</strong><br />
                      <span style={{ fontSize: "0.85rem", color: "#666" }}>{s.email}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;