'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Shield, FileText, Palmtree, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUser } from '@clerk/nextjs';


export default function SettingsPage() {
    const { user } = useUser();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto grid w-full max-w-4xl gap-8">
        <div>
            <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application preferences.</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>This is how others will see you on the site.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User Avatar"} />
                    <AvatarFallback>
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-background">
                    <Camera className="h-4 w-4" />
                     <span className="sr-only">Upload new picture</span>
                  </Button>
                </div>
                 <div className="grid w-full gap-1.5 flex-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.fullName || ''} />
                 </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.primaryEmailAddress?.emailAddress || ''} disabled />
                   <p className="text-xs text-muted-foreground">Your email address cannot be changed here.</p>
                </div>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
             <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-card">
           <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your FASTO experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                  <Label htmlFor="notifications-switch" className="font-semibold">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates about new features and content.</p>
                </div>
                <Switch id="notifications-switch" defaultChecked />
             </div>
             <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto">
                  <Label htmlFor="language-select" className="font-semibold">Language</Label>
                   <p className="text-sm text-muted-foreground">Choose your preferred language for the interface.</p>
                </div>
                <Select defaultValue="en">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Legal & Privacy</CardTitle>
            <CardDescription>Review our terms and policies.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/50">
            <Link href="#" className="flex items-center gap-3 py-4 hover:bg-muted/50 -mx-6 px-6 transition-colors">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Terms & Conditions</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 py-4 hover:bg-muted/50 -mx-6 px-6 transition-colors">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Privacy Policy</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 py-4 hover:bg-muted/50 -mx-6 px-6 transition-colors">
              <Palmtree className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">Cookie Policy</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-between items-center rounded-lg border border-destructive/30 bg-destructive/5 p-4">
             <div>
                <p className="font-semibold">Delete Your Account</p>
                <p className="text-sm text-muted-foreground">All of your data will be permanently removed.</p>
             </div>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => alert('Account deletion not implemented.')}
                    >
                        Delete My Account
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
