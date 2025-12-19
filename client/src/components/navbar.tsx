"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks, companyInfo, contactInfo } from "./data";

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
                        {/* Logo */}
                        <div className="flex items-center gap-6 justify-between">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <span className="text-primary-foreground font-bold text-lg lg:text-xl">{companyInfo.shortName}</span>
                                </div>
                                <div className="hidden sm:block">
                                    <h1 className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors">{companyInfo.name}</h1>
                                    <p className="text-xs text-muted-foreground -mt-0.5">{companyInfo.tagline}</p>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Button key={link.href} variant="ghost" asChild>
                                        <Link href={link.href}>{link.label}</Link>
                                    </Button>
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
                    <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
                        <div className="flex flex-col gap-1 pt-2 border-t border-border">
                            {navLinks.map((link) => (
                                <Button key={link.href} variant="ghost" className="justify-start" asChild>
                                    <Link href={link.href} onClick={() => setIsMenuOpen(false)}>
                                        {link.label}
                                    </Link>
                                </Button>
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
