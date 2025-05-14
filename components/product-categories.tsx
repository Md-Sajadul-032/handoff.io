import Link from "next/link"
import { Smartphone, Laptop, Bike, BookOpen } from "lucide-react"

const categories = [
  {
    name: "Phone",
    icon: <Smartphone className="h-8 w-8" />,
    subcategories: ["Feature Phone", "Smart Phone", "Smart Watch"],
    href: "/categories/phone",
  },
  {
    name: "Computer",
    icon: <Laptop className="h-8 w-8" />,
    subcategories: ["Laptop", "Desktop", "Monitor", "Mouse", "Keyboard", "Others"],
    href: "/categories/computer",
  },
  {
    name: "Vehicle",
    icon: <Bike className="h-8 w-8" />,
    subcategories: ["Bicycle", "Motorbikes"],
    href: "/categories/vehicle",
  },
  {
    name: "Textbooks",
    icon: <BookOpen className="h-8 w-8" />,
    subcategories: ["CSE", "EEE", "Textile", "Civil"],
    href: "/categories/textbooks",
  },
]

export default function ProductCategories() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-white">Browse Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-900 p-4 rounded-full mb-4 text-blue-100">{category.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.subcategories.join(", ")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
