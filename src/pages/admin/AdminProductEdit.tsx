
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import AdminProductForm from './AdminProductForm';
import ProductVariantList from './ProductVariantList';

const AdminProductEdit: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin/products');
  };
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
        
        <div className="space-y-8">
          <AdminProductForm productId={productId} />
          
          {productId && (
            <ProductVariantList productId={productId} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminProductEdit;
