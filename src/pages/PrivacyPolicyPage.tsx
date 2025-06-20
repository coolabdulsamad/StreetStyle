import React from 'react';
import PageLayout from '@/components/layout/PageLayout';

const PrivacyPolicyPage: React.FC = () => (
  <PageLayout>
    <div className="container py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At StreetStyle, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal identification information (Name, email address, phone number, etc.)</li>
        <li>Order and payment information</li>
        <li>Usage data and cookies</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To process and fulfill your orders</li>
        <li>To improve our website and services</li>
        <li>To communicate with you about your orders or promotions</li>
        <li>To comply with legal obligations</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">How We Protect Your Information</h2>
      <p className="mb-4">
        We implement a variety of security measures to maintain the safety of your personal information. Your data is stored securely and is only accessible by authorized personnel.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p className="mb-4">
        We may use third-party services (such as payment processors) that have their own privacy policies. We encourage you to review their policies before providing any personal information.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at support@streetstyle.com.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="mb-4">
        We may update our Privacy Policy from time to time. Any changes will be posted on this page.
      </p>
      <p>
        If you have any questions about this Privacy Policy, please contact us at support@streetstyle.com.
      </p>
    </div>
  </PageLayout>
);

export default PrivacyPolicyPage;