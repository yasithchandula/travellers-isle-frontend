import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
export function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const onSubmit = async () => {
    // TODO: call /auth/register
    alert('Registered! You can now sign in.');
    navigate('/login');
  };
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <img src="https://travellersisle.com/wp-content/uploads/2024/06/best-honeymoon-destinations-in-sri-lanka.jpg" alt="Scenic" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="flex items-center justify-center p-8 bg-[color:var(--ti-bg)]">
        <div className="card w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold text-[color:var(--ti-primary)] mb-2">Create account</h2>
          <p className="text-gray-600 mb-6">For Travellers Isle staff use.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full name</label>
              <input {...register('name')} className="w-full border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input {...register('email')} className="w-full border rounded-xl px-3 py-2" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Password</label>
                <input type="password" {...register('password')} className="w-full border rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Confirm</label>
                <input type="password" {...register('confirm')} className="w-full border rounded-xl px-3 py-2" />
              </div>
            </div>
            <button className="btn-primary w-full">Register</button>
            <p className="text-sm text-center text-gray-600">Have an account? <Link to="/login" className="underline text-[color:var(--ti-primary)]">Sign in</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Register;