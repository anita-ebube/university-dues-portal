import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("👤 Logged in Firebase user:", user.email || user.displayName);

        // ✅ Fetch Firestore user by UID
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("✅ Firestore user data:", userData);

          setCurrentUser({
            uid: user.uid,
            email: user.email,
            ...userData,
            role: (userData.role || "student").toLowerCase(),
          });
        } else {
          console.warn("⚠️ No Firestore document found for UID:", user.uid);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            role: "student", // fallback
          });
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          role: "student", // fallback
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
