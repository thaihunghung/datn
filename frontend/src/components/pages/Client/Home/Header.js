import React, { useEffect, useState } from 'react';
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
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const Header = ({ studentCode, setStudentCode }) => {
  const [activeItem, setActiveItem] = useState('home');
  const [student, setStudent] = useState('');

  const handleInputChange = (event) => {
    setStudentCode(event.target.value);
  };

  const handleItemClick = (item) => {
    console.log("item", item)
    setActiveItem(item);
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await axiosAdmin.post('/students/getAllByStudentCode', {
        studentCode
      });
      setStudent(response.data[0])
    }
    console.log("student", student)
    fetchStudent();

  }, [studentCode])
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
              CNTT
            </div>
          </div>
        </NavbarBrand>
        {/* <NavbarContent className="hidden sm:flex gap-24">
          <NavbarItem isActive={activeItem === 'home'} >
            <Link className='text-large'
              color={activeItem === 'home' ? 'secondary' : 'foreground'}
              aria-current="page"
              href="#"
              onClick={() => handleItemClick('home')}
            >
              Trang chủ
            </Link>
          </NavbarItem>
          <NavbarItem isActive={activeItem === 'courses'} >
            <Link className='text-large'
              href="#"
              aria-current="page"
              color={activeItem === 'courses' ? 'secondary' : 'foreground'}
              onClick={() => handleItemClick('courses')}
            >
              Khóa học
            </Link>
          </NavbarItem>
        </NavbarContent> */}
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
              src="https://i.pinimg.com/564x/67/33/40/673340b2196b91f159e06556b4db196e.jpg"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            
             <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">{student?.name }</p>
              <p className="font-semibold">{student?.email}</p>
            </DropdownItem>
            <DropdownItem key="team_settings">{student?.class?.classNameShort }</DropdownItem>
            <DropdownItem key="settings">{student?.class?.className }</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className='flex flex-col text-left'>
          <p>{student?.name}</p>
          <p>{student?.email}</p>
        </div>

      </NavbarContent>
    </Navbar>
  );
};

export default Header;
