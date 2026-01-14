import React, { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { auth } from '../../firebase';  

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

// --- Auth Modal Component 身份验证弹窗组件 ---

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Inside AuthModal component:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      } else {
        // Create Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      }
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors">
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <h3 className="text-2xl font-serif italic mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
          <p className="text-sm text-stone-500 font-medium">Please enter your details to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border-stone-200 border rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-stone-200 transition-all text-sm" 
                placeholder="hello@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border-stone-200 border rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 ring-stone-200 transition-all text-sm" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-stone-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-tight"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; // 必须导出