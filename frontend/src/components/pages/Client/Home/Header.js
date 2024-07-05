import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';

const Header = ({ studentCode, setStudentCode }) => {
  const handleInputChange = (event) => {
    setStudentCode(event.target.value);
  };

  console.log("studentCode", studentCode)
  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-8">
          <div className="flex justify-start items-center p-4">
            <div className="text-2xl font-bold flex items-center">
              <span className="bg-purple-600 text-white rounded-full px-2 py-1 mr-2">
                SET
              </span>
              LA
            </div>
          </div>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-8">
          <NavbarItem>
            <Link className='text-large' color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link className='text-large' href="#" aria-current="page" color="secondary">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='text-large' color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[20rem] h-10 ",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Nhập mã sinh viên ..."
          size="sm"
          startContent={<SearchOutlined size={18} />}
          type="search"
          value={studentCode}
          onChange={handleInputChange}
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">My Settings</DropdownItem>
            <DropdownItem key="team_settings">Team Settings</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="system">System</DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">Log Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
