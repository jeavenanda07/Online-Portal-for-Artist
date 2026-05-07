import { FaInstagram } from "react-icons/fa";
import { RiGithubLine } from "react-icons/ri";
import { FiFacebook } from "react-icons/fi";

import Logo from "../ui/Logo";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-primary/40 backdrop-blur-xl mt-20">
      
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-14">

        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row justify-between gap-16">

          {/* LEFT SIDE */}
          <div className="max-w-md w-full">

            <div className="mb-6">
              <Logo />
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              Discover, collect, and organize inspiring artworks from creators
              around the world. Build your own creative workspace and stay
              connected with the art community.
            </p>

            {/* NEWSLETTER */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">

              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-secondary border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#00d26a]/50 transition-all placeholder:text-zinc-500"
              />

              <button className="bg-gradient-primary px-6 py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-16">

            {/* LEARN MORE */}
            <div>
              <h6 className="text-sm font-black uppercase tracking-[0.2em] mb-5 text-white">
                Learn More
              </h6>

              <ul className="space-y-3 text-sm text-zinc-400">

                <li>
                  <Link
                    href="/about"
                    className="hover:text-[#00d26a] transition-colors"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faq"
                    className="hover:text-[#00d26a] transition-colors"
                  >
                    FAQ
                  </Link>
                </li>

                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-[#00d26a] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h6 className="text-sm font-black uppercase tracking-[0.2em] mb-5 text-white">
                Contact
              </h6>

              <ul className="space-y-3 text-sm text-zinc-400">

                <li>
                  <Link
                    href="tel:+639123456789"
                    className="hover:text-[#00d26a] transition-colors"
                  >
                    +63 912 345 6789
                  </Link>
                </li>

                <li>
                  <Link
                    href="mailto:support@yourapp.com"
                    className="hover:text-[#00d26a] transition-colors break-all"
                  >
                    support@yourapp.com
                  </Link>
                </li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h6 className="text-sm font-black uppercase tracking-[0.2em] mb-5 text-white">
                Social Media
              </h6>

              <div className="flex items-center gap-4">

                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-secondary flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00d26a]/50 hover:bg-[#00d26a]/10 transition-all"
                >
                  <FaInstagram size={18} />
                </Link>

                <Link
                  href="https://github.com"
                  target="_blank"
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-secondary flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00d26a]/50 hover:bg-[#00d26a]/10 transition-all"
                >
                  <RiGithubLine size={18} />
                </Link>

                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="w-11 h-11 rounded-2xl border border-white/10 bg-secondary flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00d26a]/50 hover:bg-[#00d26a]/10 transition-all"
                >
                  <FiFacebook size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-zinc-500 text-center sm:text-left">
            © 2026 Your Platform. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-zinc-500">

            <Link
              href="/terms"
              className="hover:text-[#00d26a] transition-colors"
            >
              Terms
            </Link>

            <Link
              href="/privacy-policy"
              className="hover:text-[#00d26a] transition-colors"
            >
              Privacy
            </Link>

            <Link
              href="/cookies"
              className="hover:text-[#00d26a] transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}