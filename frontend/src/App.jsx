import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/api/v1";

export default function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("tr");
  const [apiStatus, setApiStatus] = useState("offline");

  useEffect(() => {
    fetch(`${API_BASE}/`)
      .then(res => setApiStatus(res.ok ? "online" : "offline"))
      .catch(() => setApiStatus("offline"));

    const token = localStorage.getItem("hekim_token");
    const username = localStorage.getItem("hekim_user");
    if (token && username) setUser({ username, token });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hekim_token");
    localStorage.removeItem("hekim_user");
    setUser(null);
  };

  return user ? (
    <window.MainAppSaas
      lang={lang}
      setLang={setLang}
      user={user}
      apiStatus={apiStatus}
      onLogout={handleLogout}
    />
  ) : (
    <window.LoginScreen
      lang={lang}
      setLang={setLang}
      apiStatus={apiStatus}
      extraFields={[]}
      variant="centered"
      onSuccess={(u) => {
        localStorage.setItem("hekim_token", u.token);
        localStorage.setItem("hekim_user", u.username);
        setUser(u);
      }}
    />
  );
}