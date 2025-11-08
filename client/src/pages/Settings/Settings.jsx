import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar   from "../../components/DashboardSidebar"
import {
  updateUserProfile,
  getPhilippineLocations,
} from "../../services/userService";
import EarthquakeAlertStatus from "../../components/EarthquakeAlertStatus"

import { Save, Loader2, Eye, EyeOff } from "lucide-react";

function Settings() {
  const { user, updateUser, checkAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
      }));

      if (user.location) {
        const parts = user.location.split(", ");
        if (parts.length === 2) {
          setSelectedRegion(parts[0]);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      fetchCities(selectedRegion);
    } else {
      setCities([]);
    }
  }, [selectedRegion]);

  const fetchRegions = async () => {
    try {
      const data = await getPhilippineLocations();
      setRegions(data.regions || []);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    }
  };

  const fetchCities = async (region) => {
    try {
      const data = await getPhilippineLocations(region);
      setCities(data.cities || []);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    setFormData((prev) => ({ ...prev, location: "" }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    const fullLocation = selectedRegion ? `${selectedRegion}, ${city}` : city;
    setFormData((prev) => ({ ...prev, location: fullLocation }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        location: formData.location,
      };

  
      const response = await updateUserProfile(updateData);

      setMessage({ type: "success", text: "Profile updated successfully" });

      await checkAuth();

    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-screen h-screen section bg-[var(--main-white)] h-screen w-screen flex gap-4 flex-col overflow-y-hidden grid grid-cols-[1fr_9fr]
     grid-rows-[2fr_3fr_5fr]">
      
        <DashboardSidebar />

        <main className="col-start-2 col-span-full row-start-1 px-0 py-4 row-span-full">
          <h1 className="account-settings text-3xl font-bold text-gray-800 mb-6">
            Account Settings
          </h1>

          {message.text && (
            <div
              className={`p-4 mb-6 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

      <form
        onSubmit={handleSubmit}
        className="container bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--moon-phases-d)] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--moon-phases-d)] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Philippines)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              className="select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--moon-phases-d)] focus:border-transparent"
            >
              <option value="">Select Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            <select
              value={formData.location.split(", ")[1] || ""}
              onChange={handleCityChange}
              disabled={!selectedRegion}
              className="select w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--moon-phases-d)] focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          {formData.location && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {formData.location}
            </p>
          )}
        </div>

   

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--moon-phases-d)] text-white rounded-lg hover:bg-[var(--moon-phases-e)] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
      </main>

      {<EarthquakeAlertStatus/>}
      
    </div>
  );
}

export default Settings;
