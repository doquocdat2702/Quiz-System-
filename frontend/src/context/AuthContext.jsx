import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const login = (userData, userToken) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "token",
      userToken
    );

    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  const updateUser = (userData, userToken = token) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    if (userToken) {
      localStorage.setItem(
        "token",
        userToken
      );
      setToken(userToken);
    }

    setUser(userData);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export default AuthProvider;
