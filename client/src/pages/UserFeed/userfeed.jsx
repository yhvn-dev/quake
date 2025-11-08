import { useState, useEffect } from "react";
import * as userService from "../../services/eqServices";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [eq, setEq] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchEQ();
  }, []);

  const handleOpenLogin = () => {
    try {
      setOpenLogin(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error Opening Login");
    }
  };
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
    <section className="full grid grid-cols-1fr grid-rows-[3rem_5rem_75vh] grid-rows-[1fr_3fr_75vh] lg:grid-rows-[1fr] lg:grid-cols-[1fr_9fr] gap-4 overflow-y-hidden  lg:overflow-y-auto ">
      <main className="full  shadow-lg column-t row-start-3 row-end-3 col-start-1  lg:row-start-1 lg:row-end-span-full lg:col-start-2 lg:col-span-full overflow-y-hidden  lg:overflow-y-auto">
        <nav className="w-full center h-[30%] p-2 ">
          <div className="full center-l">EarthQuakes</div>
          <div className="full flex items-center justify-start flex-row-reverse">
            <button
              onClick={handleOpenLogin}
              className='shadog-lg px-4 py-2  cursor-pointer rounded-xl center hover:bg-[var(--moon-phases-e)] bg-[var(--moon-phases-d)] stroke="#fff"'
            >
              <Plus size={18} fill="#fff" />
            </button>
          </div>
        </nav>

        <div className="column-t overflow-y-auto overflow-x-auto">
          <table className="eq-table table-fixed lg:max-w-full lg:w-full lg:max-w-full lg:w-full lg:overflow-y-auto">
            <thead>
              <tr className="tr-th shadow-lg bg-[var(--white-blple)]">
                <th className="p-4  font-semibold">Date Time</th>
                <th className="p-4  font-semibold">Depth</th>
                <th className="p-4  font-semibold">DetailLink</th>
                <th className="p-4  font-semibold">Latitude</th>
                <th className="p-4  font-semibold">Location</th>
                <th className="p-4  font-semibold">Longtitude</th>
                <th className="p-4  font-semibold">Magnitude</th>
              </tr>
            </thead>

            <tbody className="w-full overflow-hidden  lg:overflow-y-auto">
              {eq.length > 0 &&
                eq.map((e) => {
                  return (
                    <>
                      <tr className="td-tr">
                        <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                          {e.dateTime}
                        </td>
                        <td className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word">
                          {e.depth}
                        </td>
                        <a
                          href={e.detailLink}
                          className="text-sm px-4 py-1 sm:text-wrap sm:wrap-break-word break-normal lg:text-wrap lg:wrap-break-word"
                        >
                          {e.detailLink}
                        </a>
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
                    </>
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
