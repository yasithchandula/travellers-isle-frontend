import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../../api/authApi";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await authApi.register(data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-[#0e4b5a]">
          Create Account
        </h2>

        <input
          {...register("name")}
          placeholder="Full Name"
          className="border w-full mb-3 p-2 rounded"
        />
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
          Register
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0e4b5a] underline">
            Sign in here
          </Link>
        </p>
      </form>
    </div>
  );
}
