// // src/pages/ResetPassword.jsx
// import { useState } from "react";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import { useNavigate } from "react-router-dom"; // For navigation after submission

// const ResetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Hook for navigating

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Mock API call to send reset email
//       const response = await fetch("/api/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // On success, navigate to a success page or a check email page
//         navigate("/check-email");
//       } else {
//         throw new Error(data.message || "Something went wrong");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-[60vw] lg:w-[25vw] mx-auto my-32 grid gap-3">
//       <h1 className="text-2xl font-bold">Reset Your Password</h1>
//       {error && <p className="text-red-600">{error}</p>}
//       <form onSubmit={handleSubmit} className="grid gap-3">
//         <Input
//           placeholder="Enter your email"
//           type="email"
//           name="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <Button disabled={loading}>
//           {loading ? "Sending..." : "Send Reset Link"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

// import { useState } from "react";

// const ResetPassword = () => {
//   const [username, setUsername] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleUsernameChange = (e) => {
//     setUsername(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Replace with your API call to handle password reset based on username
//       const response = await fetch("http://localhost:5000/api/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username }), // sending username instead of email
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage("Password reset instructions have been sent.");
//       } else {
//         setMessage(data.message || "Something went wrong.");
//       }
//     } catch (error) {
//       setMessage("Failed to reset password. Please try again." + error.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="reset-password-container">
//       <h2>Reset Your Password</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             placeholder="Enter your username"
//             value={username}
//             onChange={handleUsernameChange}
//             required
//           />
//         </div>

//         {message && <div className="message">{message}</div>}

//         <button type="submit" disabled={loading}>
//           {loading ? "Sending..." : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;

import { useState } from "react";

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setMessage("Username is required.");
      return;
    }

    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      // Replace with your API call to handle password reset based on username
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }), // sending username instead of email
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset instructions have been sent.");
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Failed to reset password. Please try again." + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>

        {message && <div className="message">{message}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
