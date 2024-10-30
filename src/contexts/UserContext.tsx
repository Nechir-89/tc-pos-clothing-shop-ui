import React from 'react'
import { AppUser } from '../types/User.types';


export type UserContextType = {
  user: AppUser | null,
  updateUser: (user: AppUser) => void
}

export const UserContext = React.createContext<UserContextType>({
  user: null,
  updateUser: (user: AppUser) => user
});

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<AppUser | null>(null);

  const updateUser = (appUser: AppUser | null) => {
    setUser(appUser)
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider;
