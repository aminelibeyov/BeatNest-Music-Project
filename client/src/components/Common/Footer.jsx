import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-slate-800 mt-16">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-green-500 text-2xl font-bold mb-4">♪ BeatNest</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              The ultimate music streaming platform where artists and music lovers connect. Discover millions of songs, stream on demand, and support independent creators.
            </p>
            <p className="text-slate-500 text-xs">Founded 2024 • Global Music Platform</p>
          </div>

          {/* Product Navigation */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wide">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-green-500 transition text-sm">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-slate-400 hover:text-green-500 transition text-sm">
                  🔍 Search Music
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-slate-400 hover:text-green-500 transition text-sm">
                  ⭐ Premium Plans
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-slate-400 hover:text-green-500 transition text-sm">
                  📚 My Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-green-500 transition text-sm">
                  📧 Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  ℹ️ About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  💼 Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  📰 Press
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  ❓ Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  🔒 Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  📋 Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-green-500 transition text-sm">
                  🍪 Cookie Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-900/50 rounded-lg p-8 mb-12 border border-slate-800">
          <h4 className="text-white font-bold mb-6 text-center">BeatNest by the Numbers</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-green-500 text-3xl font-bold">10M+</p>
              <p className="text-slate-400 text-sm mt-2">Songs Available</p>
            </div>
            <div>
              <p className="text-green-500 text-3xl font-bold">5K+</p>
              <p className="text-slate-400 text-sm mt-2">Independent Artists</p>
            </div>
            <div>
              <p className="text-green-500 text-3xl font-bold">1M+</p>
              <p className="text-slate-400 text-sm mt-2">Active Users</p>
            </div>
            <div>
              <p className="text-green-500 text-3xl font-bold">50+</p>
              <p className="text-slate-400 text-sm mt-2">Countries</p>
            </div>
          </div>
        </div>

        {/* Music Info */}
        <div className="mb-12 p-6 bg-slate-800/30 rounded-lg border border-slate-700">
          <h4 className="text-white font-bold mb-4">🎵 About Music on BeatNest</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            BeatNest celebrates all genres of music - from classical symphonies and jazz to hip-hop, pop, rock, electronic, and everything in between. We support emerging artists while honoring legendary musicians like Eminem, The Weeknd, Drake, and Billie Eilish. Our platform is built for music discovery, with features like personalized recommendations, mood-based playlists, and artist collaborations.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="text-slate-400 hover:text-green-500 transition" title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-green-500 transition" title="Twitter">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 002.856-3.51 10 10 0 01-2.836.856 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-green-500 transition" title="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08a11.824 11.824 0 01-4.123-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.010 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.010-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-green-500 transition" title="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Bottom Info */}
          <div className="text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm mb-2">
              © {currentYear} BeatNest. All rights reserved.
            </p>
            <p className="text-slate-600 text-xs">
              Made with 💚 | Empowering artists and music lovers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
