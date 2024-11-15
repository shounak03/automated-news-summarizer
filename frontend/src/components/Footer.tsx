import { Link } from "react-router-dom"

function Footer() {
  return (
   
      <footer className="border-t p-4 border-gray-600 bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
     <p className="text-xs text-gray-400">© 2023 News Summary App. All rights reserved.</p>
     <div className="flex space-x-4">
       <Link
         className="text-xs  text-gray-400 hover:text-purple-400 transition-colors"
         to="/terms-of-service"
         aria-label="Terms of Service"
       >
         Terms of Service
       </Link>
       <Link
         className="text-xs text-gray-400 hover:text-purple-400 transition-colors"
         to="/privacy-policy"
         aria-label="Privacy Policy"
       >
         Privacy
       </Link>
     </div>
   </div>
 </footer>
  )
}

export default Footer