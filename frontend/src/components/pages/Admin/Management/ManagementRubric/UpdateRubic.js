// UpdateRubic.js

import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import TodoList from "../../Utils/TodoList/TodoList";
import DropdownAndNavRubric from "../../Utils/DropdownAndNav/DropdownAndNavRubric";

const UpdateRubic = (nav) => {
  const { id } = useParams();
  const location = useLocation();
  const { setCollapsedNav, successNoti, errorNoti, setSpinning } = nav;
  const [RubicData, setRubicData] = useState([]);
  const [data, setData] = useState([]);
  const [CloData, setCloData] = useState([]);
  const [ChapterData, setChapterData] = useState([]);
  const GetRubicAndItemsById = async () => {
    const response = await axiosAdmin.get(`/rubric/${id}/items`)
    console.log(response.data.rubric.rubricItems);
    setRubicData(response.data.rubric.rubricItems)
    setData(response.data.rubric.rubricItems)
    setCloData(response.data.rubric.CloData)
    setChapterData(response.data.rubric.ChapterData)
  }

  useEffect(() => {
    GetRubicAndItemsById()
    //allProgramIsDelete()
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
      //console.log(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
      <DropdownAndNavRubric />
      <div className="w-full mt-5 rounded-lg">
        <TodoList data={data} rubric_id={id} Clo={CloData} Chapter={ChapterData} successNoti={successNoti} setSpinning={setSpinning} />
        {RubicData.map((rubricItem) => (
          <div className="w-full flex justify-center" key={rubricItem.rubric_id}>
            <div>
              {/* Content for the first div */}
            </div>
            <div className="w-full">


            </div>
            <div>
              {/* Content for the third div */}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}


export default UpdateRubic;
