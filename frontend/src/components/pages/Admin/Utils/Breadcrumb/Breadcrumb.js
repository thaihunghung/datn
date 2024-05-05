import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";




const Breadcrumb = ()=> {
    return (
        <Breadcrumbs>
          <BreadcrumbItem>Chương trình</BreadcrumbItem>
          <BreadcrumbItem>Tạo chương trình</BreadcrumbItem>
          <BreadcrumbItem>Cập nhật</BreadcrumbItem>
          <BreadcrumbItem>Album</BreadcrumbItem>
          <BreadcrumbItem>Song</BreadcrumbItem>
        </Breadcrumbs>
      );
}

export default Breadcrumb;