import { createContext, useState } from "react";
// import { registerUser, loginUser } from "../services/userService";
import { registerUser,loginUser } from "../services/userServices";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (data) => {
    const res = await loginUser(data);

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  // 🔥 THIS is auto-login after register
  const register = async (data) => {
    const res = await registerUser(data);

    // store token immediately
    localStorage.setItem("token", res.data.token);

    // set user state
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};