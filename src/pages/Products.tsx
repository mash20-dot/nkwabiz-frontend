import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import {
  Product,
  createProduct,
  updateProduct,
  archiveProduct,
  searchProductsByName,
  getProductsByStatus,
} from "../utils/productApi";
import ProductFormModal from "../components/ProductFormModal";
import ProductSearchBar from "../components/ProductSearchBar";
import ProductTable from "../components/ProductTable";

const Products: React.FC = () => {
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState<
    "active" | "archived" | "all"
  >("active");
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalInitialData, setModalInitialData] = useState<Partial<Product>>(
    {}
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("add") === "true") {
      handleAddProduct();
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    getProductsByStatus(statusFilter)
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(() => {
        setProducts([]);
        toast.error("Could not load products.");
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  function handleAddProduct() {
    setModalMode("create");
    setModalInitialData({});
    setModalOpen(true);
  }

  function handleEditProduct(product: Product) {
    setModalMode("edit");
    setModalInitialData(product);
    setModalOpen(true);
  }

  async function handleCreateProduct(data: any) {
    setModalLoading(true);
    setModalError("");
    try {
      await createProduct(data);
      setModalOpen(false);
      setProducts((prev) => [
        ...prev,
        {
          ...data,
          id: Math.floor(Math.random() * 1000000),
          status:
            data.initial_stock === 0
              ? "Out of Stock"
              : data.initial_stock && data.initial_stock < 10
              ? "Low Stock"
              : "Active",
          price: `₵${data.selling_price.toFixed(2)}`,
          stock: data.initial_stock,
        } as Product,
      ]);
      toast.success("Product added successfully!");
    } catch (error: any) {
      setModalError(error.message || error.error || "Could not create product");
      toast.error("Failed to add product");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleUpdateProduct(data: any) {
    setModalLoading(true);
    setModalError("");
    try {
      const result = await updateProduct(modalInitialData.id as number, data);
      setModalOpen(false);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === modalInitialData.id ? { ...p, ...result.product } : p
        )
      );
      toast.success("Product updated successfully!");
    } catch (error: any) {
      setModalError(error.message || error.error || "Could not update product");
      toast.error("Failed to update product");
    } finally {
      setModalLoading(false);
    }
  }

  async function handleArchiveProduct(productId: number) {
    setArchiveLoading(productId);
    try {
      await archiveProduct(productId);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, status: "Archived" } : p))
      );
      toast.success("Product archived successfully!");
    } catch (error: any) {
      toast.error(error.message || "Could not archive product");
    } finally {
      setArchiveLoading(null);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchTerm) return;
    setSearchLoading(true);
    try {
      const result = await searchProductsByName(searchTerm);
      if (Array.isArray(result.products)) {
        setProducts(
          result.products.map((p: any, idx: number) => ({
            ...p,
            id: p.id ?? idx + 1,
            price: `₵${p.selling_price?.toFixed(2)}`,
            stock: p.initial_stock,
          }))
        );
        toast.success("Products filtered!");
      } else {
        toast.error(result.message || "No matching products found");
        setProducts([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Could not search products");
    } finally {
      setSearchLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleAddProduct}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </button>
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-4 sm:px-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  statusFilter === "active"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("archived")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  statusFilter === "archived"
                    ? "bg-gray-200 text-gray-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Archived
              </button>
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  statusFilter === "all"
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
            </div>
            <ProductSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              loading={searchLoading}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEditProduct}
              onArchive={handleArchiveProduct}
              archiveLoading={archiveLoading}
            />
          )}
        </div>
      </div>
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={
          modalMode === "create" ? handleCreateProduct : handleUpdateProduct
        }
        initialData={modalInitialData}
        mode={modalMode}
        loading={modalLoading}
        error={modalError}
      />
    </div>
  );
};

export default Products;