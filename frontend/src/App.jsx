import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // App load hote hi check karo: Kya hum logged in hain?
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Hum ek simple API call karenge. Agar 200 OK aaya, matlab hum Logged In hain.
      const response = await fetch("http://localhost:8080/api/domains", {
        method: "GET",
        headers: { "Accept": "application/json" },
        credentials: "include" // ✅ Zaroori: Taaki Cookies saath jayein
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Not logged in or Server Error");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
   try {
      // ✅ Change: Added 'credentials: "include"'
      await fetch("http://localhost:8080/logout", { 
        method: "POST",
        credentials: "include" // 🍪 Zaroori: Iske bina Server ko Session nahi milega
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
    
    // Token clear karo (agar koi bacha ho)
    sessionStorage.clear();
    
    // Login page par wapis bhejo
    window.location.href = "http://localhost:5173/"; 
  };

  if (loading) {
    return <div style={{color:"white", textAlign:"center", marginTop:"20%"}}><h2>Loading...</h2></div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;