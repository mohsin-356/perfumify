import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useRouter } from "next/router";
import { useProductsQuery } from "@framework/product/get-all-products";
import Image from "next/image";

// Random locations
const locations = [
  "New York, US",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Dubai, UAE",
  "Los Angeles, US",
  "Sydney, Australia",
  "Toronto, Canada",
  "Berlin, Germany",
  "Singapore",
  "Mumbai, India",
  "Milan, Italy",
];

// Random time ago messages
const timeAgoMessages = [
  "5 minutes ago",
  "12 minutes ago",
  "23 minutes ago",
  "35 minutes ago",
  "45 minutes ago",
  "1 hour ago",
  "2 hours ago",
  "3 hours ago",
];

const SocialProofNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [location, setLocation] = useState("");
  const [timeAgo, setTimeAgo] = useState("");
  const router = useRouter();

  const { data } = useProductsQuery({
    limit: 20, // Fetch 20 products to rotate through
  });

  // Show notification every 10 seconds
  useEffect(() => {
    const showNotification = () => {
      if (data?.pages?.[0]?.data && data.pages[0].data.length > 0) {
        // Get random product
        const products = data.pages[0].data;
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        // Get random location and time
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomTime = timeAgoMessages[Math.floor(Math.random() * timeAgoMessages.length)];
        
        setCurrentProduct(randomProduct);
        setLocation(randomLocation);
        setTimeAgo(randomTime);
        setIsVisible(true);

        // Auto-hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    };

    // Initial delay of 3 seconds, then show every 10 seconds
    const initialTimeout = setTimeout(() => {
      showNotification();
      
      // Set interval for subsequent notifications
      const interval = setInterval(showNotification, 10000);
      
      return () => clearInterval(interval);
    }, 3000);

    return () => clearTimeout(initialTimeout);
  }, [data]);

  const handleProductClick = () => {
    if (currentProduct?.slug) {
      router.push(`/products/${currentProduct.slug}`);
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentProduct) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-start p-4 space-x-3">
              {/* Product Image */}
              <div 
                className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                onClick={handleProductClick}
              >
                <Image
                  src={currentProduct.image?.thumbnail || "/assets/placeholder/products/product-grid.svg"}
                  alt={currentProduct.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-sm font-semibold text-heading hover:text-black cursor-pointer truncate"
                  onClick={handleProductClick}
                >
                  {currentProduct.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Customer recently purchased from <span className="font-medium">{location}</span>
                </p>
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {timeAgo}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close notification"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofNotification;
