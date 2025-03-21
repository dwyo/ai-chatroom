import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login, register } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { createConnection } from "@/store/websocketSlice"
import { setToken,setUser } from '@/store/user';

type AuthMode = 'login' | 'register';

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 表单验证
    const newErrors = {
      username: '',
      password: '',
      email: '',
      confirmPassword: ''
    };

    if (!formData.username) {
      newErrors.username = '请输入用户名';
    }
    if (!formData.password) {
      newErrors.password = '请输入密码';
    }
    if (mode === 'register' && !formData.email) {
        newErrors.email = '请输入邮箱';
    }
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mode === 'register' && !emailRegex.test(formData.email)) {
      newErrors.email = '请输入正确的邮箱';
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        
        const response = await login({
          identity: formData.username,
          password: formData.password
        });
        const data  = response.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log(response);
        dispatch(setToken(data.token))
        dispatch(setUser(data.user))
        // 初始化 WebSocket 连接
        // 在登录成功后初始化WebSocket连接
        dispatch(createConnection())
        navigate('/');
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        setMode('login');
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : error && typeof error === 'object' && 'response' in error
        ? (error.response as { data?: { message?: string } })?.data?.message
        : '认证失败，请稍后重试';
      setErrors({
        ...newErrors,
        username: errorMessage || ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? '登录账号' : '注册账号'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              label="用户名"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              error={errors.username}
              placeholder="请输入用户名"
              autoComplete="username"
            />
            {mode === 'register' && (
            <Input
              label="邮箱"
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="请输入电子邮箱"
            />
            )}
            <Input
              label="密码"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              placeholder="请输入密码"
              autoComplete="password"
            />
            {mode === 'register' && (
              <Input
                label="确认密码"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                placeholder="请再次输入密码"
                autoComplete="new-password"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            {mode === 'login' && (
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  忘记密码？
                </a>
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              {mode === 'login' ? '登录' : '注册'}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? '没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};