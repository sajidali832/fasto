'use client';

import { UserProfile } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-4xl">
         <UserProfile
          routing="path"
          path="/settings"
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none w-full bg-transparent',
            },
          }}
        />
      </div>
    </div>
  );
}
