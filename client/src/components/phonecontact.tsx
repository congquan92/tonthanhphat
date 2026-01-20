"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContactInfo } from "@/components/type";
import { Phone } from "lucide-react";
import Image from "next/image";

export default function PhoneContact({ contactInfo }: { contactInfo: ContactInfo }) {
    const urlZalo = contactInfo.socialLinks.find((l) => l.platform.toLocaleLowerCase() === "zalo")?.url;
    return (
        <TooltipProvider delayDuration={200}>
            <div className="fixed left-5 bottom-5 z-50 flex flex-col gap-5">
                {contactInfo.companyPhone.map((phone, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <a href={`tel:${phone}`} className="relative flex items-center justify-center">
                                <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-60"></span>
                                <Button
                                    variant="outline"
                                    className="relative cursor-pointer size-14 border-2 border-white rounded-full bg-green-500 text-white hover:scale-110 hover:bg-green-600 hover:text-white transition-all  flex items-center justify-center"
                                >
                                    <Phone className="size-7" />
                                </Button>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-semibold">
                            <p>Gọi ngay: {phone}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}

                {urlZalo && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <a href={urlZalo} target="_blank" rel="noreferrer" className="relative flex items-center justify-center">
                                <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-60"></span>
                                <Button className="relative size-14 border-2 border-white rounded-full bg-zinc-200 shadow-lg hover:scale-110 hover:bg-zinc-300 transition-all  overflow-hidden flex items-center justify-center cursor-pointer">
                                    <Image src="/zalo.png" alt="Zalo" fill className="object-contain p-1 size-full" priority />
                                </Button>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-bold">
                            <p>Chat Zalo</p>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
}
