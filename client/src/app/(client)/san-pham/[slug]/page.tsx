import { ProductApi } from "@/api/product.api";
import { ContactInfoApi } from "@/api/contacinfo.api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, PhoneIcon } from "lucide-react";
import ProductImageGallery from "@/app/(client)/san-pham/_components/product-image-gallery";
import ProductCarousel from "@/app/(client)/san-pham/_components/product-carousel";

interface ProductDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    let productData;
    let contactInfo;
    let sameCategoryProducts;

    try {
        const [productRes, contactRes] = await Promise.all([ProductApi.getProductBySlug(slug), ContactInfoApi.getContactInfo()]);
        productData = productRes.data;
        contactInfo = contactRes.data;
        sameCategoryProducts = productRes.data.relatedProducts;
    } catch {
        notFound(); // trang mặc định 404 của Next.js
    }

    if (!productData) {
        notFound();
    }

    const { name, shortDesc, description, thumbnail, images, specs, category } = productData;

    // Get first phone and email from contact info
    const phone = Array.isArray(contactInfo?.companyPhone) ? contactInfo.companyPhone[0] : "0901 234 567";
    const email = contactInfo?.companyEmail || "info@tonthanhphat.vn";

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="border-b bg-gray-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <Link href="/san-pham" className="hover:text-gray-900">
                            Sản phẩm
                        </Link>
                        {category && (
                            <>
                                <span>/</span>
                                <span>{category.name}</span>
                            </>
                        )}
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Main Product Section */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left - Images */}
                    <ProductImageGallery images={images || ([thumbnail].filter(Boolean) as string[])} productName={name} />

                    {/* Right - Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{name}</h1>

                        {shortDesc && <p className="text-gray-600 mb-6 leading-relaxed">{shortDesc}</p>}

                        {/* Specifications */}
                        {specs && specs.length > 0 && (
                            <div className="border mb-6">
                                <div className="bg-gray-50 px-4 py-3 border-b">
                                    <h2 className="font-bold text-gray-900">Thông số sản phẩm</h2>
                                </div>
                                <div className="divide-y">
                                    {specs.map((spec: { key: string; value: string }, idx: number) => (
                                        <div key={idx} className="px-4 py-3 grid grid-cols-2 gap-4">
                                            <span className="text-gray-700">{spec.key}:</span>
                                            <span className="text-gray-900 font-medium text-right">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Section */}
                        <div className="mb-8 p-6 bg-gray-50 border">
                            <h3 className="text-lg font-bold mb-3 text-gray-900">Liên hệ</h3>
                            <div className="flex flex-col gap-3">
                                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-gray-700 hover:text-gray-900">
                                    <PhoneIcon className="h-5 w-5" /> {phone}
                                </a>
                                <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-700 hover:text-gray-900">
                                    <Mail className="h-5 w-5" /> {email}
                                </a>
                            </div>
                        </div>

                        {/* Social Share
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Chia sẻ:</p>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition">
                                    <span className="text-gray-700 text-xs">📧</span>
                                </button>
                                <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition">
                                    <span className="text-gray-700 text-xs">FB</span>
                                </button>
                                <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition">
                                    <span className="text-gray-700 text-xs">TW</span>
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-12 border">
                    <div className="flex border-b">
                        <button className="px-6 py-3 bg-gray-900 text-white font-medium">Thông tin sản phẩm</button>
                        <button className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition">Bình luận</button>
                    </div>
                    <div className="p-6">
                        {description ? (
                            <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700" dangerouslySetInnerHTML={{ __html: description }} />
                        ) : (
                            <p className="text-gray-600">Đang cập nhật thông tin chi tiết...</p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <ProductCarousel title="Sản phẩm cùng loại" products={sameCategoryProducts} itemsPerPage={4} />
            </div>
        </div>
    );
}
