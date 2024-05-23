import { useEffect } from "react";

const Course = (props) => {
  const { setCollapsedNav, successNoti } = props;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      aaa
    </>
  );

}

export default Course;