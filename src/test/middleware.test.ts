import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { describe, expect, it } from 'vitest';
import { middleware } from '../../middleware';

function createRequest(url: string, cookie?: string) {
  const u = new URL(url);
  const req = {
    nextUrl: u,
    cookies: {
      get: (name: string) => {
        if (name !== 'auth_token') return undefined;
        if (!cookie) return undefined;
        return { name, value: cookie };
      },
    },
    url,
  };
  return req as unknown as NextRequest;
}

describe('middleware', () => {
  it('redirige a /login si accede a /dashboard sin auth', () => {
    const req = createRequest('https://example.com/dashboard');
    const res = middleware(req);
    expect((res as NextResponse).headers.get('location')).toBe('https://example.com/login');
  });

  it('permite /dashboard con auth', () => {
    const req = createRequest('https://example.com/dashboard', 'token');
    const res = middleware(req);
    expect((res as NextResponse).headers.get('location')).toBeNull();
  });

  it('redirige /login -> /dashboard cuando hay auth', () => {
    const req = createRequest('https://example.com/login', 'token');
    const res = middleware(req);
    expect((res as NextResponse).headers.get('location')).toBe('https://example.com/dashboard');
  });

  it('redirige / -> /login si no hay auth', () => {
    const req = createRequest('https://example.com/');
    const res = middleware(req);
    expect((res as NextResponse).headers.get('location')).toBe('https://example.com/login');
  });

  it('redirige / -> /dashboard si hay auth', () => {
    const req = createRequest('https://example.com/', 'token');
    const res = middleware(req);
    expect((res as NextResponse).headers.get('location')).toBe('https://example.com/dashboard');
  });
});


