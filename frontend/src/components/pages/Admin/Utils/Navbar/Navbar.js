import { Link, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, signOut } from "../../../../../service/firebase";
import { User, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, ScrollShadow, Button, Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { motion } from "framer-motion";

function Nav(props) {
    const { collapsedNav, setCollapsedNav, setSpinning } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);

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
        { label: "Tổng quan", path: "/admin" },
        { label: "Chấm điểm", path: "/admin/management-point" },
        {
            label: "About",
            path: "/about",
            submenu: [
                { label: "Our Team", path: "/about/team" },
                { label: "Our Story", path: "/about/story" }
            ]
        },
        { label: "Rubric", path: "/admin/management-rubric" },
        { label: "Sinh viên", path: "/admin/student" }
    ];

    const navTab = [
        { text: "Tổng quan", link: "/admin", icon: <i className={`fa-solid fa-house mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        { text: "Chấm điểm", link: "/admin/management-point", icon: <i className={`fa-solid fa-feather-pointed mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        {
            text: "Programs",
            icon: <i className={`fa-solid fa-gear mr-${collapsedNav ? "0" : "3"} w-4`}></i>,
            submenu: [
                {
                    text: (<><i className="fa-solid fa-minus mr-3"></i>Chương trình</>),
                    link: "/admin/management-program/description",
                    active: [
                        "/admin/management-program/update",
                        "/admin/management-program/description",
                        "/admin/management-program/create"
                    ],
                },
                {
                    text: (<><i className="fa-solid fa-minus mr-3"></i>PO</>),
                    link: "/admin/management-po/list",
                    active: [
                        "/admin/management-po/store",
                        "/admin/management-po/list",
                        "/admin/management-po/store",
                        "/admin/management-po/update",
                        "/admin/management-po/create"
                    ]
                },
                {
                    text: (<><i className="fa-solid fa-minus mr-3"></i>PLO</>),
                    link: "/admin/management-plo/list",
                    active: [
                        "/admin/management-plo/store",
                        "/admin/management-plo/list",
                        "/admin/management-plo/store",
                        "/admin/management-plo/update",
                        "/admin/management-plo/create"
                    ]
                },
                {
                    text: (<><i className="fa-solid fa-minus mr-3"></i>PO_PLO</>),
                    link: "/admin/po-plo",
                    active: [
                        "/admin/po-plo",
                    ]
                }
            ]
        },
        {
            text: "Subjects",
            icon: <i className={`fa-solid fa-star mr-${collapsedNav ? "0" : "3"} w-4`}></i>,
            link: "/admin/management-subject/list"
        },
        { text: "Rubric", link: "/admin/management-rubric/list", icon: <i className={`fa-regular fa-folder mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        { text: "Sinh viên", link: "/admin/student", icon: <i className={`fa-regular fa-folder mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        { text: "Lớp", link: "/admin/class", icon: <i className={`fa-regular fa-folder mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
        { text: "Lớp môn học", link: "/admin/course", icon: <i className={`fa-regular fa-folder mr-${collapsedNav ? "0" : "3"} w-4`}></i> },
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
        <>
            <div className="block sm:hidden lg:hidden xl:hidden">
                <Navbar disableAnimation isBordered>
                    <NavbarContent className="sm:hidden" justify="start">
                        <NavbarMenuToggle />
                    </NavbarContent>
                    <NavbarContent className="sm:hidden pr-3" justify="center">
                        <NavbarBrand>
                            <p className="font-bold text-inherit">SET</p>
                        </NavbarBrand>
                    </NavbarContent>
                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        <NavbarBrand>
                            <p className="font-bold text-inherit">SET</p>
                        </NavbarBrand>
                        <NavbarItem>
                            <Link color="foreground" to="/features">Features</Link>
                        </NavbarItem>
                        <NavbarItem isActive>
                            <Link to="/customers" aria-current="page" color="warning">Customers</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" to="/integrations">Integrations</Link>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem className="hidden lg:flex">
                            <Link to="/login">Login</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} color="warning" to="/signup" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </NavbarContent>
                    <NavbarMenu>
                        {menuItems.map((item, index) => (
                            <NavbarMenuItem key={`${item.label}-${index}`}>
                                <Link
                                    className="w-[60%]"
                                    color={index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"}
                                    to={item.path}
                                    size="lg"
                                >
                                    {item.label}
                                </Link>
                                {item.submenu && (
                                    <div className="submenu">
                                        {item.submenu.map((subItem, subIndex) => (
                                            <Link
                                                key={`${subItem.label}-${subIndex}`}
                                                className="submenu-item"
                                                to={subItem.path}
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>
            </div>
            <div className="hidden sm:block lg:block xl:block text-[#FEFEFE]">
                <motion.div
                    className={`Admin-Navbar flex flex-col w-["200px"] ${collapsedNav ? 'w-[87px]' : ''} h-[100vh] bg-[#ff8077]  p-3  justify-between`}
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
                                                        className={`text-base w-full h-[37px] text-[#fefefe] p-3 py-2 rounded-lg flex justify-${collapsedNav ? 'center' : 'between'} items-center group/tab ${setActive(tab.link)}`}
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
                                                        className={`cursor-pointer text-[#fefefe] ${location.pathname.startsWith(tab.link) ? setActive(tab.link) : ''} text-base w-full h-[37px] p-3 py-2 rounded-lg flex justify-${collapsedNav ? 'center' : 'between'} items-center`}
                                                    >
                                                        <p className="flex items-center">
                                                            <span className="text">{tab.icon}</span>
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
                                                                className={`fa-solid fa-chevron-${submenuVisible[tab.text] ? 'down' : 'right'} w-2 opacity-40 group-hover/tab:opacity-100 transition-all`}
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
                                                        {tab.submenu.map((submenuItem, index) => {
                                                            const submenuIsActive = submenuItem.active
                                                                ? submenuItem.active.some(path => isActive(path))
                                                                : isActive(submenuItem.link);

                                                            return (
                                                                <Link
                                                                    key={index}
                                                                    to={submenuItem.link}
                                                                    className={`cursor-pointer text-sm text-[#FEFEFE] w-full p-2 pl-5 rounded-lg flex justify-start items-center 
                                                                    ${submenuIsActive ? 'Admin_tab-active' : ''}`}
                                                                >
                                                                    {submenuItem.text}
                                                                </Link>
                                                            );
                                                        })}
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
        </>
    );
}

export default Nav;

