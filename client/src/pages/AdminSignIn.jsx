import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { signInStart, signInSuccess, signInFailure} from '../redux/user/userSlice';
import AdminHeader from '../components/AdminHeader';

//import { C } from 'vite/dist/node/chunks/dep-G-px366b';
// jwt from "jsonwebtoken";



export default function SignIn(){
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    dispatch(signInFailure(""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/backend/adminauth/admin-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const {rest, token} = await res.json();
      const data = rest;
      //const token = jwt.sign({ id: res._id }, process.env.JWT_SECRET);
      localStorage.setItem("access_token", token);
      if (data.success === false) {
        console.log(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/admin-home');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div>
      <AdminHeader/>
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={'/adminsign-up'}>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      <div className='flex gap-2'>
        <p>Want to buy products?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in as User</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </div>
  );
}