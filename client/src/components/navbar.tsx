import { Phone, Mail } from "lucide-react";
import { ContactInfoApi } from "@/api/contacinfo.api";
import { CategoryApi } from "@/api/category.api";
import { ContactInfo } from "@/components/type";
import { NavbarClient } from "@/components/navbar-client";

export default async function Navbar() {
    const [contactRes, productCategoriesRes] = await Promise.all([ContactInfoApi.getContactInfo(), CategoryApi.getNavLinks()]);
    const contactInfo: ContactInfo = contactRes.data;
    const productCategories = productCategoriesRes.data;

    const navLinks = [
        { href: "/", label: "Trang Chủ" },
        {
            href: "/san-pham",
            label: "Sản Phẩm",
            submenu: productCategories, //  categories from database
        },
        { href: "/gioi-thieu", label: "Giới Thiệu" },
        { href: "/tin-tuc", label: "Tin Tức" },
        { href: "/bang-gia", label: "Bảng Giá" },
        { href: "/lien-he", label: "Liên Hệ" },
    ];

    const urlZalo = contactInfo.socialLinks.find((l) => l.platform.toLocaleLowerCase() === "zalo")?.url;
    const phoneLink = `tel:${contactInfo.companyPhone[0]?.replace(/\s/g, "")}`;
    return (
        <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground py-2 px-4">
                <div className="container mx-auto flex justify-between items-center text-sm">
                    <div className="flex items-center gap-6">
                        <a href={phoneLink} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Phone className="h-4 w-4" /> <span>{contactInfo.companyPhone[0]}</span>
                        </a>
                        <a href={`mailto:${contactInfo.companyEmail}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Mail className="h-4 w-4" />
                            <span>{contactInfo.companyEmail}</span>
                        </a>
                    </div>
                    <div className="hidden md:block font-medium">{contactInfo.companySlogan}</div>
                </div>
            </div>

            {/* Main Navbar - Client Component for interactivity */}
            <NavbarClient navLinks={navLinks} companyName={contactInfo.companyName} companyShortName={contactInfo.companyShortName} companyTagline={contactInfo.companyTagline} phoneLink={phoneLink} zaloLink={urlZalo ?? "#"} />
        </header>
    );
}
