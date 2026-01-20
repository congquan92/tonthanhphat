import { ContactInfoApi } from "@/api/contacinfo.api";
import Introduce from "@/components/introduce";
import { ContactInfo } from "@/components/type";
import BannerCarousel from "@/components/banner-carousel";
import ProductFet from "@/components/product-fet";
import { ProductApi } from "@/api/product.api";
import { BannerApi } from "@/api/banner.api";
import PostFet from "@/components/post-fet";
import { PostApi } from "@/api/post.api";
import Collaborate from "@/components/collaborate";
import ServiceFet from "@/components/service-fet";

export default async function Home() {
    const [contactRes, productRes, bannerRes, postRes] = await Promise.all([ContactInfoApi.getContactInfo(), ProductApi.getFeaturedProducts(10), BannerApi.getAllBanners(), PostApi.getFeaturedPosts(10)]);
    const contactInfo: ContactInfo = contactRes.data;
    const products = productRes.data || [];
    const banners = bannerRes.data || [];
    const posts = postRes.data || [];

    return (
        <div>
            <BannerCarousel banners={banners} />
            <Introduce data={contactInfo} />
            <ProductFet products={products} slogan={contactInfo.companySlogan} />
            <PostFet posts={posts} slogan={contactInfo.companySlogan} />
            <ServiceFet slogan={contactInfo.companySlogan} />
            <Collaborate />
        </div>
    );
}
