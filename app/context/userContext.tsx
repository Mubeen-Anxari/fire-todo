import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
interface AuthcontextType {
  currentUser:User|null
}
const usercontext = createContext<AuthcontextType | undefined>(undefined);
const useUser = () => {
  const user = useContext(usercontext);
  if (user===undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return user;
};
const UserContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [currentUser,setCurrentUser]=useState<User | null>(null)
  useEffect(() => {
    const unsubscribe=onAuthStateChanged(auth,(user)=>{
      setCurrentUser(user)
    })
    return unsubscribe
  }, [])
  const value={
    currentUser
  }
  
  return (
    <usercontext.Provider value={value}>
      {children}
    </usercontext.Provider>
  );
};
export { UserContextProvider, useUser };
