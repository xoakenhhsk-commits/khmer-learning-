import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "@/store/useStore";

/**
 * Sync or create user profile in Firestore
 */
export async function syncUserProfile(user: User) {
  if (!user.id) return;
  const userRef = doc(db, "users", user.id);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Merge existing data with local data (Firestore is source of truth for XP/Level usually)
    const data = userSnap.data();
    return {
      ...user,
      xp: data.xp || user.xp,
      level: data.level || user.level,
      streakDays: data.streakDays || user.streakDays,
      completedLessons: data.completedLessons || [],
    };
  } else {
    // Create new profile
    await setDoc(userRef, {
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      xp: user.xp || 0,
      level: user.level || 1,
      streakDays: user.streakDays || 0,
      role: user.role || "USER",
      completedLessons: [],
      createdAt: new Date().toISOString(),
    });
    return user;
  }
}

/**
 * Update user stats in Firestore
 */
export async function updateUserStats(userId: string, updates: Partial<User> & { completedLessons?: string[] }) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...updates,
    lastActive: new Date().toISOString(),
  });
}

/**
 * Get top users for leaderboard
 */
export async function getLeaderboard(limitCount = 10) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("xp", "desc"), limit(limitCount));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
