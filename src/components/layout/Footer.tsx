import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID!,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
        { user_email: email },
        process.env.REACT_APP_EMAILJS_USER_ID // or PUBLIC_KEY if using new EmailJS
      );
      setStatus('Subscription successful! Check your email.');
      setEmail('');
      toast.success('Successfully subscribed to newsletter!');
    } catch (error) {
      setStatus('Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="bg-brand-dark text-brand-light py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">StreetStyle</h3>
            <p className="text-gray-400 mb-4">
              The premier destination for all your streetwear and sneaker needs.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="https://instagram.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://twitter.com/yourpage" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/products/sneakers" className="text-gray-400 hover:text-primary transition-colors">Sneakers</Link></li>
              <li><Link to="/products/hoodies" className="text-gray-400 hover:text-primary transition-colors">Hoodies</Link></li>
              <li><Link to="/products/t-shirts" className="text-gray-400 hover:text-primary transition-colors">T-Shirts</Link></li>
              <li><Link to="/products/pants" className="text-gray-400 hover:text-primary transition-colors">Pants</Link></li>
              <li><Link to="/products/accessories" className="text-gray-400 hover:text-primary transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-primary transition-colors">Returns</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/size-guide" className="text-gray-400 hover:text-primary transition-colors">Size Guide</Link></li>
             
            </ul>
          </div>

         

        </div> {/* Close grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 */}

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} StreetStyle. All Rights Reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy-policy" className="text-gray-400 text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-400 text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
