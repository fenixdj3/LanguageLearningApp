import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Note the change here
import { auth } from "../services/firebase";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      console.log("got user", user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsub(); // Ensure cleanup is done correctly
  }, []);
  return { user };
}
