import routes from "../routes";
import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/icons/logo-ana-mini.svg";
import "./Sidebar.styles.scss";
import Home from "../assets/images/icons/home.svg";
import Music from "../assets/images/icons/music.svg";
import ArchiveBook from "../assets/images/icons/archive-book.svg";
import Gift from "../assets/images/icons/gift.svg";
import LogOutButton from "../components/LogOutButton";
import { VERSION_NUMBER } from "../utils/version.util";

import { MenuClickEventHandler } from "rc-menu/lib/interface";

const { Sider } = Layout;

interface MenuItem {
  title: string;
  path?: string;
  MenuIcon?: React.ReactNode;
  children?: MenuItem[];
  key: string;
}

const menuItems: MenuItem[] = [
  {
    ...routes.Affirmation,
    MenuIcon: (
      <img src={Home} className="w-[20%] h-auto pr-1" alt="affirmations" />
    ),
    key: routes.Affirmation.path,
  },
  {
    ...routes.DailyVibe,
    MenuIcon: (
      <img src={Music} className="w-[20%] h-auto pr-1" alt="daily vibes" />
    ),
    key: routes.DailyVibe.path,
  },
  {
    ...routes.Journey,
    MenuIcon: (
      <img src={ArchiveBook} className="w-[20%] h-auto pr-1" alt="journey" />
    ),
    key: routes.Journey.path,
  },
  {
    ...routes.GiftCode,
    MenuIcon: (
      <img src={Gift} className="w-[20%] h-auto pr-1" alt="gift code" />
    ),
    key: routes.GiftCode.path,
  },
];
const FIRST_ITEM_TOP = 145;

const Sidebar = () => {
  const [currentItem, setCurrentItem] = useState("0");
  const [indicator, setIndicator] = useState(FIRST_ITEM_TOP);

  const handleClick: MenuClickEventHandler = (e) => {
    setCurrentItem(e.key);
    console.log(indicator);
    setIndicator(FIRST_ITEM_TOP + 80 * Number.parseInt(e.key));
  };

  return (
    <Sider width={"12%"} className="bg-primary ">
      <div className="flex flex-col h-full bg-primary">
        <div className="flex justify-center p-12 ">
          <img src={logo} alt="" className="login-logo" />
        </div>
        <div className="flex flex-col justify-between h-full w-full">
          <Menu
            mode="vertical"
            selectedKeys={[currentItem]}
            className="flex flex-col gap-2 items-center"
            onClick={handleClick}
            style={{
              backgroundColor: "#4D4479",
              borderRight: 0,
            }}
          >
            <div
              className="indicator w-[7px] h-[40px] bg-white rounded-r-lg absolute left-0 duration-[250ms]"
              style={{ top: indicator + "px" }}
            ></div>

            {menuItems.map(({ MenuIcon, title, path, key }, index) => (
              <Menu.Item
                key={index}
                icon={MenuIcon}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  height: "50%",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "17px",
                  overflow: "visible",
                }}
              >
                <div>
                  <NavLink to={path ?? "/"}>
                    <span className="text-white ">{title}</span>
                  </NavLink>
                </div>
              </Menu.Item>
            ))}
          </Menu>

          <div className="flex flex-col justify-center">
            <p className="flex text-white justify-center text-[20px] mb-4 font-bold">
              Admin
            </p>

            <LogOutButton />

            <p className="ml-[20px] mb-4 text-white">
              Version: {VERSION_NUMBER}
            </p>
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
