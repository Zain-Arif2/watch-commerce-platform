import React from "react";
import { useSelector } from "react-redux";
import AdminLayout from "./AdminLayout";
import { useGetCustomersQuery } from "../../features/users/usersApiSlice";

const AdminCustomers = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetCustomersQuery();

  const customers = data?.data || [];
  const activeShoppers = customers.filter(
    (customer) => customer.role === "user"
  ).length;

  return (
    <AdminLayout>
      <main className="bg-[#faf9f6] min-h-screen p-10">

        {/* Header */}

        <div className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#a6813f] font-semibold mb-3">
            ADMIN PANEL
          </p>

          <h1 className="text-5xl font-serif text-[#0b0b0c] mb-4">
            Customers
          </h1>

          <p className="text-[#0b0b0c]/60 max-w-3xl leading-relaxed">
            View registered customers, monitor user activity and manage your
            ChronoLux community.
          </p>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-8 mb-12">

          <div className="bg-white border border-[#c8a45c]/20 p-8 hover:border-[#a6813f] transition-all duration-300">
            <h3 className="text-[#0b0b0c]/60 uppercase tracking-widest text-sm">
              Registered Customers
            </h3>

            <p className="text-5xl font-serif text-[#0b0b0c] mt-4">
              {customers.length}
            </p>
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-8 hover:border-[#a6813f] transition-all duration-300">
            <h3 className="text-[#0b0b0c]/60 uppercase tracking-widest text-sm">
              Active Shoppers
            </h3>

            <p className="text-5xl font-serif text-[#0b0b0c] mt-4">
              {activeShoppers}
            </p>
          </div>

          <div className="bg-white border border-[#c8a45c]/20 p-8 hover:border-[#a6813f] transition-all duration-300">
            <h3 className="text-[#0b0b0c]/60 uppercase tracking-widest text-sm">
              Current Admin
            </h3>

            <p className="text-5xl font-serif text-[#0b0b0c] mt-4">
              1
            </p>
          </div>

        </div>

        {/* Admin Profile */}

        <div className="bg-white border border-[#c8a45c]/20 p-10 mb-12">

          <h2 className="text-3xl font-serif text-[#0b0b0c] mb-8">
            Administrator Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-[#faf9f6] border border-[#c8a45c]/20 p-6">
              <p className="uppercase tracking-widest text-xs text-[#0b0b0c]/50 mb-2">
                Full Name
              </p>

              <p className="text-xl font-semibold text-[#0b0b0c]">
                {user?.name}
              </p>
            </div>

            <div className="bg-[#faf9f6] border border-[#c8a45c]/20 p-6">
              <p className="uppercase tracking-widest text-xs text-[#0b0b0c]/50 mb-2">
                Email
              </p>

              <p className="text-xl font-semibold text-[#0b0b0c]">
                {user?.email}
              </p>
            </div>

            <div className="bg-[#faf9f6] border border-[#c8a45c]/20 p-6">
              <p className="uppercase tracking-widest text-xs text-[#0b0b0c]/50 mb-2">
                Role
              </p>

              <span className="inline-block px-4 py-2 border border-[#a6813f] text-[#a6813f] uppercase tracking-widest text-sm">
                {user?.role}
              </span>
            </div>

            <div className="bg-[#faf9f6] border border-[#c8a45c]/20 p-6">
              <p className="uppercase tracking-widest text-xs text-[#0b0b0c]/50 mb-2">
                Status
              </p>

              <span className="inline-block px-4 py-2 bg-[#0b0b0c] text-white uppercase tracking-widest text-sm">
                Signed In
              </span>
            </div>

          </div>

        </div>

        {/* Customers Table */}

        <div className="bg-white border border-[#c8a45c]/20 overflow-hidden">

          <div className="px-8 py-6 border-b border-[#c8a45c]/20">
            <h2 className="text-3xl font-serif text-[#0b0b0c]">
              Customer Directory
            </h2>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-[#0b0b0c]/60">
              Loading customers...
            </div>
          ) : customers.length === 0 ? (
            <div className="py-20 text-center text-[#0b0b0c]/60">
              No customers found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-[#faf9f6]">

                  <tr>
                    <th className="text-left px-8 py-5 uppercase tracking-widest text-sm text-[#a6813f]">
                      Customer
                    </th>

                    <th className="text-left px-8 py-5 uppercase tracking-widest text-sm text-[#a6813f]">
                      Email
                    </th>

                    <th className="text-left px-8 py-5 uppercase tracking-widest text-sm text-[#a6813f]">
                      Role
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-t border-[#c8a45c]/10 hover:bg-[#faf9f6] transition-all"
                    >
                      <td className="px-8 py-6 font-semibold text-[#0b0b0c]">
                        {customer.name}
                      </td>

                      <td className="px-8 py-6 text-[#0b0b0c]/60">
                        {customer.email}
                      </td>

                      <td className="px-8 py-6">
                        <span className="border border-[#a6813f] text-[#a6813f] px-4 py-2 uppercase tracking-widest text-xs">
                          {customer.role}
                        </span>
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </main>
    </AdminLayout>
  );
};

export default AdminCustomers;