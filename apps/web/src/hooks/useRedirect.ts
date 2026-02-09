import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useRedirect(defaultPath: string = '/') {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirect = useCallback(() => {
    const redirectPath = searchParams.get('redirect') || defaultPath;
    navigate(redirectPath);
  }, [searchParams, defaultPath, navigate]);

  const getRedirectUrl = useCallback(
    (basePath: string) => {
      const redirectParam = searchParams.get('redirect');
      return redirectParam ? `${basePath}?redirect=${redirectParam}` : basePath;
    },
    [searchParams],
  );

  return { redirect, getRedirectUrl };
}
