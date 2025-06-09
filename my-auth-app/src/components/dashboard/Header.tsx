"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Logo from "@/components/icons/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, UserCircle, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => {
  const { logout } = useAuth();
  return (
    <>
      <Button variant={inSheet ? "ghost" : "ghost"} asChild className={inSheet ? "w-full justify-start" : ""}>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
      <Button variant={inSheet ? "ghost" : "ghost"} asChild className={inSheet ? "w-full justify-start" : ""}>
        <Link href="/dashboard/resumes">My Resumes</Link>
      </Button>
      <Button variant={inSheet ? "ghost" : "ghost"} asChild className={inSheet ? "w-full justify-start" : ""}>
        <Link href="/dashboard/templates">Templates</Link>
      </Button>
      {inSheet && <DropdownMenuSeparator />}
      {inSheet && (
         <Button variant="ghost" onClick={logout} className="w-full justify-start text-destructive hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      )}
    </>
  );
};


export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky px-8 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center">
          <Logo iconSize={6} textSize="text-xl" />
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks />
        </nav>

        <div className="flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profile_picture || `https://placehold.co/100x100.png?text=${user.first_name[0]}-${user.last_name[0]}`} alt={user.first_name || "User"} data-ai-hint="profile avatar" />
                    <AvatarFallback>{user.last_name}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-medium">{(user.first_name + " " + user.last_name) || "User"}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <div className="md:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
                <div className="p-6">
                    <Logo iconSize={6} textSize="text-xl" />
                </div>
                <nav className="flex flex-col p-4 space-y-2">
                    <NavLinks inSheet={true} />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
