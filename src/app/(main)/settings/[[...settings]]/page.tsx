'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, ChevronRight, FileText, Gavel, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

const PolicyContent = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <DialogContent className="sm:max-w-[60%] h-[80vh] flex flex-col p-0">
      <DialogHeader className="p-6 pb-4 border-b">
        <DialogTitle className="text-2xl">{title}</DialogTitle>
         <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
      </DialogHeader>
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 text-muted-foreground space-y-4">
          {children}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};


export default function SettingsPage() {

    const settingsItems = [
    {
      id: 'about',
      title: 'About FASTO',
      icon: FileText,
      content: (
        <>
            <p className="font-semibold text-foreground">A Note from the Creator</p>
            <p>
                FASTO was born from a vision to create a powerful, private, and free suite of AI tools accessible to everyone. Every aspect of this application—from the initial concept and design to the complex coding and development—was single-handedly managed and executed with relentless hard work and dedication by its founder, Mr. Sajid.
            </p>
             <p>
                There was no team, no external funding, and no corporate backing. Just one person's passion for technology and a commitment to building something truly useful. We hope FASTO empowers you in your creative and professional endeavors.
            </p>
        </>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: ShieldCheck,
      content: (
        <>
          <p className="font-semibold text-foreground">Your Privacy is Our Foundation</p>
          <p>
            FASTO is built on a fundamental principle: your data is yours, and yours alone. We have architected this application to ensure that your privacy is not just a policy, but a technical reality.
          </p>
          <h3 className="text-lg font-semibold text-foreground pt-2">Data Storage</h3>
          <p>
            All content you generate, including AI chat histories, saved tool outputs, and any other creations, is stored exclusively in the local storage of your web browser on your device. This means your data never touches our servers and is never seen by us. When you clear your browser data or uninstall the app, this information is permanently deleted.
          </p>
          <h3 className="text-lg font-semibold text-foreground pt-2">Authentication</h3>
          <p>
            The only piece of information managed externally is your authentication status, which is handled securely by Clerk.com. This service allows you to log in and protects your session, but it does not have access to the content you create within the app. Your user identity is kept separate from your generated data.
          </p>
           <h3 className="text-lg font-semibold text-foreground pt-2">No Tracking or Analytics</h3>
            <p>
              We do not use any tracking cookies or third-party analytics services to monitor your behavior within the app. Your usage patterns, the tools you use, and the content you create are not tracked or analyzed.
            </p>
             <p>
               Our commitment is to provide a powerful tool without compromising your privacy. You can use FASTO with the complete assurance that your work remains confidential and under your control.
            </p>
        </>
      ),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: Gavel,
      content: (
        <>
          <p>Welcome to FASTO. By using our application, you agree to these terms.</p>
          <h3 className="text-lg font-semibold text-foreground pt-2">1. Use of Service</h3>
          <p>
            FASTO provides a suite of AI-powered tools for content generation. The service is provided "as is" and is free of charge. You agree to use the service responsibly and not for any illegal or malicious activities.
          </p>
           <h3 className="text-lg font-semibold text-foreground pt-2">2. Content Ownership</h3>
            <p>
              You retain full ownership of any content you generate using FASTO. As all data is stored locally on your device, we have no claim or access to it. You are solely responsible for the content you create and its use.
            </p>
           <h3 className="text-lg font-semibold text-foreground pt-2">3. Disclaimer of Warranty</h3>
           <p>
             The service is provided without any warranties, express or implied. We do not guarantee that the service will be error-free or that the generated content will be accurate or fit for any particular purpose.
           </p>
            <h3 className="text-lg font-semibold text-foreground pt-2">4. Limitation of Liability</h3>
             <p>
                In no event shall FASTO or its founder, Mr. Sajid, be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FASTO's application.
            </p>
             <h3 className="text-lg font-semibold text-foreground pt-2">5. Changes to Terms</h3>
             <p>
               We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms & Conditions on this page.
            </p>
        </>
      ),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
       <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex items-center gap-4">
           <Link href="/chat" passHref>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
           </Link>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
            <p className="text-muted-foreground">Manage your application settings and view policies.</p>
          </div>
        </div>

         <div className="divide-y divide-border rounded-lg border">
            {settingsItems.map((item) => (
                <Dialog key={item.id}>
                    <DialogTrigger asChild>
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{item.title}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </DialogTrigger>
                    <PolicyContent title={item.title}>
                        {item.content}
                    </PolicyContent>
                </Dialog>
            ))}
        </div>
      </div>
    </div>
  );
}
