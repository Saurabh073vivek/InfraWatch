import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("infrawatch_user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(
      "infrawatch_token"
    );
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // AXIOS AUTHENTICATION
  // ==========================================

  useEffect(() => {
    // Set token for all Axios requests
    if (token) {
      axios.defaults.headers.common.Authorization =
        `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }

    setLoading(false);
  }, [token]);

  // ==========================================
  // AXIOS RESPONSE INTERCEPTOR
  // ==========================================

  useEffect(() => {
    const interceptor =
      axios.interceptors.response.use(
        (response) => {
          return response;
        },

        (error) => {
          const status =
            error.response?.status;

          const requestUrl =
            error.config?.url || "";

          // Handle expired / invalid JWT
          if (
            status === 401 &&
            token &&
            !requestUrl.includes(
              "/auth/login"
            ) &&
            !requestUrl.includes(
              "/auth/register"
            )
          ) {
            console.warn(
              "Authentication expired. Redirecting to login."
            );

            localStorage.removeItem(
              "infrawatch_token"
            );

            localStorage.removeItem(
              "infrawatch_user"
            );

            delete axios.defaults.headers
              .common.Authorization;

            setToken(null);
            setUser(null);

            window.location.href = "/login";
          }

          return Promise.reject(error);
        }
      );

    // Cleanup interceptor
    return () => {
      axios.interceptors.response.eject(
        interceptor
      );
    };
  }, [token]);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (
    email,
    password
  ) => {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      }
    );

    const {
      token: receivedToken,
      user: receivedUser,
    } = response.data;

    localStorage.setItem(
      "infrawatch_token",
      receivedToken
    );

    localStorage.setItem(
      "infrawatch_user",
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);

    axios.defaults.headers.common.Authorization =
      `Bearer ${receivedToken}`;

    return response.data;
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (
    name,
    email,
    password
  ) => {
    const response = await axios.post(
      `${API_URL}/auth/register`,
      {
        name,
        email,
        password,
      }
    );

    const {
      token: receivedToken,
      user: receivedUser,
    } = response.data;

    localStorage.setItem(
      "infrawatch_token",
      receivedToken
    );

    localStorage.setItem(
      "infrawatch_user",
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);

    axios.defaults.headers.common.Authorization =
      `Bearer ${receivedToken}`;

    return response.data;
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem(
      "infrawatch_token"
    );

    localStorage.removeItem(
      "infrawatch_user"
    );

    setToken(null);
    setUser(null);

    delete axios.defaults.headers.common
      .Authorization;

    window.location.href = "/login";
  };

  // ==========================================
  // AUTH CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// CUSTOM HOOK
// ==========================================

export function useAuth() {
  return useContext(AuthContext);
}