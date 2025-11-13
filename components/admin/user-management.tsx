"use client"

import { Plus, Edit2, Trash2, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function UserManagement() {
  const [showAddUser, setShowAddUser] = useState(false)

  const users = [
    { id: 1, name: "Dr. Ahmed Hassan", email: "ahmed@health.pk", role: "Health Official", status: "active" },
    { id: 2, name: "Fatima Khan", email: "fatima@pharmacy.pk", role: "Pharmacist", status: "active" },
    { id: 3, name: "Mohammad Ali", email: "ali@lab.pk", role: "Lab Technician", status: "pending" },
    { id: 4, name: "Sara Malik", email: "sara@health.pk", role: "Health Official", status: "active" },
  ]

  return (
    <div className="space-y-8">
      {/* Add User Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">User Accounts</h2>
        <button
          onClick={() => setShowAddUser(!showAddUser)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-foreground mb-4">Create New User</h3>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="email"
                placeholder="Email"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Select Role</option>
                <option>Admin</option>
                <option>Health Official</option>
                <option>Pharmacist</option>
                <option>Lab Technician</option>
              </select>
              <input
                type="text"
                placeholder="Organization"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowAddUser(false)}
                className="border border-slate-300 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    {user.status === "active" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm flex gap-2">
                  <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                    <Edit2 className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
