import { Divider, Text } from "@mantine/core";
import { IconChevronsLeft, IconDashboard, IconLogout, IconUsers } from "@tabler/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppImages } from "../constants/app_images";
import store, { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/reducers/Auth.reducers";

const navItems = [
  { link: "/", label: "Dashboard", icon: IconDashboard },
  { link: "/users", label: "Users", icon: IconUsers },
];

export default function Navbar({ onClose }: { onClose: any }) {
  const [active] = useState(window.location.pathname);
  const auth = useAppSelector((state) => state.auth);
  const masterData = useAppSelector((state) => state.dashboard.initial_data);
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="top-section">
        <div style={{ display: "flex", gap: "5px" }}>
          <img src={AppImages.logo} height={40} alt="fg" />
          <Text size={24} weight={600}>
            ABC
          </Text>
        </div>
        <IconChevronsLeft onClick={onClose} />
      </div>
      <Divider my={10} />
      <div className="nav-links">
        {!store.getState().dashboard.initial_data
          ? null
          : navItems.map((item, i) => (
              <div key={i} onClick={(event) => navigate(item.link, { replace: true })}>
                <div key={i} className={`nav-item ${item.link === active ? "active" : ""}`}>
                  <item.icon stroke={1.5} />
                  <span>{item.label}</span>
                </div>
                {/* <Divider size={"xs"} mx={10} h={0} /> */}
              </div>
            ))}
      </div>

      <Divider my={10} />
      <div className="user-card">
        <div>
          <Text lineClamp={1} size={14} weight={600}>
            {auth.data?.name}
          </Text>
          <Text lineClamp={1} size={12} weight={400}>
            {auth.data?.email}
          </Text>
        </div>
        <IconLogout
          onClick={() => {
            dispatch(logout());
            navigate("/login", { replace: true });
          }}
        />
      </div>
    </div>
  );
}
