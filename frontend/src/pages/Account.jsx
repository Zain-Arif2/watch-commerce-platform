import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { Link, useLocation } from "react-router-dom";
import { useGetCartQuery } from "../features/cart/cartApiSlice";
import { useGetWishlistQuery } from "../features/wishlist/wishlistApiSlice";
import { useGetMyOrdersQuery } from "../features/orders/ordersApiSlice";

const Account = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const location = useLocation();

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const { data: ordersData, isLoading: ordersLoading } =
    useGetMyOrdersQuery(undefined, {
      skip: !isAuthenticated,
    });

  const cartItems = cartData?.data?.items || [];
  const wishlistItems = wishlistData?.data?.products || [];
  const orders = ordersData?.data || [];

  const ordersCount = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  const activeSection =
    location.pathname.split("/")[2] || "dashboard";

  const navItems = [
    { label: "Dashboard", path: "/account", key: "dashboard" },
    { label: "My Orders", path: "/account/orders", key: "orders" },
    { label: "Saved Addresses", path: "/account/addresses", key: "addresses" },
    { label: "Account Settings", path: "/account/settings", key: "settings" },
  ];

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="bg-[#faf9f6] min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-serif mb-4">Account</h1>

          <p className="text-[#0b0b0c]/60 mb-8">
            Please login to access your dashboard
          </p>

          <Link
            to="/login"
            className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] transition-all text-white px-6 py-3 tracking-wide"
          >
            LOGIN NOW
          </Link>
        </div>
      </main>
    );
  }

  const renderSection = () => {
    if (activeSection === "orders") {
      return (
        <div className="bg-white border border-[#c8a45c]/20 p-8">
          <h2 className="text-2xl font-serif mb-6">My Orders</h2>

          {ordersLoading ? (
            <p className="text-[#0b0b0c]/60">Loading orders...</p>
          ) : ordersCount === 0 ? (
            <div>
              <p className="text-[#0b0b0c]/60 mb-6">
                You haven’t placed any orders yet.
              </p>

              <Link
                to="/shop"
                className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] text-white px-6 py-3"
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-[#c8a45c]/20 p-6"
                >
                  <p className="font-serif">
                    {order.orderItems?.length || 0} item(s)
                  </p>

                  <p className="text-sm text-[#0b0b0c]/60 capitalize">
                    Status: {order.orderStatus}
                  </p>

                  <p className="font-semibold mt-2">
                    ${(order.totalPrice || 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeSection === "addresses") {
      return (
        <div className="bg-white border border-[#c8a45c]/20 p-8">
          <h2 className="text-2xl font-serif mb-6">Saved Addresses</h2>

          <div className="border border-dashed border-[#c8a45c]/30 p-6 text-[#0b0b0c]/60">
            No saved addresses yet
          </div>
        </div>
      );
    }

    if (activeSection === "settings") {
      return (
        <div className="bg-white border border-[#c8a45c]/20 p-8">
          <h2 className="text-2xl font-serif mb-6">Account Settings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-[#c8a45c]/20 p-6">
              <p className="text-sm text-[#0b0b0c]/50">Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>

            <div className="border border-[#c8a45c]/20 p-6">
              <p className="text-sm text-[#0b0b0c]/50">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>

            <div className="border border-[#c8a45c]/20 p-6">
              <p className="text-sm text-[#0b0b0c]/50">Role</p>
              <p className="font-semibold capitalize">{user?.role}</p>
            </div>

            <div className="border border-[#c8a45c]/20 p-6">
              <p className="text-sm text-[#0b0b0c]/50">Security</p>
              <p className="font-semibold">Protected Account</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white border border-[#c8a45c]/20 p-6 text-center">
            <p className="text-3xl font-serif">{ordersCount}</p>
            <p className="text-[#0b0b0c]/60">Orders</p>
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-6 text-center">
            <p className="text-3xl font-serif">${totalSpent}</p>
            <p className="text-[#0b0b0c]/60">Total Spent</p>
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-6 text-center">
            <p className="text-3xl font-serif">{wishlistItems.length}</p>
            <p className="text-[#0b0b0c]/60">Wishlist</p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white border border-[#c8a45c]/20 p-8">
            <h2 className="text-xl font-serif mb-4">Cart</h2>

            <p className="text-[#0b0b0c]/60 mb-6">
              Items: {cartItems.length}
            </p>

            <Link
              to="/cart"
              className="inline-block bg-[#0b0b0c] hover:bg-[#a6813f] text-white px-6 py-3"
            >
              VIEW CART
            </Link>
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-8">
            <h2 className="text-xl font-serif mb-4">Activity</h2>

            <p className="text-[#0b0b0c]/60 mb-6">
              Account: {user?.email}
            </p>

            <Link
              to="/wishlist"
              className="text-[#a6813f] font-semibold hover:underline"
            >
              View Wishlist →
            </Link>
          </div>

        </div>
      </div>
    );
  };

  return (
    <main className="bg-[#faf9f6] text-[#0b0b0c] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Header */}
        <h1 className="text-5xl font-serif mb-12">My Account</h1>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <aside className="bg-white border border-[#c8a45c]/20 p-8">

            <div className="mb-8">
              <p className="font-serif text-lg">{user?.name}</p>
              <p className="text-sm text-[#0b0b0c]/60">{user?.email}</p>
            </div>

            <nav className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`block px-4 py-2 border transition-all ${
                    activeSection === item.key
                      ? "border-[#a6813f] text-[#a6813f]"
                      : "border-transparent text-[#0b0b0c]/70 hover:text-[#a6813f]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="mt-6 text-left text-[#a6813f] hover:underline"
              >
                Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <section className="lg:col-span-2">
            {renderSection()}
          </section>

        </div>
      </div>
    </main>
  );
};

export default Account;