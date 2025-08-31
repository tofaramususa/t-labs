export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto text-center pt-32">
        <h1 className="text-5xl font-light mb-8 font-tobias">
          Pricing
        </h1>
        <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
          Simple, transparent pricing for your business needs.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Starter</h2>
            <div className="text-4xl font-bold mb-2">$29</div>
            <div className="text-gray-400 mb-8">/month</div>
            <p className="text-gray-300 mb-8">Perfect for small teams getting started</p>
            <button className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
          
          <div className="bg-gray-900 p-8 rounded-lg border border-white">
            <h2 className="text-2xl font-semibold mb-4">Pro</h2>
            <div className="text-4xl font-bold mb-2">$99</div>
            <div className="text-gray-400 mb-8">/month</div>
            <p className="text-gray-300 mb-8">For growing teams that need more power</p>
            <button className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}