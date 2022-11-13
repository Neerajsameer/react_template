import { Divider, Text } from "@mantine/core";
import {
    IconDashboard, IconFileShredder, IconLogout, IconMap, IconUsers
} from '@tabler/icons';
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AppImages } from "../constants/app_images";
import { useAppDispatch, useAppSelector } from "../store";
import { logout } from "../store/reducers/Auth.reducers";

const navItems = [
    { link: '/', label: 'Dashboard', icon: IconDashboard },
    { link: '/users', label: 'Users', icon: IconUsers },
    { link: '/feedbacks', label: 'Feedbacks', icon: IconFileShredder },
    { link: '/field_survey', label: 'Field Survey', icon: IconFileShredder },
    { link: '/map_view', label: 'Map View', icon: IconMap },
];

export default function Navbar() {
    const [active, setActive] = useState(window.location.pathname);
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    let navigate = useNavigate();

    return (
        <div className="navbar">
            <div className="top-section">
                <img src={AppImages.logo} height={40} alt="fg" />
                <Text size={24} weight={600}>CoERS</Text>
            </div>
            <Divider my={10} />
            <div className="nav-links">
                {navItems.map((item, i) => (
                    <div key={i} onClick={(event) => {
                        // setActive(item.link);
                        // event.preventDefault();
                        // window.location.replace(item.link);
                        navigate(item.link, { replace: true });
                    }}>
                        <div key={i} className={`nav-item ${item.link === active ? 'active' : ''}`}>
                            <item.icon stroke={1.5} />
                            <span>{item.label}</span>
                        </div>
                        {/* <Divider size={"xs"} mx={10} h={0} /> */}
                    </div>
                ))
                }
            </div>
            <Divider my={10} />
            <div className="user-card">
                <div>
                    <Text lineClamp={1} size={14} weight={600}>{auth.data?.user_name}</Text>
                    <Text lineClamp={1} size={12} weight={400}>{auth.data?.email}</Text>
                </div>
                <IconLogout onClick={() => {
                    dispatch(logout())
                    navigate('/login', { replace: true });
                }} />
            </div>
        </div>
    )
}