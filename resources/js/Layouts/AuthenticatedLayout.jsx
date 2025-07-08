import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  CreditCard,
  Trash2,
  Recycle,
  BarChart3,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const user = props.auth.user;
    const [expandedItems, setExpandedItems] = useState({});
    const { setAuth } = useAuthStore();

    // Initialize auth store with user data and token
    useEffect(() => {
        console.log('🔄 AuthenticatedLayout effect:', { 
            hasUser: !!user, 
            hasToken: !!props.api_token,
            userName: user?.name,
            tokenPreview: props.api_token ? props.api_token.substring(0, 10) + '...' : 'none'
        });
        
        if (user && props.api_token) {
            console.log('🔑 Initializing auth from AuthenticatedLayout', {
                user: user.name,
                role: user.role,
                token: props.api_token.substring(0, 10) + '...'
            });
            setAuth(user, props.api_token);
        } else {
            console.log('⚠️ Missing auth data in AuthenticatedLayout', {
                missingUser: !user,
                missingToken: !props.api_token
            });
        }
    }, [user, props.api_token, setAuth]);

    // Navigation items for waste management system
    const navigationItems = [
        {
            title: "Dashboard",
            url: route('dashboard'),
            icon: LayoutDashboard,
            isActive: route().current('dashboard'),
        },
        {
            title: "Customer Management",
            url: "#",
            icon: Users,
            items: [
                { title: "All Customers", url: "/customers" },
                { title: "Customer Categories", url: "/customer-categories" },
                { title: "Service Requests", url: "#" },
                { title: "Complaints", url: "#" },
            ],
        },
        {
            title: "Fleet Management",
            url: "#",
            icon: Truck,
            items: [
                { title: "Vehicles", url: "/vehicles" },
                { title: "Routes", url: "/routes" },
                { title: "Drivers", url: "/drivers" },
                { title: "Maintenance", url: "#" },
            ],
        },
        {
            title: "Inventory",
            url: "#",
            icon: Package,
            items: [
                { title: "Bins & Containers", url: "#" },
                { title: "Equipment", url: "#" },
                { title: "Tracking", url: "#" },
            ],
        },
        {
            title: "Billing",
            url: "#",
            icon: CreditCard,
            items: [
                { title: "Invoices", url: "#" },
                { title: "Payments", url: "#" },
                { title: "Financial Reports", url: "#" },
            ],
        },
        {
            title: "Waste Collection",
            url: "#",
            icon: Trash2,
            items: [
                { title: "Collection Schedule", url: "#" },
                { title: "Pickup Tracking", url: "#" },
                { title: "Missed Collections", url: "#" },
            ],
        },
        {
            title: "Recycling(Coming soon)",
            url: "#",
            icon: Recycle,
            // items: [
            //     { title: "Sorting Process", url: "#" },
            //     { title: "Recycling Centers", url: "#" },
            //     { title: "Disposal Records", url: "#" },
            // ],
        },
        {
            title: "Reports",
            url: "#",
            icon: BarChart3,
            items: [
                { title: "Operational Reports", url: "#" },
                { title: "Sustainability Reports", url: "#" },
                { title: "Analytics", url: "#" },
            ],
        },
        {
            title: "Compliance(Coming soon)",
            url: "#",
            icon: FileText,
            // items: [
            //     { title: "Environmental Records", url: "#" },
            //     { title: "Permits & Licenses", url: "#" },
            //     { title: "Government Reports", url: "#" },
            // ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
            items: [
                { title: "System Settings", url: "#" },
                { title: "User Management", url: "#" },
                { title: "Integrations", url: "#" },
            ],
        },
    ];

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-8 w-8 fill-current text-sidebar-foreground" />
                        <span className="font-semibold text-sidebar-foreground">GCWM</span>
                    </Link>
                </SidebarHeader>

                <SidebarContent>
                    <ScrollArea className="flex-1 px-3">
                        <SidebarGroup>
                            {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {navigationItems.map((item, index) => (
                                        <SidebarMenuItem key={index}>
                                            {item.items ? (
                                                <>
                                                    <SidebarMenuButton 
                                                        onClick={() => toggleExpanded(index)}
                                                        className="w-full justify-between hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="h-4 w-4 shrink-0" />
                                                            <span className="truncate">{item.title}</span>
                                                        </div>
                                                        {expandedItems[index] ? (
                                                            <ChevronDown className="h-4 w-4 shrink-0" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4 shrink-0" />
                                                        )}
                                                    </SidebarMenuButton>
                                                    {expandedItems[index] && (
                                                        <div className="ml-7 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                                                            {item.items.map((subItem, subIndex) => (
                                                                <SidebarMenuButton key={subIndex} asChild size="sm">
                                                                    <Link 
                                                                        href={subItem.url}
                                                                        className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
                                                                    >
                                                                        <span className="truncate">{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuButton>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <SidebarMenuButton asChild isActive={item.isActive}>
                                                    <Link href={item.url} className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                                        <item.icon className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </ScrollArea>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton size="lg">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} />
                                            <AvatarFallback>
                                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                        <ChevronDown className="ml-auto h-4 w-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('profile.edit')} className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button"
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="h-4 w-px bg-sidebar-border" />
                    {header && (
                        <div className="flex-1">
                            {header}
                        </div>
                    )}
                </header>
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}