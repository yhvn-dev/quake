import React from "react";
import { NavLink } from "react-router-dom";
import { TableOfContents, ClipboardMinus } from "lucide-react";
function Sidebar() {
  return (
    <aside className="w-full h-full column col-start-1 col-end-1 row-start-1 row-span-full shadow-lg ">
      <div className="w-full h-[5%] center">
        <p>Logo</p>
      </div>

      <div className="w-full h-full flex items-center justify-start flex-col  my-4">
        <NavLink
          className={({ isActive }) =>
            `bg-[var(--moon-phases-d)] text-[0.8rem] center-l my-4 text-white shadow-lg rounded-xl bg-[var(--metal-dark4)] center px-4 py-1 ${
              isActive ? "text-white bg-[var(--moon-phases-d)]" : "bg-white"
            }`
          }
          to="/dashboard"
        >
          <TableOfContents size={24} />
          <span className="py-2 mx-2">Dashboard</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `text-[0.8rem] center-l my-4 rounded-xl  center px-4 py-1  ${
              isActive ? "bg-[var(--moon-phases-d)]" : "bg-white"
            }`
          }
          to="/login"
        >
          <ClipboardMinus size={24} />
          <span className="py-2 mx-2">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
