export interface Address {
    type: string;
    address: string;
}

export interface SocialLink {
    url: string;
    icon: string;
    platform: string;
}

export interface ContactInfo {
    id: string;
    companyName: string;
    companyShortName: string;
    companyTagline: string;
    companySlogan: string;
    companyDescription: string;
    companyEmail: string;
    companyPhone: string[];
    addresses: Address[];
    socialLinks: SocialLink[];
    createdAt: Date;
    updatedAt: Date;
}
