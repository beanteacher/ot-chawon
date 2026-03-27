'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <main className="min-h-screen flex items-center justify-center bg-oc-black">
      <section className="w-full max-w-md px-8 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            type="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            {...(loginMutation.isError && loginMutation.error?.message
              ? { errorMessage: loginMutation.error.message }
              : {})}
            required
            autoComplete="email"
          />

          <Input
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

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
