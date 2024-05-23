import React, {useState, useEffect, useMemo} from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tooltip } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropdownAndNavChapter = () => {
  const { id } = useParams();
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const items = useMemo(() => [
    { key: "Danh sách Chapter", label: "Danh sách Chapter", path: `/admin/management-subject/${id}/chapter/update` },
    { key: "Kho lưu trữ", label: "Kho lưu trữ", path: `/admin/management-subject/${id}/chapter/store` },
    { key: "chapter-clo", label: "CHAPTER_CLO", path: `/admin/management-subject/${id}/chapter-clo` },
    { key: "Tạo mới", label: "Tạo mới", path: `/admin/management-subject/${id}/chapter/create` }
  ], [id]);

  useEffect(() => {
    const match = items.find(item => location.pathname.startsWith(item.path));
    if (match) {
      setSelectedItem(match.key);
    }
  }, [location.pathname, items]);

  const [selectedItem, setSelectedItem] = useState('');
    const handleAction = (key) => {
        const selected = items.find(item => item.key === key);
        if (selected) {
            setSelectedItem(selected.label);
        }
    };

  return (
    <div className="flex justify-between px-5 w-full items-center">
      <div className="flex gap-2 justify-center items-center lg:hidden xl:hidden">
        <Link to={`/admin/management-subject/list`}>
          <Tooltip title="Quay lại" color={'#ff9908'}>
          <span className="p-1 flex items-center justify-center"> 
              <i class="fa-solid fa-arrow-left text-xl"></i>
              </span>
          </Tooltip>
        </Link>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="text-base font-bold">
              {selectedItem} <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions" items={items} onAction={handleAction}>
            {(item) => (
              <DropdownItem key={item.key}>
                <Link to={item.path} className="h-full">
                  <div className="min-w-[200px] text-base font-bold text-[#020401]">
                    {item.label}
                  </div>
                </Link>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>

      <div className="hidden sm:hidden lg:block xl:block">
        <div className="flex border justify-start text-base font-bold rounded-lg">
          <Link to={`/admin/management-subject/list`}>
            <Tooltip title="Quay lại" color={'#ff9908'}>
              <div className="p-5">
                <i class="fa-solid fa-arrow-left text-xl"></i>
              </div>
            </Tooltip>
          </Link>

          <Link to={`/admin/management-subject/${id}/chapter/update`}>
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-subject/${id}/chapter/update`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                Danh sách CHAPTER
              </div>
            </div>
          </Link>

          <Link to={`/admin/management-subject/${id}/chapter-clo`}>
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-subject/${id}/chapter-chapter`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
              CHAPTER_CLO
              </div>
            </div>
          </Link>

          <Link to={`/admin/management-subject/${id}/chapter/create`}>
            <div className="p-5 text-[#020401] hover:bg-[#8f99a8] rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-subject/${id}/chapter/create`) ? "border-b-4 text-[#020401] border-[#475569]" : ""} `}>
                Tạo mới
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="hidden sm:hidden lg:block xl:block">
        <Link to={`/admin/management-subject/${id}/chapter/store`}>
          <Button color="default">
            <i className="fa-solid mr-2 fa-trash-can"></i><span className="text-base">Kho lưu trữ</span>
          </Button>
        </Link>
      </div>
      <div className="lg:hidden xl:hidden">
        <Link to={`/admin/management-subject/${id}/chapter/store`}>
          <Tooltip title="Kho lưu trữ" color={'#ff9908'}>
              <button className="p-1">
              <i className="fa-solid fa-trash-can"></i>
              </button>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
}

export default DropdownAndNavChapter;

