'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Eye, EyeOff, CircleX } from 'lucide-react';
import {
  setSessionStorageItem,
  getLocalStorageItem,
  setLocalStorageItem
} from 'utils/localstorage';
import apiCall from '@/lib/axios';
import { loginSchema, loginSchemaType } from 'schema';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Snackbar, Alert } from '@mui/material';
import CardWrapper from './card-wrapper';
import LoginResponse from 'types/auth';
import { getSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Load saved credentials if "Remember me" was checked previously
  useEffect(() => {
    const savedCredentials = getLocalStorageItem('rememberedCredentials');
    if (
      savedCredentials &&
      typeof savedCredentials === 'object' &&
      'email' in savedCredentials &&
      'password' in savedCredentials
    ) {
      const email =
        (savedCredentials as { email: string; password: string }).email || '';
      const password =
        (savedCredentials as { email: string; password: string }).password ||
        '';

      if (email) form.setValue('email', email);
      if (password) form.setValue('password', password);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  const onSubmit = async (data: loginSchemaType) => {
    setIsLoading(true);
    setLoginError(null);

    // Save credentials if "Remember me" is checked
    if (data.rememberMe) {
      setLocalStorageItem('rememberedCredentials', {
        email: data.email,
        password: data.password
      });
    } else {
      // Clear saved credentials if "Remember me" is unchecked
      localStorage.removeItem('rememberedCredentials');
    }
    // Hardcoded test login bypass
    if (data.email === 'info@knecthotel.com' && data.password === 'knect@123') {
        router.push('/super-admin/dashboard');

      // Fake user object for testing
      const fakeUser = {
        scope: 'Platform',
        isSuperAdmin: true,
        permissions: []
      };

      const allowedModules = [];

      setSessionStorageItem('admin', {
        token: 'test-token',
        user: fakeUser,
        allowedModules,
        isSuperAdmin: true,
        permissions: []
      });

      document.cookie = `token=test-token; path=/; SameSite=Lax`;

      router.push('/super-admin/dashboard');
      return;
    }

    try {
      const response = await apiCall<LoginResponse>(
        'POST',
        // 'https://uat-backend.knecthotel.com/api/superAdmin/login',
        `${process.env.NEXT_PUBLIC_API_URL}api/superAdmin/login`,
        {
          email: data.email,
          password: data.password
        }
      );

      if (response.token && response.user) {
        const isSuperAdmin = response.user?.isSuperAdmin || false;
        const allowedModules =
          response.user?.permissions?.map((p) => p.module) || [];
        // const serviceManagementModules = allServices.filter(service => allowedModules.includes(service.name));
        // Secure token storage
        setSessionStorageItem('admin', {
          token: response.token,
          user: response.user,
          allowedModules,
          isSuperAdmin,
          permissions: response.user?.permissions || []
        });

        // Set secure cookie for middleware
        document.cookie = `token=${response.token}; path=/; SameSite=Lax`;
        const s = getSocket();
        socketRef.current = s;
        if (s) {
          // Initialize connection state and listeners
          setIsSocketConnected(s.connected);
          s.on('connect', () => setIsSocketConnected(true));
          s.on('disconnect', () => setIsSocketConnected(false));
          s.on('connect_error', () => setIsSocketConnected(false));
          s.on('sos', (data) => console.log(data));
        }

        // Determine redirect based on user role/scope
        const redirectPath = determineRedirectPath(response.user);
        router.push(redirectPath);
        console.log('Login successful:', response);
        console.log('Allowed modules:', allowedModules);
        // console.log('service ManagementModules', serviceManagementModules)
      } else {
        throw new Error('Invalid login credentials');
      }
    } catch (error: any) {
      // Handle different types of errors with user-friendly messages
      if (!navigator.onLine) {
        setLoginError(
          'No internet connection. Please check your network and try again.'
        );
      } else if (error.status === 404) {
        setLoginError(
          'Login service is currently unavailable. Please try again later or contact support.'
        );
      } else if (error.status === 401 || error.status === 403) {
        setLoginError(
          'Invalid email or password. Please check your credentials and try again.'
        );
      } else if (error.status >= 500) {
        setLoginError(
          'Server error. Our team has been notified and is working on it. Please try again later.'
        );
      } else {
        setLoginError(error.message || 'Login failed. Please try again later.');
      }
      setSnackbarOpen(true);
      // console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine redirect path based on user role/scope
  const determineRedirectPath = (user: LoginResponse['user']) => {
    switch (user.scope) {
      case 'Platform':
        return '/super-admin/dashboard';
      case 'Hotel':
        return '/hotel-panel/dashboard';
      default:
        return '/dashboard';
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const clearEmail = () => {
    form.setValue('email', '');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="form-background overflow-hidden flex flex-col justify-center items-center w-[90%] h-[60vh] md:w-[90vw] md:h-[70vh] lg:w-[80%] lg:h-[85%] px-4 rounded-xl md:min-w-[300px] lg:min-w-[350px]">
      <CardWrapper
        title="Sign in"
        label="Please enter your email and password to sign in."
        incorrectPasswordMessage={null}
      >
        <div className="text-xs mb-2">
          {isSocketConnected ? (
            <span className="text-green-600">
              Real‑time connection established
            </span>
          ) : (
            <span className="text-red-600"></span>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 text-black"
          >
            <div className="space-y-4">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="bg-transparent text-black border-black border-opacity-20 placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-25 pr-10"
                          autoComplete="email"
                        />
                        {field.value && (
                          <button
                            type="button"
                            onClick={clearEmail}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label="Clear email"
                          >
                            <CircleX className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black text-[0.8rem]">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          {...field}
                          className="bg-transparent text-black border-black border-opacity-20 placeholder:text-black placeholder:text-xs 2xl:text-sm placeholder:opacity-25 pr-10"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember Me and Forgot Password */}
              <div className="w-full flex justify-between items-center">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex justify-center">
                      <div className="flex items-center w-full">
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            id="rememberMe"
                            className="h-4 w-4 bg-transparent border-black border-opacity-20"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="rememberMe"
                          className="text-xs 2xl:text-sm text-nowrap ml-2 text-black"
                        >
                          Remember me
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Link
                  href="/resetpassword"
                  className="text-xs 2xl:text-sm text-black hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </Form>

        {/* Material UI Snackbar for Error Messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {loginError}
          </Alert>
        </Snackbar>
      </CardWrapper>
    </div>
  );
};

export default LoginForm;
