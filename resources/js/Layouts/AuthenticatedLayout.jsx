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
  Bell,
  PieChart,
  TrendingUp,
  Activity,
  Menu,
  X,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { props } = usePage();
    const user = props.auth.user;
    const [expandedItems, setExpandedItems] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { setAuth } = useAuthStore();

    // Initialize auth store with user data and token
    useEffect(() => {
        
        
        if (user && props.api_token) {
            setAuth(user, props.api_token);
        } else {
        }
    }, [user, props.api_token, setAuth]);

    // Navigation items for GCWM app
    const navigationSections = [
        {
            label: "MENU",
            items: [
                {
                    title: "Overview",
                    url: route('dashboard'),
                    icon: LayoutDashboard,
                    isActive: route().current('dashboard'),
                },
                // {
                //     title: "Statistics",
                //     url: "#",
                //     icon: PieChart,
                // },
                {
                    title: "Customers",
                    url: "/customers",
                    icon: Users,
                    isActive: route().current('customers.*'),
                },
                {
                    title: "Fleet",
                    url: "#",
                    icon: Truck,
                    hasSubmenu: true,
                    items: [
                        { title: "Vehicles", url: "/vehicles" },
                        { title: "Maintenance", url: "/maintenance" },
                        { title: "Drivers", url: "/drivers" },
                    ],
                },
                {
                    title: "Routes",
                    url: "/routes",
                    icon: Activity,
                    isActive: route().current('routes.*'),
                },
                {
                    title: "Collections",
                    url: "#",
                    icon: Trash2,
                    hasSubmenu: true,
                    items: [
                        { title: "Today's Collections", url: "#" },
                        { title: "Collection History", url: "#" },
                        { title: "Missed Collections", url: "#" },
                        { title: "Schedule", url: "#" },
                    ],
                },
                {
                    title: "Billing",
                    url: "#",
                    icon: CreditCard,
                    hasSubmenu: true,
                    items: [
                        { title: "Invoices", url: "#" },
                        { title: "Payments", url: "#" },
                        { title: "Plans", url: "#" },
                        { title: "Financial Reports", url: "#" },
                    ],
                },
                {
                    title: "Complaints",
                    url: "#",
                    icon: FileText,
                    badge: "3",
                },
            ]
        },
        {
            label: "GENERAL",
            items: [
                {
                    title: "Reports",
                    url: "#",
                    icon: BarChart3,
                    hasSubmenu: true,
                    items: [
                        { title: "Operational Reports", url: "#" },
                        { title: "Financial Reports", url: "#" },
                        { title: "Environmental Reports", url: "#" },
                        { title: "Analytics", url: "#" },
                    ],
                },
                {
                    title: "Settings",
                    url: "#",
                    icon: Settings,
                    hasSubmenu: true,
                    items: [
                        { title: "System Settings", url: "#" },
                        { title: "User Management", url: "#" },
                        { title: "Customer Categories", url: "/customer-categories" },
                        { title: "Integrations", url: "#" },
                    ],
                },
            ]
        }
    ];

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 sm:w-64 md:w-64
                bg-gradient-to-b from-green-800 to-green-900 text-white 
                flex flex-col min-h-full transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="p-4 sm:p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Recycle className="h-3 w-3 sm:h-4 sm:w-4 text-green-800" />
                        </div>
                        <span className="font-semibold text-base sm:text-lg truncate">GCWM</span>
                    </Link>
                    {/* Close button for mobile */}
                    <button
                        className="md:hidden p-1 hover:bg-green-700/50 rounded flex-shrink-0"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 min-h-0">
                    <ScrollArea className="h-full px-3 sm:px-4">
                        <div className="py-2">
                            {navigationSections.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="mb-6 sm:mb-8">
                                    <h3 className="text-xs font-semibold text-green-300 uppercase tracking-wider mb-2 sm:mb-3 px-2 sticky top-0  py-1">
                                        {section.label}
                                    </h3>
                                    <nav className="space-y-1">
                                        {section.items.map((item, index) => (
                                            <div key={index}>
                                                {item.hasSubmenu ? (
                                                    <>
                                                        <button
                                                            onClick={() => toggleExpanded(`${sectionIndex}-${index}`)}
                                                            className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-sm rounded-lg hover:bg-green-700/50 transition-colors min-w-0"
                                                        >
                                                            <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                            <span className="flex-1 text-left truncate">{item.title}</span>
                                                            {item.badge && (
                                                                <span className="bg-green-600 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                            {expandedItems[`${sectionIndex}-${index}`] ? (
                                                                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                            ) : (
                                                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                            )}
                                                        </button>
                                                        {expandedItems[`${sectionIndex}-${index}`] && (
                                                            <div className="ml-5 sm:ml-7 mt-1 space-y-1">
                                                                {item.items.map((subItem, subIndex) => (
                                                                    <Link
                                                                        key={subIndex}
                                                                        href={subItem.url}
                                                                        onClick={() => setSidebarOpen(false)}
                                                                        className="block px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-green-200 hover:text-white hover:bg-green-700/30 rounded-lg transition-colors truncate"
                                                                    >
                                                                        {subItem.title}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <Link
                                                        href={item.url}
                                                        onClick={() => setSidebarOpen(false)}
                                                        className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 text-sm rounded-lg transition-colors min-w-0 ${
                                                            item.isActive 
                                                                ? 'bg-green-700 text-white' 
                                                                : 'text-green-100 hover:bg-green-700/50 hover:text-white'
                                                        }`}
                                                    >
                                                        <item.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                        <span className="flex-1 truncate">{item.title}</span>
                                                        {item.badge && (
                                                            <span className="bg-green-600 text-white text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-0">
                {/* Mobile menu button - only visible on mobile */}
                <button
                    className="md:hidden fixed top-4 right-4 z-30 p-2 bg-white text-gray-600 hover:text-gray-900 rounded-lg shadow-lg border"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                {/* Floating Top Right Navigation */}
                <div className="fixed top-4 right-4 z-20 flex items-center gap-2 sm:gap-3">
                    {/* Mobile menu button is handled above */}
                    <div className="hidden md:flex items-center gap-2 sm:gap-3">
                        {/* Notifications */}
                        <button className="p-2 bg-white text-gray-400 hover:text-gray-600 rounded-lg shadow-lg border hover:shadow-xl transition-all">
                            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                        
                        {/* User Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-lg border hover:shadow-xl">
                                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=ffffff`} />
                                        <AvatarFallback className="bg-green-600 text-white text-xs sm:text-sm">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden lg:block text-left text-sm min-w-0">
                                        <p className="font-medium text-gray-900 truncate max-w-32">{user.name}</p>
                                        <p className="text-gray-500 text-xs truncate max-w-32">{user.email}</p>
                                    </div>
                                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hidden sm:block" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 sm:w-56">
                                <DropdownMenuLabel className="px-2 py-2">
                                    <div className="lg:hidden">
                                        <p className="font-medium text-sm">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="hidden lg:block">My Account</div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')} className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        View Profile
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
                    </div>
                </div>

                {/* Page Content - Full space from top-left */}
                <main className="flex-1 overflow-auto bg-gray-50 pt-0">
                    <div className="min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}