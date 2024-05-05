// import logo from "../../../../assets/KTCN.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, signOut } from "../../../../../service/firebase";
// import { postToken, logoutToken } from "../../../../service/LoginService";
import {
    User,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    ScrollShadow,
    Button,
} from "@nextui-org/react";
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, NavbarContent, NavbarItem } from "@nextui-org/react";

import { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { motion } from "framer-motion";

function Nav(props) {
    const navigate = useNavigate();
    const [submenuVisible, setSubmenuVisible] = useState({});

    // Function to toggle visibility of submenu
    const toggleSubmenu = (text) => {
        setSubmenuVisible({
            ...submenuVisible,
            [text]: !submenuVisible[text]
        });
    };
    const location = useLocation();
    const { collapsedNav, setCollapsedNav, setSpinning } = props;

    const [currentUser, setCurrentUser] = useState(null);
    //const [Authdata, setAuth] = useState(null);

    const setActive = (href) => {
        
        if (location.pathname === href) return "Admin_tab-active";
        // if (location.pathname.startsWith(href)) return "Admin_tab-active";
        return "";
    };
    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];
    const navTab = [
        {
            text: "Tổng quan",
            link: "/admin",
            icon: (
                <i
                    className={`fa-solid fa-bolt mr-${collapsedNav ? "0" : "3"} w-4`}
                ></i>
            ),
        },
        {
            text: "Quản lý chương trình",
            icon: (
                <i
                    className={`fa-solid fa-pen-clip mr-${collapsedNav ? "0" : "3"} w-4`}
                ></i>
            ),
            submenu: [
                {
                    text: "Program",
                    link: "/admin/manage-program",
                    icon: (
                        <i
                            className={`fa-regular fa-user mr-${collapsedNav ? "0" : "3"} w-4`}
                        ></i>
                    ),
                },
                {
                    text: "Plo",
                    link: "/admin/manage-plo",
                    icon: (
                        <i
                            className={`fa-regular fa-user mr-${collapsedNav ? "0" : "3"} w-4`}
                        ></i>
                    ),
                },
                {
                    text: "po",
                    link: "/admin/manage-po",
                    icon: (
                        <i
                            className={`fa-regular fa-user mr-${collapsedNav ? "0" : "3"} w-4`}
                        ></i>
                    ),
                },

            ],
        },

    ];


    useEffect(() => {
        
        onAuthStateChanged(auth, async (user) => {
            setCurrentUser(auth)
            console.log(auth)
            // if (user) {
            //     const response = await postToken(
            //         user.email,
            //         user.uid,
            //         user.photoURL,
            //         user.displayName
            //     );
            //     if (response.data.email === user.email) {
            //         setCurrentUser(response.data);
            //     }
            // } else {
            //     alert("Bạn không có quyền vô trang này");
            //     await signOut(auth);
            //     setCurrentUser(null);
            //     navigate("/");
            // }
        });
    }, []);

    const handleLoginWithGoogle = async (onClose) => {};
    const handleLogout = async () => {
        setSpinning(true);
        try {
            await Promise.all([signOut(auth)]);
            setSpinning(false);
            navigate("/login");
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

                            <p className="font-bold text-inherit">ACME</p>
                        </NavbarBrand>
                    </NavbarContent>

                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        <NavbarBrand>

                            <p className="font-bold text-inherit">ACME</p>
                        </NavbarBrand>
                        <NavbarItem>
                            <Link color="foreground" href="#">
                                Features
                            </Link>
                        </NavbarItem>
                        <NavbarItem isActive>
                            <Link href="#" aria-current="page" color="warning">
                                Customers
                            </Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Link color="foreground" href="#">
                                Integrations
                            </Link>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarContent justify="end">
                        <NavbarItem className="hidden lg:flex">
                            <Link href="#">Login</Link>
                        </NavbarItem>
                        <NavbarItem>
                            <Button as={Link} color="warning" href="#" variant="flat">
                                Sign Up
                            </Button>
                        </NavbarItem>
                    </NavbarContent>

                    <NavbarMenu>
                        {menuItems.map((item, index) => (
                            <NavbarMenuItem key={`${item}-${index}`}>
                                <Link
                                    className="w-full"
                                    color={
                                        index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                                    }
                                    href="#"
                                    size="lg"
                                >
                                    {item}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </NavbarMenu>
                </Navbar>

            </div>
            <div className="hidden sm:block lg:block xl:block text-[white]">


                <motion.div
                    className={`Admin-Navbar flex flex-col w-["270px"] ${collapsedNav ? "w-[87px]" : ""
                        } h-[100vh] bg-slate-800 p-3  justify-between`}
                    initial={{ width: "270px" }}
                    animate={{ width: collapsedNav ? "87px" : "270px" }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="grid grid-rows-[auto,auto] h-[100vh] flex-1">
                        <div
                            className={`flex w-full h-[50px] justify-${collapsedNav ? "center" : "between"
                                } items-center p-${collapsedNav ? "2" : "3"}`}
                        >
                            <motion.div
                                className="flex gap-3 items-center h-fit"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: collapsedNav ? 0 : 1 }}
                                transition={{
                                    duration: collapsedNav ? 0 : 0.4,
                                    delay: collapsedNav ? 0 : 0.4,
                                }}
                            >
                                {!collapsedNav ? (
                                    <>
                                        <img width={20} alt="" />
                                        <span className="font-bold mt-[1px]">SET</span>
                                    </>
                                ) : (
                                    ""
                                )}
                            </motion.div>
                            <Tooltip
                                title={collapsedNav ? "Mở rộng" : "Thu gọn"}
                                placement="right"
                            >
                                <Button
                                    isIconOnly
                                    variant="light"
                                    radius="full"
                                    onClick={handleToggleNav}
                                >
                                    {collapsedNav ? (
                                        <i className="fa-solid fa-chevron-right text-[white]"></i>
                                    ) : (
                                        <i className="fa-solid fa-chevron-left text-[white]"></i>
                                    )}
                                </Button>
                            </Tooltip>
                        </div>
                        <ScrollShadow
                            className="flex-1"
                            hideScrollBar
                            style={{ height: "calc(100vh - 130px)" }}
                        >
                            <div className="flex flex-col gap-2 overflow-auto overflow-x-hidden">
                                <hr className="opacity-10 m-auto w-[30px] px-2 mb-2 border-[1.5px]" />
                                {navTab.map((tab) => (
                                    <div key={tab.text}>
                                        {/* <Tooltip
                                    //title={collapsedNav ? tab.text : ""}
                                    placement="right"
                                > */}
                                        <div onClick={() => toggleSubmenu(tab.text)}>
                                            {tab.link ? (
                                                <Link
                                                    to={tab.link}
                                                    className={`text-[14px] w-full h-[37px] hover:bg-slate-600 p-3 py-2 rounded-lg flex justify-${collapsedNav ? "center" : "between"
                                                        } items-center group/tab ${setActive(tab.link)}`}
                                                >
                                                    <p className="flex items-center">
                                                        {tab.icon}
                                                        <motion.span
                                                            initial={{ opacity: 1 }}
                                                            animate={{
                                                                opacity: collapsedNav ? 0 : 1,
                                                            }}
                                                            transition={{
                                                                duration: collapsedNav ? 0 : 0.4,
                                                                delay: collapsedNav ? 0 : 0.4,
                                                            }}
                                                            style={{ whiteSpace: "nowrap" }}
                                                        >
                                                            {!collapsedNav && tab.text}
                                                        </motion.span>
                                                    </p>
                                                    {!collapsedNav && (
                                                        <i className="fa-solid fa-chevron-right text-[11px] hidden group-hover/tab:block"></i>
                                                    )}
                                                </Link>
                                            ) : (
                                                <div className={`text-[14px] w-full h-[37px] hover:bg-slate-600 p-3 py-2 rounded-lg flex   justify-${collapsedNav ? "center" : "between"} items-center group/tab ${setActive(tab.text)}`}>
                                                    <p className="flex items-center">
                                                        {tab.icon}
                                                        <motion.span
                                                            initial={{ opacity: 1 }}
                                                            animate={{ opacity: collapsedNav ? 0 : 1 }}
                                                            transition={{ duration: collapsedNav ? 0 : 0.4, delay: collapsedNav ? 0.4 : 0 }}
                                                            style={{ whiteSpace: "nowrap" }}
                                                        >
                                                            {!collapsedNav && tab.text}
                                                        </motion.span>
                                                    </p>
                                                    {!collapsedNav && <i className="fa-solid fa-chevron-right text-[10px] ow hidden group-hover/tab:block"></i>}
                                                    {submenuVisible[tab.text] && tab.submenu && (
                                                        <div className={`${collapsedNav ? "block" : "hidden"}  w-fit absolute flex flex-col left-20  z-10 bg-slate-400 rounded-lg`}>
                                                            {tab.submenu.map((subitem) => (
                                                                <Link
                                                                    key={subitem.text}
                                                                    to={subitem.link}
                                                                    className={`text-[14px] p-5  h-[30px]  hover:bg-slate-600 flex  justify-${collapsedNav ? "center" : "between"} items-center group/tab ${setActive(subitem.link)}`}
                                                                >
                                                                    <p className="flex items-center">

                                                                        <motion.span
                                                                            initial={{ opacity: 1 }}
                                                                            animate={{ opacity: collapsedNav ? 1 : 1 }}
                                                                            transition={{ duration: collapsedNav ? 0.4 : 0.4, delay: collapsedNav ? 0.4 : 0.4 }}
                                                                            style={{ whiteSpace: "nowrap" }}
                                                                        >
                                                                            @ {collapsedNav && subitem.text}
                                                                        </motion.span>
                                                                    </p>
                                                                    {!collapsedNav && <i className="fa-solid fa-chevron-bottom text-[11px] hidden group-hover/tab:block"></i>}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}

                                                </div>
                                            )}

                                        </div>
                                        {/* </Tooltip> */}
                                        {submenuVisible[tab.text] && tab.submenu && (
                                            <div className={`pl-3 ${collapsedNav ? "hidden" : "block"}`}>
                                                {tab.submenu.map((subitem) => (
                                                    <Link
                                                        key={subitem.text}
                                                        to={subitem.link}
                                                        className={`text-[14px] w-full h-[37px] hover:bg-slate-600 p-3 py-2 rounded-lg flex justify-${collapsedNav ? "center" : "between"} items-center group/tab ${setActive(subitem.link)}`}
                                                    >
                                                        <p className="flex items-center ml-10">
                                                            <motion.span
                                                                initial={{ opacity: 1 }}
                                                                animate={{ opacity: collapsedNav ? 0 : 1 }}
                                                                transition={{ duration: collapsedNav ? 0 : 0.4, delay: collapsedNav ? 0 : 0.4 }}
                                                                style={{ whiteSpace: "nowrap" }}
                                                            >
                                                                @ {!collapsedNav && subitem.text}
                                                            </motion.span>
                                                        </p>
                                                        {!collapsedNav && <i className="fa-solid fa-chevron-bottom text-[11px] hidden group-hover/tab:block"></i>}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        </ScrollShadow>
                    </div>
                    <div className="h-fit">
                        {currentUser ? (
                            <Dropdown placement="bottom-start">
                                <DropdownTrigger>
                                    <div className="flex items-center w-full justify-between hover:bg-slate-600 p-3 py-2 rounded-lg">
                                        <User
                                            name={
                                                !collapsedNav ? (
                                                    <p className="font-semibold">
                                                        {currentUser.displayName}
                                                    </p>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            description={
                                                !collapsedNav ? currentUser.email : ""
                                            }
                                            avatarProps={{
                                                src: currentUser.photoURL,
                                            }}
                                            classNames={{
                                                base: `${collapsedNav ? "gap-0" : "gap-2"
                                                    }`,
                                            }}
                                        />
                                        {!collapsedNav ? (
                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                        ) : null}
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="User Actions"
                                    classNames={{
                                        base: "min-w-[230px]",
                                    }}
                                >
                                    <DropdownItem
                                        key="profile"
                                        className="h-14 gap-2"
                                        isReadOnly
                                    >
                                        <p className="font-semibold opacity-50">
                                            {currentUser?.role === 1
                                                ? "Super Admin"
                                                : "Admin"}
                                        </p>
                                        <p className="font-bold">{currentUser.email}</p>
                                    </DropdownItem>
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            key="settings"
                                            startContent={
                                                <i className="fa-solid fa-gear"></i>
                                            }
                                        >
                                            Cài đặt
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownItem
                                        key="logout"
                                        color="danger"
                                        startContent={
                                            <i className="fa-solid fa-right-from-bracket"></i>
                                        }
                                        onClick={() => {
                                            // handleLogout();
                                        }}
                                    >
                                        Đăng xuất
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <Button
                                color="primary"
                                className="w-full"
                                onClick={() => {
                                    handleLoginWithGoogle();
                                }}
                                isIconOnly={collapsedNav}
                            >
                                {collapsedNav ? (
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default Nav;








