import React from 'react';
import { Bell, Moon, Search, Sun, PanelLeft, PanelRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { dark } from '@clerk/themes';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { toast } = useToast();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, open, setOpen } = useSidebar();
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };
  
  const handleNotificationClick = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  const handleSignIn = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    navigate(`/sign-in?redirect_url=${currentUrl}`);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setOpen(!open)}
            className="md:flex hidden mr-2 h-9 w-9 hover:bg-accent"
            aria-label="Toggle sidebar"
          >
            {open ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </Button>
          <SidebarTrigger className="md:hidden mr-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>
        
        <div className="hidden md:flex ml-auto relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="pl-8 w-[260px] bg-background"
          />
        </div>
        
        <div className="flex items-center ml-auto space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            aria-label="Toggle dark mode"
            onClick={toggleDarkMode}
            className="rounded-full h-9 w-9"
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNotificationClick}
            className="rounded-full h-9 w-9"
          >
            <Bell className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          
          {isSignedIn ? (
            <UserButton 
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonAvatarBox: "w-9 h-9",
                  userButtonBox: "w-9 h-9"
                }
              }}
              afterSignOutUrl="/"
              signInUrl="/sign-in"
            />
          ) : (
            <Button 
              variant="ghost" 
              className="rounded-full"
              onClick={handleSignIn}
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
