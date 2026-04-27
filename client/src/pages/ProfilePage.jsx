import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', password: '' });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) setForm({ name: user.name, password: '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: form.name };
    if (form.password) payload.password = form.password;
    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully');
      setForm((f) => ({ ...f, password: '' }));
    } else {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Info Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block
              ${user?.role === 'admin' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'}`}>
              {user?.role === 'admin' ? '🔧 Admin' : '👤 User'}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field pl-10 bg-gray-50 cursor-not-allowed text-gray-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
              <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-10"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
                  className="btn-primary flex items-center gap-2">
            <FiSave />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;