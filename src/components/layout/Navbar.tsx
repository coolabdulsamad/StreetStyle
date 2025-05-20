
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Search, ShoppingCart, Heart, User, Menu, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 py-6">
                <Link to="/" className="text-xl font-bold">StreetStyle</Link>
                <nav className="flex flex-col gap-4">
                  <Link to="/" className="text-lg hover:text-primary">Home</Link>
                  <Link to="/products/sneakers" className="text-lg hover:text-primary">Sneakers</Link>
                  <Link to="/products/hoodies" className="text-lg hover:text-primary">Hoodies</Link>
                  <Link to="/products/t-shirts" className="text-lg hover:text-primary">T-Shirts</Link>
                  <Link to="/products/pants" className="text-lg hover:text-primary">Pants</Link>
                  <Link to="/products/accessories" className="text-lg hover:text-primary">Accessories</Link>
                  {isAdmin() && (
                    <Link to="/admin" className="text-lg hover:text-primary">Admin</Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link to="/" className="font-bold text-2xl">
            StreetStyle
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/" className="font-medium hover:text-primary transition-colors">Home</Link>
            <Link to="/products/sneakers" className="font-medium hover:text-primary transition-colors">Sneakers</Link>
            <Link to="/products/hoodies" className="font-medium hover:text-primary transition-colors">Hoodies</Link>
            <Link to="/products/t-shirts" className="font-medium hover:text-primary transition-colors">T-Shirts</Link>
            <Link to="/products/pants" className="font-medium hover:text-primary transition-colors">Pants</Link>
            <Link to="/products/accessories" className="font-medium hover:text-primary transition-colors">Accessories</Link>
            {isAdmin() && (
              <Link to="/admin" className="font-medium hover:text-primary transition-colors">Admin</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[200px] lg:w-[300px] pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </button>
          </form>

          {/* Mobile search button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => navigate('/search')}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Wishlist */}
          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
