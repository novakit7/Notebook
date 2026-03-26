import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./assets/Navbar";
import ProtectedRoutes from "./assets/ProtectedRoutes";
import API from "./api/api";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Footer from "./assets/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load token + user on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login
  const handleLogin = () => {
    const token = localStorage.getItem("token");

    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setIsLoggedIn(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete API.defaults.headers.common["Authorization"];

    setIsLoggedIn(false);
    setUser(null);
  };

  // Delete All Notes
  const handleDeleteAllNotes = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/deleteAllNotes");

      alert(res.data.message);
    } catch (err) {
      alert(
        err?.response?.data?.message || "Failed to delete notes."
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async (password) => {
    try {
      setLoading(true);

      await API.post("/auth/deleteAcc", {
        password: password
      });


      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete API.defaults.headers.common["Authorization"];

      setIsLoggedIn(false);
      setUser(null);

      alert("Account deleted successfully.");
    } catch (err) {
      alert(
        err?.response?.data?.message || "Failed to delete account."
      );
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (passwordData) => {
    try {
      const res = await API.post("/auth/changePass", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      alert(res.data.message);
    } catch (err) {
      alert(
        err?.response?.data?.message || "Failed to update password."
      );
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar title="NoteBook!" isLoggedIn={isLoggedIn} />

      <div className="flex-grow-1">
        <Routes>

          <Route
            path="/"
            element={<HomePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
          />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/login"
            element={
              isLoggedIn
                ? <Navigate to="/notes" replace />
                : <Login onLogin={handleLogin} />
            }/>

          <Route element={<ProtectedRoutes />}>
            <Route path="/notes" element={<Notes />} />
            <Route
              path="/profile"
              element={
                <Profile
                  user={user}
                  loading={loading}
                  handleLogout={handleLogout}
                  handleDeleteAccount={handleDeleteAccount}
                  handleDeleteAllNotes={handleDeleteAllNotes}
                  handleChangePassword={handleChangePassword}
                />
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
