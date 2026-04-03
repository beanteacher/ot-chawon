'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    if (!password.trim()) errors.password = '비밀번호를 입력해주세요.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-oc-gray-50">
      <section className="w-full max-w-md px-8 py-12">
        <h1 className="text-2xl font-bold text-oc-gray-900 mb-8">로그인</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div>
            <Input
              type="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: '' })); }}
              autoComplete="email"
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>

          <div>
            <Input
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: '' })); }}
              autoComplete="current-password"
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
          </div>

          {loginMutation.isError && (
            <p className="text-sm text-oc-error">
              이메일 또는 비밀번호가 올바르지 않습니다.
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loginMutation.isPending}
          >
            로그인
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-oc-gray-500">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-oc-accent hover:underline">
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
