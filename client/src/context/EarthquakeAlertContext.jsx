import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import * as eqService from "../services/eqServices";
import { toast } from "react-hot-toast";

const EarthquakeAlertContext = createContext(null);

export const EarthquakeAlertProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastCheckedEarthquakes, setLastCheckedEarthquakes] = useState([]);
  const intervalRef = useRef(null);
  const notifiedEarthquakesRef = useRef(new Set());

  // Location matching logic
  const matchesUserLocation = (earthquakeLocation, userLocation) => {
    if (!earthquakeLocation || !userLocation) return false;

    const eqLower = earthquakeLocation.toLowerCase();
    const userLower = userLocation.toLowerCase();

    const userKeywords = userLower
      .split(/[,\s]+/)
      .filter((keyword) => keyword.length > 2); // Filter out short words

    // Check if any keyword matches
    return userKeywords.some((keyword) => eqLower.includes(keyword));
  };

  // Play alert sound
  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();

      const frequencies = [880, 988, 880];

      frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        const startTime = audioContext.currentTime + i * 0.25;
        const stopTime = startTime + 0.2;

        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, stopTime);

        oscillator.start(startTime);
        oscillator.stop(stopTime);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Show alert notification
  const showEarthquakeAlert = (earthquake) => {
    playAlertSound();

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-red-600 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white">
                  !!! EARTHQUAKE ALERT !!!
                </p>
                <p className="mt-1 text-sm text-white">
                  <strong>Magnitude:</strong> {earthquake.magnitude}
                </p>
                <p className="mt-1 text-sm text-white">
                  <strong>Location:</strong> {earthquake.location}
                </p>
                <p className="mt-1 text-xs text-gray-200">
                  {earthquake.dateTime}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-red-700">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000, // 10 seconds
        position: "top-center",
      }
    );
  };

  // Check for new earthquakes
  const checkForNewEarthquakes = async () => {
    if (!isAuthenticated || !user?.location) {
      return;
    }

    try {
      const response = await eqService.eqAll();
      const earthquakes = response.data.data;

      // Find new earthquakes that match user location
      earthquakes.forEach((eq) => {
        const eqId = `${eq.dateTime}-${eq.latitude}-${eq.longitude}`;

        if (notifiedEarthquakesRef.current.has(eqId)) {
          return;
        }

        // Check if earthquake location matches user location
        if (matchesUserLocation(eq.location, user.location)) {
          // Check if this is truly a new earthquake (not in last check)
          const isNew = !lastCheckedEarthquakes.some(
            (oldEq) =>
              oldEq.dateTime === eq.dateTime &&
              oldEq.latitude === eq.latitude &&
              oldEq.longitude === eq.longitude
          );

          if (isNew) {
            console.log("!!! EARTHQUAKE ALERT TRIGGERED: !!!", eq);
            showEarthquakeAlert(eq);
            notifiedEarthquakesRef.current.add(eqId);
          }
        }
      });

      // Update last checked earthquakes
      setLastCheckedEarthquakes(earthquakes);
    } catch (error) {
      console.error("Error checking for earthquakes:", error);
    }
  };

  // Start monitoring
  const startMonitoring = () => {
    if (!isAuthenticated || !user?.location) {
      console.warn(
        "Cannot start monitoring: User not authenticated or no location set"
      );
      return;
    }

    if (isMonitoring) {
      console.log("Monitoring already active");
      return;
    }

    console.log("Starting earthquake monitoring for location:", user.location);
    setIsMonitoring(true);

    // Initial check
    checkForNewEarthquakes();

    intervalRef.current = setInterval(checkForNewEarthquakes, 30000);
  };

  // Stop monitoring
  const stopMonitoring = () => {
    console.log("⏸️ Stopping earthquake monitoring");
    setIsMonitoring(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Simulate earthquake for testing
  const simulateEarthquakeEvent = (customLocation = null) => {
    const mockEarthquake = {
      dateTime: new Date().toLocaleString(),
      latitude: "14.5995",
      longitude: "121.0537",
      depth: "10 km",
      magnitude: "5.2",
      location: customLocation || user?.location || "Metro Manila",
      detailLink: "https://earthquake.phivolcs.dost.gov.ph/",
    };
    showEarthquakeAlert(mockEarthquake);
  };

  useEffect(() => {
    if (isAuthenticated && user?.location && !isMonitoring) {
      startMonitoring();
    } else if ((!isAuthenticated || !user?.location) && isMonitoring) {
      stopMonitoring();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, user?.location]);

  useEffect(() => {
    const clearOldNotifications = setInterval(() => {
      notifiedEarthquakesRef.current.clear();
      console.log("Cleared old earthquake notifications");
    }, 24 * 60 * 60 * 1000); // 24 hours

    return () => clearInterval(clearOldNotifications);
  }, []);

  return (
    <EarthquakeAlertContext.Provider
      value={{
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        simulateEarthquakeEvent,
        lastCheckedEarthquakes,
      }}
    >
      {children}
    </EarthquakeAlertContext.Provider>
  );
};

export const useEarthquakeAlert = () => {
  const context = useContext(EarthquakeAlertContext);
  if (!context) {
    throw new Error(
      "useEarthquakeAlert must be used within EarthquakeAlertProvider"
    );
  }
  return context;
};
