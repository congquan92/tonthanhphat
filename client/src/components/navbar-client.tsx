"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSmoothScroll } from "@/hook/useSmoothScroll";

type NavLink = {
    href: string;
    label: string;
    submenu?: { href: string; label: string }[];
};

interface NavbarClientProps {
    navLinks: NavLink[];
    companyName: string;
    companyShortName: string;
    companyTagline: string;
    phoneLink: string;
    zaloLink: string;
}

export function NavbarClient({ navLinks, companyName, companyShortName, companyTagline, phoneLink, zaloLink }: NavbarClientProps) {
    const { scrollToTop } = useSmoothScroll();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-background">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo & Navigation */}
                    <div className="flex items-center gap-8">
                        {/* Logo with Avatar */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <Avatar className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg">
                                <AvatarImage src="/logo.png" alt={companyName} className="object-cover" />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg rounded-lg">{companyShortName}</AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block">
                                <h1 className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">{companyName}</h1>
                                <p className="text-xs text-muted-foreground -mt-0.5">{companyTagline}</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <NavItem key={link.href} link={link} scrollToTop={scrollToTop} />
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Button asChild variant="secondary" size="lg" className="rounded-none underline-offset-4 hover:underline cursor-pointer">
                            <a href={zaloLink} target="_blank" rel="noopener noreferrer">
                                <Phone className="h-4 w-4" /> Liên Hệ Qua Zalo
                            </a>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="rounded-none underline-offset-4 hover:underline cursor-pointer">
                            <a href={phoneLink}>
                                <Phone className="h-4 w-4" /> Báo Giá Ngay
                            </a>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden" aria-label="Toggle menu">
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-[503px] pb-4" : "max-h-0"}`}>
                    <div className="flex flex-col gap-1 pt-2 border-t border-border">
                        {navLinks.map((link) => (
                            <MobileNavItem key={link.href} link={link} onClose={() => setIsMenuOpen(false)} scrollToTop={scrollToTop} />
                        ))}
                        <Button variant={"outline"} className="mt-2 rounded-none" asChild>
                            <a href={phoneLink}>
                                <Phone className="h-4 w-4" /> Báo Giá Ngay
                            </a>
                        </Button>
                        <Button variant={"outline"} className="mt-2 rounded-none" asChild>
                            <a href={zaloLink} target="_blank" rel="noopener noreferrer">
                                <Phone className="h-4 w-4" /> Liên Hệ Qua Zalo
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Desktop Navigation Item Component
function NavItem({ link, scrollToTop }: { link: NavLink; scrollToTop: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Check if current path matches this link or any of its submenu items
    const isActive = pathname === link.href || link.submenu?.some((sub) => pathname === sub.href);

    if (link.submenu && link.submenu.length > 0) {
        return (
            <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
                <Link href={link.href}>
                    <Button variant="ghost" className={`gap-1 ${isActive ? "font-bold border-b-2 border-black rounded-none" : ""}`}>
                        {link.label}
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </Button>
                </Link>

                {/* Dropdown Menu - No gap, use padding-top instead */}
                {isOpen && (
                    <div className="absolute left-0 top-full pt-1 z-50">
                        <div className="w-48 bg-white border border-gray-200 shadow-lg animate-in fade-in-0 zoom-in-95">
                            {link.submenu.map((subItem) => {
                                const isSubActive = pathname === subItem.href;
                                return (
                                    <Link key={subItem.href} href={subItem.href} className={`block px-4 py-2 text-sm transition-colors ${isSubActive ? "bg-gray-900 text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}`}>
                                        {subItem.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <Button variant="ghost" asChild className={isActive ? "font-bold border-b-2 border-black rounded-none" : ""} onClick={scrollToTop}>
            <Link href={link.href}>{link.label}</Link>
        </Button>
    );
}

// Mobile Navigation Item Component
function MobileNavItem({ link, onClose, scrollToTop }: { link: NavLink; onClose: () => void; scrollToTop: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const pathname = usePathname();
    const isActive = pathname === link.href || link.submenu?.some((sub) => pathname === sub.href);

    if (link.submenu && link.submenu.length > 0) {
        return (
            <div>
                <Button variant="ghost" className={`w-full justify-between ${isActive ? "font-bold bg-gray-100" : ""}`} onClick={() => setIsExpanded(!isExpanded)}>
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </Button>
                <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
                    <div className="pl-4 flex flex-col gap-1">
                        {link.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                                <Button key={subItem.href} variant="ghost" className={`justify-start ${isSubActive ? "font-bold bg-gray-900 text-white hover:bg-gray-800 hover:text-white" : "text-muted-foreground"}`} asChild>
                                    <Link href={subItem.href} onClick={onClose}>
                                        {subItem.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Button variant="ghost" className={`justify-start ${isActive ? "font-bold bg-gray-100" : ""}`} asChild onClick={scrollToTop}>
            <Link href={link.href} onClick={onClose}>
                {link.label}
            </Link>
        </Button>
    );
}
