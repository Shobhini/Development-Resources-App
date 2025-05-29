import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import * as BiIcons from "react-icons/bi";
import NavUI from './NavUI';
import { useLocation } from "react-router-dom";

// Add a new icon that uses RiIcons to fix the unused import warning
const icons = [
  {
    icon: <FaIcons.FaHome />,
    iconName: "Home",
    navlink: "/",
  },
  {
    icon: <BsIcons.BsFillCameraVideoFill />,
    iconName: "Videos",
    navlink: "Videos",
  },
  { icon: <BsIcons.BsGlobe2 />, iconName: "Websites", navlink: "Websites" },
  { icon: <GiIcons.GiBookshelf />, iconName: "Books", navlink: "Books" },
  { icon: <BsIcons.BsTools />, iconName: "Tools", navlink: "Tools" },
  { icon: <BiIcons.BiBullseye />, iconName: "Challenges", navlink: "challenges" },
  { icon: <RiIcons.RiCodeSSlashLine />, iconName: "Editors", navlink: "editor" }, // Using RiIcons here
];

function NavItem({searchResult}) {
  let location = useLocation();

  return(
    <div className="overflow-hidden h-screen ">
      {icons.map((item, index) => (
        <NavUI
          key={item.navlink} // Using navlink as key instead of index
          icon={item.icon}
          iconName={item.iconName}
          navlink={item.navlink}
          searchResult={searchResult}
          activeTab={
            location.pathname === `/${item.navlink}` || 
            (location.pathname === '/' && item.navlink === '/') 
              ? "bg-[#444a4f]" 
              : ""
          }
        />
      ))}
    </div>
  );
}

export default NavItem;
