import React, { useState, useContext } from 'react';
import { BaitoContext } from '../context/BaitoProvider';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box, Divider } from '@mui/material';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { signup, login, loginWithGoogle } = useContext(BaitoContext); // Get loginWithGoogle from context
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center', mb: 3 }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </Typography>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <Button fullWidth onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
          </Button>
        </form>

        <Divider sx={{ my: 2 }}>OR</Divider>

        {/* Google Login Button */}
        <Button fullWidth variant="outlined" onClick={handleGoogleLogin}>
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
}

export default LoginPage;
