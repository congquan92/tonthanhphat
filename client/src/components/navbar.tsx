"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { navLinks, companyInfo, contactInfo, type NavLink } from "./data";

// Desktop Navigation Item Component
function NavItem({ link }: { link: NavLink }) {
    if (link.submenu) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                        {link.label}
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    {link.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.href} asChild>
                            <Link href={subItem.href}>{subItem.label}</Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return (
        <Button variant="ghost" asChild>
            <Link href={link.href}>{link.label}</Link>
        </Button>
    );
}

// Mobile Navigation Item Component
function MobileNavItem({ link, onClose }: { link: NavLink; onClose: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (link.submenu) {
        return (
            <div>
                <Button variant="ghost" className="w-full justify-between" onClick={() => setIsExpanded(!isExpanded)}>
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </Button>
                <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
                    <div className="pl-4 flex flex-col gap-1">
                        {link.submenu.map((subItem) => (
                            <Button key={subItem.href} variant="ghost" className="justify-start text-muted-foreground" asChild>
                                <Link href={subItem.href} onClick={onClose}>
                                    {subItem.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Button variant="ghost" className="justify-start" asChild>
            <Link href={link.href} onClick={onClose}>
                {link.label}
            </Link>
        </Button>
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground py-2 px-4">
                <div className="container mx-auto flex justify-between items-center text-sm">
                    <div className="flex items-center gap-6">
                        <a href={contactInfo.phoneLink} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Phone className="h-4 w-4" />
                            <span>{contactInfo.phone}</span>
                        </a>
                        <a href={contactInfo.emailLink} className="hidden sm:flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Mail className="h-4 w-4" />
                            <span>{contactInfo.email}</span>
                        </a>
                    </div>
                    <div className="hidden md:block font-medium">{companyInfo.slogan}</div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        {/* Logo & Navigation */}
                        <div className="flex items-center gap-8">
                            {/* Logo with Avatar */}
                            <Link href="/" className="flex items-center gap-3 group">
                                <Avatar className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg">
                                    <AvatarImage src={companyInfo.logo} alt={companyInfo.name} className="object-cover" />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg rounded-lg">{companyInfo.shortName}</AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:block">
                                    <h1 className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">{companyInfo.name}</h1>
                                    <p className="text-xs text-muted-foreground -mt-0.5">{companyInfo.tagline}</p>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <NavItem key={link.href} link={link} />
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Button asChild>
                                <a href={contactInfo.phoneLink}>
                                    <Phone className="h-4 w-4" />
                                    Báo Giá Ngay
                                </a>
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden" aria-label="Toggle menu">
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-[500px] pb-4" : "max-h-0"}`}>
                        <div className="flex flex-col gap-1 pt-2 border-t border-border">
                            {navLinks.map((link) => (
                                <MobileNavItem key={link.href} link={link} onClose={() => setIsMenuOpen(false)} />
                            ))}
                            <Button className="mt-2" asChild>
                                <a href={contactInfo.phoneLink}>
                                    <Phone className="h-4 w-4" />
                                    Báo Giá Ngay
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
