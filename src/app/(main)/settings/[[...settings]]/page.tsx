'use client';

import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <UserProfile
          path="/settings"
          routing="path"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none w-full bg-transparent border-none',
              navbar: 'hidden',
              pageScrollBox: 'p-0',
            },
          }}
        />
      </div>
    </div>
  );
}
