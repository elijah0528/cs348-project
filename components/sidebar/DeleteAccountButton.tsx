"use client";

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';

export default function DeleteAccountButton() {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      // Call delete API to remove user account
      await fetch('/api/reddit/auth/delete', {
        method: 'POST',
      });
      
      // Redirect to home or refresh page
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Account deletion failed:', error);
      window.location.reload();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleDelete}
          className="text-xs text-stone-600 hover:text-stone-800 transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-stone-400"
          aria-label="Delete Account"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="z-50 rounded-md bg-stone-800 px-3 py-1.5 text-xs text-white shadow-lg border border-stone-700 animate-fade-in"
        style={{
          fontWeight: 500,
          letterSpacing: '0.01em',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.15)',
        }}
      >
        <span className="flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5 mr-1 opacity-80" />
          Delete Account
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
