import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";

export default function SettingsGlobal() {
  const { updateUserAvatar, data } = useContext(DataContext);
  const { current } = useAuth();
  const { setMessage } = useMessage();
  const [preview, setPreview] = useState(current?.avatarBase64 || null);

  const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b = await fileToBase64(file);
    updateUserAvatar(current.id, b);
    setPreview(b);
    setMessage({ type: "success", text: "Profile photo updated" });
  };

  const user = data.users.find(u => u.id === current?.id);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Settings</h2>
      <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <img src={user?.avatarBase64 || "https://i.pravatar.cc/100"} alt="avatar" className="w-20 h-20 rounded-full" />
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm mb-1">Change profile photo</label>
          <input type="file" accept="image/*" onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}
