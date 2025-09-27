import { useContext, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Loader, ShieldCheck } from "lucide-react";

export default function VerifyOtp() {
  const { verifyOtp, resendOtp } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { userId, email } = location.state || {};

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputsRef = useRef([]);

  if (!userId || !email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-semibold">
          Missing verification details. Please register or log in again.
        </p>
      </div>
    );
  }

  const handleChange = async (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if OTP is complete
    const otpValue = newOtp.join("");
    if (otpValue.length === 6 && newOtp.every((d) => d !== "")) {
      await handleVerify(otpValue);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpValue = otp.join("")) => {
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    const result = await verifyOtp(userId, otpValue);
    setLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  const handleResend = async () => {
    setResending(true);
    await resendOtp(email);
    setResending(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-12 h-12 text-blue-600 mb-2" />
          <h2 className="text-xl font-bold text-blue-700">Verify Your Email</h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            We’ve sent a 6-digit OTP to <br />
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-6"
        >
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border rounded-lg text-center text-lg font-semibold shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          {/* Verify Button (backup if auto-submit fails) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Didn’t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 font-medium hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
