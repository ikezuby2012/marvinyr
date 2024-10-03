import React, { useState, useEffect } from "react";
import axios from "axios";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaHome, FaSearch, FaBookmark, FaUser, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { User, ReferralLink } from "../types";

const ProfilePage: React.FC = () => {
  const { publicKey } = useWallet();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fetch user data from the backend using token
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          "https://r6z95h-5001.csb.app/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in headers
            },
          }
        );
        setUserData(response.data.data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch user data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch referral links if user is an AFFILIATOR
  useEffect(() => {
    const fetchReferralLinks = async () => {
      if (userData?.accessRole !== "AFFILIATOR") return;

      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      try {
        const response = await axios.get(
          "https://r6z95h-5001.csb.app/api/v1/referralLinks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReferralLinks(response.data.data);
      } catch (error: any) {
        console.error("Error fetching referral links:", error);
        setError(
          error.response?.data?.message ||
            "Failed to fetch referral links. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReferralLinks();
  }, [userData]);

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!userData) {
    return null; // Or a fallback UI
  }

  const { name, email, accessRole } = userData;

  // Handler to copy referral link to clipboard
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(
      () => {
        alert("Referral link copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex">
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
          to="/courses"
          className="text-gray-400 hover:text-light-blue-500 transition-colors duration-300 flex flex-col items-center mb-8"
        >
          <FaBookmark size={20} />
          {sidebarOpen && <span className="text-xs mt-1">Courses</span>}
        </Link>
        <Link
          to="/profile"
          className="text-gray-400 hover:text-light-blue-500 transition-colors duration-300 flex flex-col items-center"
        >
          <FaUser size={20} />
          {sidebarOpen && <span className="text-xs mt-1">Profile</span>}
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8 space-y-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <WalletMultiButton className="text-white" />
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Information & Achievements */}
          <div className="md:w-3/5 space-y-8">
            {/* Profile Information */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                {/* Profile Image */}
                <img
                  src="https://via.placeholder.com/100"
                  alt="Profile"
                  className="rounded-full w-24 h-24 mr-6"
                />
                <div>
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-gray-400">{email}</p>
                </div>
              </div>

              {/* Total Statistics (Dummy data for now) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold">3</p>
                  <p className="text-gray-400">Finished Courses</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold">56</p>
                  <p className="text-gray-400">Hours Learned</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <p className="text-lg font-bold">7</p>
                  <p className="text-gray-400">Skills Achieved</p>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <section className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Achievements</h2>

              <div className="bg-gray-700 p-6 rounded-lg shadow-lg animate-pulse">
                <div className="flex items-center justify-center h-40">
                  <p className="text-xl font-bold text-white">Coming Soon</p>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-lg animate-pulse">
                <div className="flex items-center justify-center h-40">
                  <p className="text-xl font-bold text-white">Coming Soon</p>
                </div>
              </div>
            </section>
          </div>

          {/* Dynamic Section Based on User Role */}
          <div className="md:w-2/5 space-y-8">
            {accessRole === "USER" && (
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg flex items-center justify-center">
                <Link to="/userprofile">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                    Go to User Profile
                  </button>
                </Link>
              </div>
            )}

            {accessRole === "AUTHOR" && (
              <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                <Link to="/create-course">
                  <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition-transform">
                    Create New Course
                  </button>
                </Link>
              </div>
            )}

            {accessRole === "AFFILIATOR" && (
              <>
                {/* Referral Links Section */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">
                    Your Referral Links
                  </h3>
                  {referralLinks.length === 0 ? (
                    <p className="text-gray-400">
                      No referral links available.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {referralLinks.map((refLink) => (
                        <div
                          key={refLink._id}
                          className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                        >
                          <div>
                            <p className="font-bold">
                              Course ID: {refLink.CourseId}
                            </p>
                            <p className="text-gray-400">
                              Link: {refLink.Link}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyLink(refLink.Link)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-1 px-3 rounded-md text-sm shadow-lg hover:scale-105 transition-transform"
                          >
                            Copy Link
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Invite Friends Button */}
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      // Implement your invite friends functionality here
                      // For example, open a modal or redirect to an invite page
                      alert("Invite Friends functionality to be implemented.");
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform"
                  >
                    Invite Friends
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
