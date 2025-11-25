import { useState, useEffect } from 'react';
import AdminLayout from '@components/admin/AdminLayout';
// Inline SVG components to avoid heroicons dependency
const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
  </svg>
);

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartBarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Load dashboard stats
    const loadStats = async () => {
      try {
        // Get products count
        const productsRes = await fetch('/api/products.json');
        const productsData = await productsRes.json();
        
        // Mock data for other stats
        setStats({
          totalProducts: productsData.data?.length || 52,
          totalOrders: 156,
          totalCustomers: 89,
          totalRevenue: 45670,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback stats
        setStats({
          totalProducts: 52,
          totalOrders: 156,
          totalCustomers: 89,
          totalRevenue: 45670,
        });
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders,
      icon: ChartBarIcon,
      color: 'bg-green-500',
      href: '/admin/orders',
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      href: '/admin/customers',
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      href: '/admin/orders',
    },
  ];

  const recentOrders = [
    { id: '#1001', customer: 'John Doe', product: 'Chanel No. 5', amount: '$120', status: 'Completed' },
    { id: '#1002', customer: 'Jane Smith', product: 'Dior Sauvage', amount: '$95', status: 'Processing' },
    { id: '#1003', customer: 'Mike Johnson', product: 'Tom Ford Black Orchid', amount: '$150', status: 'Shipped' },
    { id: '#1004', customer: 'Sarah Wilson', product: 'Calvin Klein Eternity', amount: '$75', status: 'Pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href={stat.href} className="font-medium text-cyan-700 hover:text-cyan-900">
                    View all
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Latest orders from your customers
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {order.customer.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{order.customer} • {order.product}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {order.amount}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <div className="text-sm">
              <a href="/admin/orders" className="font-medium text-cyan-700 hover:text-cyan-900">
                View all orders →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="/admin/products/add"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100">
                      <ShoppingBagIcon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" />
                      Add New Product
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Add a new perfume product to your store
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/categories"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 group-hover:bg-green-100">
                      <ChartBarIcon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" />
                      Manage Categories
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Organize your products into categories
                    </p>
                  </div>
                </a>

                <a
                  href="/admin/orders"
                  className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400"
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100">
                      <CurrencyDollarIcon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" />
                      View Orders
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Check and manage customer orders
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
