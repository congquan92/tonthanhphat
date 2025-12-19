// "use client";

// import { Bell, Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { cn } from "@/lib/utils";

// interface AdminHeaderProps {
//     isSidebarCollapsed: boolean;
// }

// export function AdminHeader({ isSidebarCollapsed }: AdminHeaderProps) {
//     return (
//         <header
//             className={cn(
//                 "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl transition-all duration-300 dark:border-slate-700 dark:bg-slate-900/80",
//                 isSidebarCollapsed ? "left-18" : "left-65"
//             )}
//         >
//             {/* Right Section */}
//             <div className="flex items-center gap-2">
//                 {/* Theme Toggle */}
//                 <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
//                     <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//                     <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//                 </Button>

//                 {/* Notifications */}
//                 <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
//                     <Bell className="h-5 w-5" />
//                     <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
//                 </Button>

//                 {/* User Menu */}
//             </div>
//         </header>
//     );
// }
