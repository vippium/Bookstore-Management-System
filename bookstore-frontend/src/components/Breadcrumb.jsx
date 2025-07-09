import { useNavigate } from "react-router-dom";

export default function Breadcrumb({ current = "Book Info", icon }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-0 pt-1 pb-4">
      <div className="flex items-center gap-3">
        <span
          onClick={() => navigate("/")}
          className="flex items-center text-gray-400 text-sm font-medium hover:text-blue-600 cursor-pointer transition"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10h6v-6h4v6h6V10" />
          </svg>
          Home
        </span>

        <span className="text-blue-400 text-xl">›</span>

        <span className="flex items-center text-blue-700 text-2xl font-bold">
          {icon && <span className="mr-1">{icon}</span>}
          {current}
        </span>
      </div>
    </div>
  );
}
