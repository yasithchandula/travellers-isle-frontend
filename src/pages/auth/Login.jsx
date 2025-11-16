import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../../api/authApi";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.user.role);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#0e4b5a]">
          Travellers Isle Staff Login
        </h2>

        <input
          {...register("email")}
          placeholder="Email"
          className="border w-full mb-3 p-2 rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border w-full mb-5 p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-[#0e4b5a] text-white py-2 rounded hover:bg-[#0b3c4a]"
        >
          Login
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          No account?{" "}
          <Link to="/register" className="text-[#0e4b5a] underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
