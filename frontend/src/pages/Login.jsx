import "../styles/App.css";

const Login = () => {
  // Ye function browser ko seedha Backend ke Google Login page par bhej dega
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="login-body">
      <div className="login-container glass-panel">
        <h2>👋 Welcome Back</h2>
        <p>Login with Google (Admin Only)</p>
        
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-primary" 
          style={{
            background: "#DB4437", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: "10px",
            fontSize: "1.1rem"
          }}
        >
          <i className="fas fa-envelope"></i> Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;