import React, { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaBookmark,
  FaUser,
  FaBars,
  FaClock,
  FaStar,
  FaCode,
  FaChartLine,
  FaLaptopCode,
  FaRocket,
  FaBook,
  FaBrain,
} from "react-icons/fa";
import axios from "axios";
import "./UserProfile.css";

const USDC_SYMBOL_URL = "https://cryptologos.cc/logos/solana-sol-logo.png";

// Define the structure of Course and Category
interface Course {
  _id: string;
  image: string;
  title: string;
  time?: string;
  rating: number;
  price: number;
  category: string;
}

interface Category {
  name: string;
  icon: JSX.Element;
}

const categories: Category[] = [
  { name: "Development", icon: <FaCode size={24} /> },
  { name: "Finance", icon: <FaChartLine size={24} /> },
  { name: "Education", icon: <FaBook size={24} /> },
  { name: "Innovation", icon: <FaBrain size={24} /> },
  { name: "Rocket Science", icon: <FaRocket size={24} /> },
  { name: "Technology", icon: <FaLaptopCode size={24} /> },
];

const UserProfile: React.FC = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [bloomActive, setBloomActive] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!publicKey) {
      navigate("/");
    }
  }, [publicKey, navigate]);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://r6z95h-5001.csb.app/api/v1/course"
        );
        console.log("API Response:", response.data); // Detailed log
        // Adjust based on actual response structure
        const fetchedCourses =
          response.data.data.results || response.data.results || [];
        setCourses(fetchedCourses);
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch courses. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBookmarkClick = (courseId: string) => {
    setSavedCourses((prevSaved) =>
      prevSaved.includes(courseId)
        ? prevSaved.filter((id) => id !== courseId)
        : [...prevSaved, courseId]
    );
    setBloomActive(courseId);
    setTimeout(() => setBloomActive(null), 300);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 ${
          sidebarOpen ? "w-24" : "w-16"
        } transition-all duration-300 p-4 flex flex-col items-center`}
      >
        <button
          onClick={toggleSidebar}
          className="mb-8 text-gray-400 hover:text-light-blue-500 transition-colors duration-300"
        >
          <FaBars size={24} />
        </button>
        <Link
          to="/"
          className="text-gray-400 hover:text-light-blue-500 transition-colors duration-300 flex flex-col items-center mb-8"
        >
          <FaHome size={20} />
          {sidebarOpen && <span className="text-xs mt-1">Home</span>}
        </Link>
        <Link
          to="/search"
          className="text-gray-400 hover:text-light-blue-500 transition-colors duration-300 flex flex-col items-center mb-8"
        >
          <FaSearch size={20} />
          {sidebarOpen && <span className="text-xs mt-1">Search</span>}
        </Link>
        <Link
          to="/saved"
          className="text-gray-400 hover:text-light-blue-500 transition-colors duration-300 flex flex-col items-center mb-8"
        >
          <FaBookmark size={20} />
          {sidebarOpen && <span className="text-xs mt-1">Saved</span>}
        </Link>
        <Link
          to="/profilepage"
          className="text-gray-400 hover:text-light-blue-500 transition-colors duration-300 flex flex-col items-center"
        >
          <FaUser size={20} />
          {sidebarOpen && <span className="text-xs mt-1">Profile</span>}
        </Link>
      </div>

      {/* Main Content */}
      <div className="w-full p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <WalletMultiButton className="text-white" />
        </header>

        {/* Categories Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-light-blue-600 text-light-blue-300"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="mb-2 text-gray-400">{category.icon}</div>
                <span
                  className={`text-sm font-semibold transition-colors duration-300 ${
                    selectedCategory === category.name
                      ? "text-light-blue-300"
                      : "text-white"
                  }`}
                >
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Course Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Courses</h2>
          {loading ? (
            <p>Loading courses...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses
                .filter((course) =>
                  selectedCategory ? course.category === selectedCategory : true
                )
                .map((course) => (
                  <Link to={`/courses/${course._id}`} key={course._id}>
                    <div className="bg-gray-800 rounded-lg shadow-lg transition-transform transform hover:scale-105 p-4 flex flex-col">
                      <div className="relative mb-4">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <FaBookmark
                          size={18}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation on bookmark click
                            handleBookmarkClick(course._id);
                          }}
                          className={`absolute top-2 left-2 cursor-pointer text-white p-1 rounded-full ${
                            savedCourses.includes(course._id)
                              ? "bg-yellow-500"
                              : "bg-gray-800"
                          } ${bloomActive === course._id ? "bloom" : ""}`}
                        />
                      </div>
                      <p className="text-sm font-semibold mb-2">
                        {course.title}
                      </p>
                      <div className="flex justify-between text-gray-400 mb-2">
                        <div className="flex items-center space-x-2">
                          <FaStar size={14} />
                          <span className="text-xs">{course.rating}</span>
                        </div>
                        {course.time && (
                          <div className="flex items-center space-x-2">
                            <FaClock size={14} />
                            <span className="text-xs">{course.time}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-bold flex items-center space-x-1">
                        <img
                          src={USDC_SYMBOL_URL}
                          alt="USDC"
                          className="w-4 h-4"
                        />
                        <span>{course.price} SOL</span>
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
