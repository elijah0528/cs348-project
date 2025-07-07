"use client";

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Redirect to home or refresh page
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: just refresh the page
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-stone-600"
    >
      Logout
    </button>
  );
}
