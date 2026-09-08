import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { getUsers, getStudents } from "../utils/localData";  // Added getStudents for dual check
import { useMessage } from "../context/MessageContext";
import loginIllustration from "../assets/login-signup illustration.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Signup() {
  const { signup } = useAuth();
  const { setMessage } = useMessage();
  const navigate = useNavigate();
  const { data } = useData();

  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [admission, setAdmission] = useState("");
  const [course, setCourse] = useState("");
  const [childStudentId, setChildStudentId] = useState("");
  const [teacherCourses, setTeacherCourses] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    // Trim inputs
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Prevent admin signups — admins must login with provided admin credentials
    if (role === "admin" || trimmedUsername.toLowerCase() === "admin") {
      setMessage({ type: "info", text: "Admin accounts cannot be created here. Please login using the admin credentials." });
      navigate("/login");
      return;
    }

    // If parent, ensure the referenced child exists (enhanced check)
    if (role === "parent") {
      const childId = childStudentId.trim();  // Normalize input: trim spaces
      if (!childId) {
        setMessage({ type: "error", text: "Please enter a child admission number." });
        return;
      }

      // Query both users and students arrays for redundancy
      const allUsers = getUsers();
      const allStudents = getStudents();
      
      // Check users array (students have role="student")
      const userMatch = allUsers.some(
        (u) => u.role === "student" && u.admission_number && u.admission_number.trim() === childId
      );
      
      // Check students array directly
      const studentMatch = allStudents.some(
        (s) => s.admission_number && s.admission_number.trim() === childId
      );

      // Debugging logs (remove in production)
      console.log("Parent signup check:");
      console.log("Entered childId:", childId);
      console.log("Users array:", allUsers.filter(u => u.role === "student"));
      console.log("Students array:", allStudents);
      console.log("User match:", userMatch, "Student match:", studentMatch);

      if (!userMatch && !studentMatch) {
        setMessage({ type: "error", text: `No student found with admission number "${childId}". Ensure the student is registered first and the number matches exactly.` });
        return;
      }
    }

    try {
      setLoading(true);
      const extra = {};

      if (role === "student") {
        extra.admission_number = admission.trim().toLowerCase();  // Ensure it's trimmed here too
        extra.course = course.trim();
      }

      if (role === "parent") {
        extra.childStudentId = childStudentId.trim() || null;
      }

      if (role === "teacher") {
        extra.courses = teacherCourses
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      await signup({ name: trimmedName, username: trimmedUsername, email: trimmedEmail, password: trimmedPassword, role, ...extra });
      setMessage({ type: "success", text: "Signup success!" });
      navigate(`/${role}`);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };



  const leftVariants = {
    hidden: { x: -50, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };
  const rightVariants = {
    hidden: { x: 50, opacity: 0 },
    show: { x: 0, opacity: 1 },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full min-h-screen">
      {/* LEFT SIDE */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={leftVariants}
        transition={{ duration: 0.7 }}
        className="hidden md:flex w-3/5 flex-col items-center justify-center text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 overflow-hidden"
      >
        <div className="w-4/5 flex flex-col items-center text-center px-8">
          <h2 className="text-4xl font-bold mb-4">Welcome to Edu-Guardian</h2>
          <p className="text-lg mb-6 text-white/90">
            Safe. Transparent. Smart. Connect your school community in one platform.
          </p>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg mb-8 w-2/4">
            <h3 className="font-semibold text-white text-lg mb-2">Why EduGuardian?</h3>
            <ul className="mt-3 text-sm text-white/90 space-y-1">
              <li>• Real-time bus tracking & alerts</li>
              <li>• Transparent school funds</li>
              <li>• Personalized revision tools</li>
            </ul>
          </div>
          <img src={loginIllustration} alt="Login illustration" className="w-2/3 mx-auto drop-shadow-lg mt-6" />
        </div>
      </motion.div>

      {/* RIGHT SIDE - SIGNUP FORM */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={rightVariants}
        transition={{ duration: 0.7 }}
        className="w-full md:w-2/5 flex flex-col bg-[#0f172a] text-white overflow-y-auto py-10"
      >
        <div className="max-w-md w-full mx-auto px-10">
          <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-gray-400 mb-8 text-center">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block mb-2 text-sm">Full Name</label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block mb-2 text-sm">Username</label>
              <input
                type="text"
                placeholder="janedoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 text-sm">Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-2 text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
            </div>

            {/* Role Select */}
            <div>
              <label className="block mb-2 text-sm">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                {/* Admin signup is intentionally disabled. Admins must login using provided credentials. */}
              </select>
            </div>

            {/* Conditional Fields */}
            {role === "student" && (
              <>
                <div>
                  <label className="block mb-2 text-sm">Admission Number</label>
                  <input
                    value={admission}
                    onChange={(e) => setAdmission(e.target.value)}
                    placeholder="e.g. 2023001"
                    className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Course / Class</label>
                  <input
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. Form 2A"
                    className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            {role === "parent" && (
              <div>
                <label className="block mb-2 text-sm">Link to Child (Admission Number)</label>
                <input
                  value={childStudentId}
                  onChange={(e) => setChildStudentId(e.target.value)}
                  placeholder="e.g. ADM0001"
                  className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Enter the child's admission number to link their data.</p>
              </div>
            )}

            {role === "teacher" && (
              <div>
                <label className="block mb-2 text-sm">Courses Taught</label>
                <input
                  value={teacherCourses}
                  onChange={(e) => setTeacherCourses(e.target.value)}
                  placeholder="e.g. Math, Physics, Form 2A"
                  className="w-full px-4 py-2 rounded-md bg-[#1E293B] text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">Comma separated</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-md font-semibold transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
