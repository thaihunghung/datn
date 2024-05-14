import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, signOut } from "../../../../../service/firebase";
import {
    User,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    ScrollShadow,
    Button,
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    NavbarContent,
    NavbarItem
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { motion } from "framer-motion";

function Nav(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { collapsedNav, setCollapsedNav, setSpinning } = props;

    const [submenuVisible, setSubmenuVisible] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    // Toggle submenu visibility
    const toggleSubmenu = (text) => {
        setCollapsedNav(false);

        setSubmenuVisible({
            ...submenuVisible,
            [text]: !submenuVisible[text],
        });
    };

    const open = () => {
        setCollapsedNav(false);
    };

    // Set active tab based on current path
    const setActive = (href) => {
        return location.pathname === href ? 'Admin_tab-active' : '';
    };

    const menuItems = [
        'Profile',
        'Dashboard',
        'Activity',
        'Analytics',
        'System',
        'Deployments',
        'My Settings',
        'Team Settings',
        'Help & Feedback',
        'Log Out',
    ];

    const navTab = [
        { text: "Tổng quan", link: "/admin", icon: <i className={`fa-solid fa-house mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        { text: "Chấm điểm", link: "/admin/management-point", icon: <i className={`fa-solid fa-feather-pointed mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        {
            text: "Programs",
            icon: <i className={`fa-solid fa-gear mr-${collapsedNav ? "0" : "3"} w-4`}></i>,
            submenu: [
                { text: (<><i className="fa-solid fa-minus mr-3"></i>Chương trình</>), link: "/admin/management-program" },
                { text: (<><i className="fa-solid fa-minus mr-3"></i>PLO</>), link: "/admin/management-po" },
                { text: (<><i className="fa-solid fa-minus mr-3"></i>PO</>), link: "/admin/management-plo" },
            ],
        },
        { text: "Rubric", link: "/admin/management-rubric", icon: <i className={`fa-regular fa-folder mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        { text: "Sinh viên", link: "/admin/student", icon: <i className={`fa-regular fa-folder mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
    ];

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setCurrentUser(auth);
            console.log(auth);
        });
    }, []);

    useEffect(() => {
        navTab.forEach((tab) => {
            if (tab.submenu) {
                tab.submenu.forEach((submenuItem) => {
                    if (location.pathname.startsWith(submenuItem.link)) {
                        setSubmenuVisible((prev) => ({
                            ...prev,
                            [tab.text]: true,
                        }));
                    }
                });
            }
        });
    }, [location.pathname]);

    const handleLoginWithGoogle = async () => { };
    const handleLogout = async () => {
        setSpinning(true);
        try {
            await signOut(auth);
            setSpinning(false);
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleNav = () => {
        setCollapsedNav(!collapsedNav);
    };

    return (
        <div className="hidden sm:block lg:block xl:block text-[white]">
            <motion.div
                className={`Admin-Navbar flex flex-col w-["200px"] ${collapsedNav ? 'w-[87px]' : ''} h-[100vh] bg-[#ff8077] p-3  justify-between`}
                initial={{ width: '270px' }}
                animate={{ width: collapsedNav ? '100px' : '200px' }}
                transition={{ duration: 0.4 }}
            >
                <div className="grid grid-rows-[auto,auto] h-[100vh] flex-1">
                    <div className={`flex w-full h-[50px] justify-${collapsedNav ? 'center' : 'between'} items-center p-${collapsedNav ? '2' : '3'}`}>
                        <motion.div
                            className="flex gap-3 items-center h-fit"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: collapsedNav ? 0 : 1 }}
                            transition={{ duration: collapsedNav ? 0 : 0.4, delay: collapsedNav ? 0 : 0.4 }}
                        >
                            {!collapsedNav && (
                                <>
                                    <img width={20} alt="" />
                                    <span className="font-bold text-xl mt-[1px]">SET</span>
                                </>
                            )}
                        </motion.div>
                        <Tooltip title={collapsedNav ? 'Mở rộng' : 'Thu gọn'} placement="right">
                            <Button isIconOnly variant="light" radius="full" onClick={handleToggleNav}>
                                {collapsedNav ? <i className="fa-solid fa-chevron-right text-[white]"></i> : <i className="fa-solid fa-chevron-left text-[white]"></i>}
                            </Button>
                        </Tooltip>
                    </div>
                    <ScrollShadow className="flex-1" hideScrollBar style={{ height: 'calc(100vh - 130px)' }}>
                        <div className="flex flex-col gap-2 overflow-auto overflow-x-hidden">
                            <hr className="opacity-10 m-auto w-[30px] px-2 mb-2 border-[1.5px]" />
                            {navTab.map((tab) => (
                                <div key={tab.text}>
                                    <Tooltip color={"#FF9908"} title={collapsedNav ? <span className="text-[#FEFEFE]">{tab.text}</span> : ""} placement="right">
                                        <div>
                                            {tab.link ? (
                                                <Link
                                                    to={tab.link}
                                                    onClick={() => toggleSubmenu(null)}
                                                    className={`text-base w-full h-[37px] p-3 py-2 rounded-lg flex justify-${collapsedNav ? 'center' : 'between'} items-center group/tab ${setActive(tab.link)}`}
                                                >
                                                    <p className="flex items-center">
                                                        {tab.icon}
                                                        <motion.span
                                                            initial={{ opacity: 1 }}
                                                            animate={{ opacity: collapsedNav ? 0 : 1 }}
                                                            transition={{ duration: collapsedNav ? 0 : 0.4, delay: collapsedNav ? 0 : 0.4 }}
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {!collapsedNav && tab.text}
                                                        </motion.span>
                                                    </p>
                                                </Link>
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        toggleSubmenu(tab.text);
                                                        open();
                                                    }}
                                                    className={`cursor-pointer ${location.pathname.startsWith(tab.link) ? setActive(tab.link) : ''} text-base w-full h-[37px] p-3 py-2 rounded-lg flex justify-${collapsedNav ? 'center' : 'between'} items-center`}
                                                >
                                                    <p className="flex items-center">
                                                        {tab.icon}
                                                        <motion.span
                                                            initial={{ opacity: 1 }}
                                                            animate={{ opacity: collapsedNav ? 0 : 1 }}
                                                            transition={{ duration: collapsedNav ? 0 : 0.4, delay: collapsedNav ? 0 : 0.4 }}
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {!collapsedNav && tab.text}
                                                        </motion.span>
                                                    </p>
                                                    {!collapsedNav && (
                                                        <i
                                                            className={`fa-solid fa-chevron-${submenuVisible[tab.text] ? 'right' : 'down'} w-2 opacity-40 group-hover/tab:opacity-100 transition-all`}
                                                        ></i>
                                                    )}
                                                </div>
                                            )}
                                            {submenuVisible[tab.text] && tab.submenu && !collapsedNav && (
                                                <motion.div
                                                    initial={{ height: '0px' }}
                                                    animate={{ height: submenuVisible[tab.text] ? 'auto' : '0px' }}
                                                    transition={{ duration: 0.4 }}
                                                    className="overflow-hidden flex flex-col gap-1"
                                                >
                                                    {tab.submenu.map((submenuItem, index) => (
                                                        <Link
                                                            key={index}
                                                            to={submenuItem.link}
                                                            className={`cursor-pointer text-sm text-black w-full p-2 pl-5 rounded-lg flex justify-start items-center 
                                                            ${location.pathname.startsWith(submenuItem.link) ? setActive(submenuItem.link) : ''}`}
                                                        >
                                                            {submenuItem.text}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </ScrollShadow>
                    <div className={`flex w-full h-[45px] justify-${collapsedNav ? 'center' : 'between'} items-center p-3`}>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly>
                                    <User
                                        className="cursor-pointer"
                                        as="button"
                                        src={currentUser?.currentUser?.photoURL || 'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
                                        name={currentUser?.currentUser?.displayName || 'Username'}
                                        description={currentUser?.currentUser?.email || 'email@gmail.com'}
                                    />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dropdown menu with user actions" variant="flat">
                                <DropdownSection title="Signed in as">
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <div className="flex flex-col">
                                            <p className="font-semibold">{currentUser?.currentUser?.displayName}</p>
                                            <p className="text-xs text-default-400">{currentUser?.currentUser?.email}</p>
                                        </div>
                                    </DropdownItem>
                                </DropdownSection>
                                <DropdownSection title="Actions">
                                    <DropdownItem key="settings">Settings</DropdownItem>
                                    <DropdownItem key="logout" color="danger" className="flex gap-2" onClick={handleLogout}>
                                        Log Out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Nav;

