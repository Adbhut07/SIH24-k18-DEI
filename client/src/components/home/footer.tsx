import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About DRDO</h3>
            <p className="text-sm">
              The Defence Research and Development Organisation works towards enhancing India's defence capabilities through technological innovation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-blue-200">Careers</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Press Releases</Link></li>
              <li><Link href="#" className="hover:text-blue-200">Publications</Link></li>
              <li><Link href="#" className="hover:text-blue-200">RTI</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="text-sm not-italic">
              DRDO Bhawan, Rajaji Marg,<br />
              New Delhi - 110 011<br />
              Phone: +91-11-23007117<br />
              Email: <a href="mailto:info@drdo.gov.in" className="hover:text-blue-200">info@drdo.gov.in</a>
            </address>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Defence Research and Development Organisation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

