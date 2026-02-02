import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function Activate() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        await axios.get(`/auth/verify/${token}`);
        toast.success("Account activated successfully");
        navigate("/login");
      } catch (error) {
        toast.error("Invalid or expired activation link");
      }
    };

    activateAccount();
  }, [token, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p className="text-gray-600">Activating your account...</p>
    </div>
  );
}
