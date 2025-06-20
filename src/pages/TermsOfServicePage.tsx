import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

const TermsOfServicePage: React.FC = () => (
  <PageLayout>
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        Welcome to StreetStyle! By using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Our Website</h2>
      <p className="mb-4">
        You agree to use our website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the site.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Product Information</h2>
      <p className="mb-4">
        We strive to ensure that all product descriptions and prices are accurate. However, errors may occur. We reserve the right to correct any errors and to change or update information at any time without prior notice.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Orders & Payments</h2>
      <p className="mb-4">
        By placing an order, you agree to provide current, complete, and accurate purchase and account information. We reserve the right to refuse or cancel any order for any reason.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Intellectual Property</h2>
      <p className="mb-4">
        All content on this site, including text, graphics, logos, and images, is the property of StreetStyle or its content suppliers and is protected by copyright laws.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
      <p className="mb-4">
        StreetStyle is not liable for any damages arising from the use or inability to use this website or from any information, content, materials, or products included on or otherwise made available to you through the site.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page.
      </p>
      <p>
        If you have any questions about our Terms of Service, please contact us at support@streetstyle.com.
      </p>
    </div>
  </PageLayout>
);

export default TermsOfServicePage;