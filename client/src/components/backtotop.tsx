"use client";
import { Button } from "@/components/ui/button";
import { useSmoothScroll } from "@/hook/useSmoothScroll";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackToTop() {
    const { scrollToTop } = useSmoothScroll();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    return (
        <>
            {isVisible && (
                <Button variant="secondary" onClick={() => scrollToTop()} size="icon-lg" className="fixed bottom-5 right-5 z-50 rounded-none border border-black text-black bg-fuchsia-50 hover:bg-fuchsia-100 hover:scale-105 cursor-pointer">
                    <ArrowUp className="size-7" />
                </Button>
            )}
        </>
    );
}
