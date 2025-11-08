import { useEarthquakeAlert } from "../context/EarthquakeAlertContext";
import { useAuth } from "../context/AuthContext";

function EarthquakeAlertStatus() {
  const { simulateEarthquakeEvent } = useEarthquakeAlert();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="container  rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="els font-semibold text-sm">Earthquake Alerts</span>
          </div>
        </div>

        {user?.location ? (
          <>
            <h5 className="text-xs text-gray-600 mb-2">
              Your Location: <strong>{user.location}</strong>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="tl text-xs font-semibold text-gray-700 mb-2">
                  Test Alert
                </p>
                <button
                  onClick={() => simulateEarthquakeEvent()}
                  className="w-full px-3 py-2 rounded text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                >
                  Alert
                </button>
              </div>
            </h5>
          </>
        ) : (
          <p className="text-xs text-amber-600 mb-3">
            Set your location in Settings
          </p>
        )}
      </div>
    </div>
  );
}

export default EarthquakeAlertStatus;
