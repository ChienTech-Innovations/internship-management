import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1db0ff] to-[#1291fe] text-white py-12">
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/tma.webp"
                width={120}
                height={40}
                alt="InternHub logo"
              />
              <h1 className="text-4xl font-bold">InternHub</h1>
            </div>
            <p className="text-base leading-relaxed">
              Empowering the next generation through structured internship
              programs.
            </p>
          </div>

          {/* Product Links */}
          <div className="pl-20">
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <span className="hover:text-yellow-300 transition">
                  Features
                </span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">
                  Pricing
                </span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">Demo</span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">API</span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="pl-20">
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <span className="hover:text-yellow-300 transition">About</span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">Blog</span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">
                  Careers
                </span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="pl-20">
            <h3 className="text-base font-semibold mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <span className="hover:text-yellow-300 transition">
                  Help Center
                </span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">
                  Documentation
                </span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">
                  Community
                </span>
              </li>
              <li>
                <span className="hover:text-yellow-300 transition">Status</span>
              </li>
            </ul>
          </div>

          {/* Follow Social Icons (Demo) */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold uppercase tracking-wider">
              Follow Internship
            </h3>

            <div className="flex gap-4">
              <div className="bg-white p-2 rounded-full">
                <FaFacebookF size={24} className="text-[#00A3FF]" />
              </div>
              <div className="bg-white p-2 rounded-full">
                <FaInstagram size={24} className="text-[#00A3FF]" />
              </div>
              <div className="bg-white p-2 rounded-full">
                <FaTiktok size={24} className="text-[#00A3FF]" />
              </div>
              <div className="bg-white p-2 rounded-full">
                <FaYoutube size={24} className="text-[#00A3FF]" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white mt-12 pt-6 text-center text-base">
          &copy; {new Date().getFullYear()} InternHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
