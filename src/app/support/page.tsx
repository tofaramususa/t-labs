export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto pt-32">
        <h1 className="text-5xl font-light mb-8 font-tobias text-center">
          Support
        </h1>
        <p className="text-xl text-gray-400 mb-16 text-center">
          Get in touch with our team.
        </p>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg h-32"></textarea>
          </div>
          <button type="submit" className="w-full bg-white text-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
