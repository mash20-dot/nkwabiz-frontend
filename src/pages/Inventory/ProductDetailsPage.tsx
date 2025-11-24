import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsByStatus, archiveProduct } from "../../utils/productApi";
import SaleModal from "../../components/SaleModal";
import { toast } from "react-hot-toast";

export default function ProductDetailsPage() {
  const { name } = useParams<{ name: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProductsByStatus("all")
      .then((data) => {
        const found = data.products?.find((p: any) => p.product_name === name);
        setProduct(found || null);
      })
      .finally(() => setLoading(false));
  }, [name]);

  const handleArchive = async () => {
    if (!product?.id) return;
    try {
      await archiveProduct(product.id);
      toast.success("Product archived!");
      setProduct({ ...product, status: "Archived" });
    } catch (err: any) {
      toast.error(err.message || "Could not archive");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">{product.product_name}</h1>
      <div className="space-y-2">
        <div>Price: ₵{product.selling_price}</div>
        <div>Initial Stock: {product.initial_stock}</div>
        <div>Remaining Stock: {product.remaining_stock}</div>
        <div>Expires: {product.expiration_date}</div>
        <div>
          Status:{" "}
          <span
            className={
              product.status === "Archived" ? "text-gray-400" : "text-green-600"
            }
          >
            {product.status}
          </span>
        </div>
        {product.status !== "Archived" && (
          <button
            className="bg-red-400 text-white px-4 py-2 rounded mt-2"
            onClick={handleArchive}
          >
            Archive Product
          </button>
        )}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
          onClick={() => setSaleModalOpen(true)}
        >
          Sell Product
        </button>
      </div>
      <SaleModal
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        products={[product]}
      />
      <Link to="/products" className="block mt-6 text-blue-700">
        Back to Products
      </Link>
    </div>
  );
}
