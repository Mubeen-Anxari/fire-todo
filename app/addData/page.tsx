"use client";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useUser } from "../context/userContext";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
}

export default function AddData() {
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [updateName, setUpdateName] = useState<string>("");
  const { currentUser } = useUser();
const router=useRouter()
  // Add new user to Firestore
  const handleAddData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Users"), {
        name: name,
        userId: currentUser?.uid,
      });
      setName(""); // Clear input field
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch users for current userId
  useEffect(() => {
    if (!currentUser) return; // Ensure currentUser is loaded
  
    const q = query(
      collection(db, "Users"),
      where("userId", "==", currentUser.uid)
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList: User[] = [];
      snapshot.forEach((doc) => {
        // Explicitly construct the user object to avoid overwriting 'id'
        const userData = doc.data() as Omit<User, "id">; // Everything except 'id'
        userList.push({ id: doc.id, ...userData }); // Manually add 'id'
      });
      setUsers(userList);
      console.log(userList);
    });
  
    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, [currentUser]); // Added currentUser as dependency
   // Added currentUser as dependency

  // Delete a user
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "Users", id));
    } catch (error) {
      console.log(error);
    }
  };

  // Start editing a user
  const handleUpdateClick = (user: User) => {
    setEditUser(user);
    setUpdateName(user.name);
  };

  // Submit the updated user data
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      try {
        const userDoc = doc(db, "Users", editUser.id);
        await updateDoc(userDoc, { name: updateName });
        setUpdateName(""); // Clear input field
        setEditUser(null); // Exit edit mode
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Data</h1>
        <form onSubmit={handleAddData} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            className="bg-blue-700 text-white text-center p-2 rounded-xl w-full"
            type="submit"
          >
            Add Data
          </button>
          <button onClick={()=>{
            signOut(auth);
            router.push('/')
          }
            
          }
            className="bg-blue-700 text-white text-center p-2 rounded-xl w-full"
            type="submit"
          >
            sign Out
          </button>
        </form>

        {/* Display Users */}
        <div className="mt-6">
          {users.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 bg-white shadow-xl rounded-lg px-4 mb-2"
            >
              <p>{item.name}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-700 text-white p-2 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleUpdateClick(item)}
                  className="bg-purple-700 text-white p-2 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit User Form */}
        {editUser && (
          <form className="pt-10" onSubmit={handleUpdate}>
            <div className="bg-transparent w-full rounded-lg">
              <input
                value={updateName}
                type="text"
                onChange={(e) => setUpdateName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Update name"
              />
              <button
                type="submit"
                className="bg-green-600 text-white mt-2 px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
