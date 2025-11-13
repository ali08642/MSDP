"use client"
import { useState } from "react"
import { Trash2, Plus, Minus, ShoppingCart, Receipt, Clock, AlertCircle, CheckCircle, Search } from "lucide-react"

interface CartItem {
  id: string
  medicine: string
  quantity: number
  disease: string
  unitPrice: number
}

interface Transaction {
  id: string
  date: string
  time: string
  items: CartItem[]
  total: number
}

const MEDICINE_CATALOG = {
  Malaria: [
    { id: "m1", name: "Basoquin", price: 150 },
    { id: "m2", name: "Amdaquin", price: 140 },
    { id: "m3", name: "Amoquine", price: 130 },
    { id: "m4", name: "Fansidar", price: 160 },
    { id: "m5", name: "Coartem", price: 200 },
  ],
  Dengue: [
    { id: "d1", name: "Panadol", price: 50 },
    { id: "d2", name: "Calpol", price: 55 },
    { id: "d3", name: "Febrol", price: 60 },
    { id: "d4", name: "Vitamin C", price: 80 },
    { id: "d5", name: "Folic Acid", price: 70 },
  ],
  "COVID-19": [
    { id: "c1", name: "Panadol", price: 50 },
    { id: "c2", name: "Calpol", price: 55 },
    { id: "c3", name: "Disprol", price: 65 },
    { id: "c4", name: "Vitamin C", price: 80 },
    { id: "c5", name: "Medisol", price: 45 },
  ],
  Pneumonia: [
    { id: "p1", name: "Medilact-D", price: 120 },
    { id: "p2", name: "Plasaline", price: 90 },
    { id: "p3", name: "Hartmann", price: 110 },
    { id: "p4", name: "Dextrone", price: 85 },
    { id: "p5", name: "Flagyl", price: 100 },
  ],
  Diarrhea: [
    { id: "dr1", name: "Pedialyte", price: 120 },
    { id: "dr2", name: "ORS-L", price: 40 },
    { id: "dr3", name: "Hydral", price: 50 },
    { id: "dr4", name: "Zincolak", price: 95 },
    { id: "dr5", name: "Enterogermina", price: 140 },
  ],
}

export default function PharmacyPOSInterface() {
  const [selectedDisease, setSelectedDisease] = useState<string>("Malaria")
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [view, setView] = useState<"pos" | "history">("pos")

  const filteredMedicines =
    MEDICINE_CATALOG[selectedDisease as keyof typeof MEDICINE_CATALOG]?.filter((med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  const addToCart = (medicine: { id: string; name: string; price: number }) => {
    setError("")
    const existingItem = cart.find((item) => item.id === medicine.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([
        ...cart,
        {
          id: medicine.id,
          medicine: medicine.name,
          quantity: 1,
          disease: selectedDisease,
          unitPrice: medicine.price,
        },
      ])
    }
    setSuccess("")
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

  const completeTransaction = async () => {
    if (cart.length === 0) {
      setError("Cart is empty. Please add items before completing transaction.")
      return
    }

    try {
      const transaction: Transaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        items: [...cart],
        total: calculateTotal(),
      }

      setLastTransaction(transaction)
      setTransactions([transaction, ...transactions])
      setShowReceipt(true)
      setCart([])
      setSuccess("Transaction completed successfully!")

      setTimeout(() => {
        setShowReceipt(false)
        setSuccess("")
      }, 3000)
    } catch (err) {
      setError("Failed to complete transaction. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pharmacy POS System</h1>
            <p className="text-cyan-100">MSDP - Data Collection Terminal</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-cyan-100">Operator ID: PHM-001</p>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-300 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setView("pos")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              view === "pos"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            POS Terminal
          </button>
          <button
            onClick={() => setView("history")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              view === "history"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Transaction History
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {view === "pos" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Disease Category */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <h2 className="font-semibold text-lg mb-4 text-slate-900">Select Disease Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.keys(MEDICINE_CATALOG).map((disease) => (
                    <button
                      key={disease}
                      onClick={() => {
                        setSelectedDisease(disease)
                        setSearchTerm("")
                      }}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                        selectedDisease === disease
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {disease}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search & Product List */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-slate-900">{medicine.name}</p>
                          <p className="text-sm text-slate-600">Rs {medicine.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => addToCart(medicine)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No medicines found</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Cart & Checkout */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 h-fit sticky top-32">
              <h2 className="font-semibold text-lg mb-4 text-slate-900">Shopping Cart</h2>

              {cart.length === 0 ? (
                <p className="text-center text-slate-500 py-8">Cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <p className="font-medium text-sm text-slate-900">{item.medicine}</p>
                        <p className="text-xs text-slate-600 mb-2">Rs {item.unitPrice.toFixed(2)}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 bg-white rounded border border-slate-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-medium text-sm">Rs {(item.quantity * item.unitPrice).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-slate-300 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-slate-600">Subtotal:</p>
                      <p className="font-medium">Rs {calculateTotal().toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-cyan-600">
                      <p>Total:</p>
                      <p>Rs {calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={completeTransaction}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Receipt className="w-4 h-4" />
                    Complete Sale
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* History View */
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="font-semibold text-xl mb-6 text-slate-900">Transaction History</h2>
            {transactions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No transactions today</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {transactions.map((txn) => (
                  <div key={txn.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">{txn.id}</p>
                        <p className="text-sm text-slate-600">
                          {txn.date} at {txn.time}
                        </p>
                      </div>
                      <p className="font-bold text-cyan-600">Rs {txn.total.toFixed(2)}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p>{txn.items.length} item(s) sold</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
