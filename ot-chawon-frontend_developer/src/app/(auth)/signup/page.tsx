'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiClient } from '@/lib/api/axios';
import type { AuthDto } from '@/services/auth/dto/auth.dto';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const body: AuthDto.SignupRequest = { email, password, name };
      await apiClient.post('/api/auth/signup', body);
      router.push('/login');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-oc-black">
      <section className="w-full max-w-md px-8 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">회원가입</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input
            type="text"
            label="이름"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <Input
            type="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="new-password"
          />

          {error && (
            <p className="text-sm text-oc-error">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          >
            회원가입
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-oc-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-oc-accent hover:underline">
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
}
