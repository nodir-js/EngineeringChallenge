import React, { useState } from "react";

interface UserContextType {
	token?: string,
	username?: string,
	setToken: (token?: string) => void;
	setUsername: (username?: string) => void;
}

export const UserContext = React.createContext<UserContextType>(null)

const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
	const [token, setToken] = useState(null);

  return <UserContext.Provider value={{ username, token, setUsername, setToken }}>{children}</UserContext.Provider>;
};

export default UserProvider;