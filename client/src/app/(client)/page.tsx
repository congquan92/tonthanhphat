import { CategoryApi } from "@/api/category.api";
import { ContactInfoApi } from "@/api/contacinfo.api";
import Introduce from "@/components/introduce";
import ProductCarousel from "@/components/product-carousel";
import { ContactInfo } from "@/components/type";

export default async function Home() {
    const [contactRes, navLinksRes] = await Promise.all([ContactInfoApi.getContactInfo(), CategoryApi.getNavLinks()]);
    const contactInfo: ContactInfo = contactRes.data;
    const navLinks = navLinksRes.data;
    console.log("Nav Links:", navLinksRes);
    return (
        <div>
            <ProductCarousel />
            <Introduce data={contactInfo} />
        </div>
    );
}
