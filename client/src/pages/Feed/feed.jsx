// quake/client/src/pages/Feed/feed.jsx
import { useState, useEffect } from "react";
import * as userService from "../../services/eqServices";
import Navbar from "../../components/Navbar";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [eq, setEq] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEQ();
  }, []);



  const fetchEQ = async () => {
    try {
      const data = await userService.eqAll();
      const eqData = data.data.data;
      console.log(eqData);
      setEq(eqData);
    } catch (error) {
      console.error("Error Fetching EQ");
    }
  };

  return (
    <section className="full grid grid-cols-1fr grid-rows-[3rem_85vh] gap-4 overflow-y-hidden gap-4">
      {/* Add Navbar at the top */}
      <div className="col-span-full row-start-1">
        <Navbar />
      </div>

      <main className="center shadow-lg column-t row-start-2 row-end-3 col-start-1 col-end-1 md:col-start-2 col-span-full overflow-y-hidden">
        <nav className="w-full center h-[30%] p-2">
 
        </nav>

        <div className="flex items-center justify-starr flex-col overflow-y-auto overflow-x-auto shadow-lg">
          <table className="eq-table table-fixed md:max-w-full md:w-full lg:max-w-full lg:w-[90%]">
            <thead>
              <tr className="tr-th shadow-lg bg-[var(--white-blple)]">
                <th className="p-4 font-semibold rounded-tl-xl">Date Time</th>
                <th className="p-4 font-semibold">Depth</th>
                <th className="p-4 font-semibold">DetailLink</th>
                <th className="p-4 font-semibold">Latitude</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Longtitude</th>
                <th className="p-4 font-semibold rounded-tr-xl">Magnitude</th>
              </tr>
            </thead>

            <tbody className="w-full overflow-hidden">
              {eq.length > 0 &&
                eq.map((e, index) => {
                  return (
                    <tr key={index} className="td-tr">
                      <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        {e.dateTime}
                      </td>
                      <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        {e.depth}
                      </td>
                      <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        <a
                          href={e.detailLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {e.detailLink}
                        </a>
                      </td>
                      <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        {e.latitude}
                      </td>
                      <td className="text-sm px-4 py-1 sm:text-wrap wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        {e.location}
                      </td>
                      <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        {e.longitude}
                      </td>
                      <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                        {e.magnitude}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
}

export default Feed;
