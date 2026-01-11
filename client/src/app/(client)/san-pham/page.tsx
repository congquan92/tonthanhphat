import { ProductApi } from "@/api/product.api";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS_PER_PAGE = 20;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const productsRes = await ProductApi.getAllProducts(currentPage, PRODUCTS_PER_PAGE);

    const products = productsRes.data || [];
    const pagination = productsRes.pagination || { page: 1, pageSize: 20, total: 0, totalPages: 0 };

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
                        <span className="text-gray-900 font-medium">Sản phẩm</span>
                    </div>
                </div>
            </div>

            {/* Page Title */}
            <div className="border-b">
                <div className="container mx-auto p-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">Sản Phẩm</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Chưa có sản phẩm nào</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product: any) => (
                                <Link key={product.id} href={`/san-pham/${product.category?.slug || "uncategorized"}/${product.slug}`} className="group">
                                    <div className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                                        {/* Product Image */}
                                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                            {product.thumbnail ? (
                                                <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <span className="text-4xl">📦</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">{product.name}</h3>
                                            {product.shortDesc && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.shortDesc}</p>}

                                            {/* Category Badge */}
                                            {product.category && (
                                                <div className="mb-3">
                                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-300">{product.category.name}</span>
                                                </div>
                                            )}

                                            {/* View Details */}
                                            <div className="text-gray-900 font-medium text-sm group-hover:underline">Xem chi tiết →</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                {currentPage > 1 ? (
                                    <Link href={`/san-pham?page=${currentPage - 1}`} className="flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                                        <ChevronLeft size={18} />
                                        Trước
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
                                        <ChevronLeft size={18} />
                                        Trước
                                    </div>
                                )}

                                {/* Page Numbers */}
                                <div className="flex gap-2">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/san-pham?page=${page}`}
                                            className={`px-4 py-2 border font-medium transition-colors ${page === currentPage ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>

                                {currentPage < pagination.totalPages ? (
                                    <Link href={`/san-pham?page=${currentPage + 1}`} className="flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                                        Sau
                                        <ChevronRight size={18} />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
                                        Sau
                                        <ChevronRight size={18} />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
