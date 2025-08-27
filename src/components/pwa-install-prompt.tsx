'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PwaInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const hasInstalled = localStorage.getItem('fasto_pwa_installed');
      if (!hasInstalled) {
        setInstallPromptEvent(event);
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          localStorage.setItem('fasto_pwa_installed', 'true');
        }
        setIsVisible(false);
        setInstallPromptEvent(null);
      });
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('fasto_pwa_installed', 'true'); // Also marks as dismissed
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-card p-4 shadow-lg animate-in fade-in-0 slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-grow">
          <p className="font-semibold text-card-foreground">Install FASTO App</p>
          <p className="text-sm text-muted-foreground">Get the full experience on your device.</p>
        </div>
        <Button onClick={handleInstall} size="sm">Install</Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PwaInstallPrompt;
