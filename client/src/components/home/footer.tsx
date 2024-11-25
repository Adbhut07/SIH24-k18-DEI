import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ComputerIcon } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-white border-opacity-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Skill Matrix</h3>
            <p className="text-sm text-gray-400">Revolutionizing the interview process for teams worldwide.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Features', 'Testimonials', 'Pricing', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-sm text-gray-400">Email: info@Skill Matrix.com</p>
            <p className="text-sm text-gray-400">Phone: +1 (555) 123-4567</p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <ComputerIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <ComputerIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <ComputerIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <ComputerIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-2">Get the latest features and tips!</p>
            <form className="flex">
              <Input type="email" placeholder="Your email" className="mr-2 bg-gray-800 text-white border-gray-700" />
              <Button type="submit" className="bg-white text-black hover:bg-gray-200">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white border-opacity-10 text-center">
          <p className="text-sm text-gray-400">&copy; 2024 Skill Matrix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

