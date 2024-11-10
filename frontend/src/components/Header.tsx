import { Newspaper } from 'lucide-react'

import { Link } from 'react-router-dom'


function Header() {
    return (
        <nav className="bg-gray-900 border-b border-gray-600 px-4 py-3">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <Newspaper className="h-6 w-6 text-purple-500" />
                    <span className="text-2xl font-bold text-purple-500">Readers.com</span>
                </Link>
                <div className="space-x-4">
                    <Link to="/about" className="text-white hover:text-purple-400 transition-colors">
                        About
                    </Link>
                    <a href="https://github.com/shounak03/automated-news-summarizer" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors">
                        Github
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default Header