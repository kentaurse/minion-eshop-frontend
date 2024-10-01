import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { changeExpandedSide } from "../redux/sideSlice";

export default function SidebarSubmenu({ submenu, name, icon, id, path }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expandedSide } = useSelector((store) => store.side);
  const location = useLocation();
  // const [isExpanded, setIsExpanded] = useState(true);

  /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
  useEffect(() => {
    if (submenu.filter(m => { return m.path === location.pathname })?.length > 0) {
      dispatch(changeExpandedSide({ id: id }))
    }
  }, [])
  const changeHandler = () => {
    dispatch(changeExpandedSide({ id: id }));
    // setIsExpanded(!isExpanded);
    navigate(path);
  };

  return (
    <div className="flex-col">
      {/** Route header */}
      <div
        className="w-full flex items-center px-4 font-normal gap-x-4 text-minionBlack text-[20px] relative py-3 hover:bg-gray-100 hover:text-gray-900"
        onClick={() => changeHandler()}
      >
        {icon} {name}
        <ChevronDownIcon
          className={
            " absolute right-[1rem] top-1/2 -translate-y-1/2 w-5 h-5 mt-1 float-right delay-400 duration-500 transition-all  " +
            (expandedSide === id ? "rotate-180" : "")
          }
        />
      </div>

      {/** Submenu list */}
      <div
        className={
          ` w-full duration-300 overflow-y-hidden ` +
          (expandedSide === id ? "h-fit py-1 " : "h-0 py-0")
        }
      >
        <ul className={`menu menu-compac`}>
          {submenu.map((m, k) => {
            return (
              <li key={k} className={`py-3 pl-6 font-normal hover:bg-gray-100 hover:rounded-tr-md hover:rounded-br-md  hover:text-gray-900 relative ${location?.pathname == m.path ? 'text-gray-900 bg-gray-100' : 'bg-white'}`}>
                <Link
                  to={m.path}
                  className="flex items-center px-4 gap-x-4 text-[18px]"
                >
                  {m.icon} {m.name}
                  {location?.pathname == m.path ? (
                    <span
                      className="absolute  h-full right-0 top-1/2 -translate-y-1/2 w-1 rounded-tr-md rounded-br-md bg-minionBlue "
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
