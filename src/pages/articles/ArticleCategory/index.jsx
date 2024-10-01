import { useState } from "react";
import { useSelector } from "react-redux";
import ArticleCat from "./ArticleCat";
import { Button, Drawer } from "antd";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import AdminArticleCategory from "./AdminArticleCategory";

function Article() {
  const { user } = useSelector((store) => store.user);

  const [open, setOpen] = useState(false);

  const drawerAction = () => {
    setOpen(!open);
  };

  return (
    <>
      <Drawer
        title={
          <div className="px-3 gap-x-2 flex pb-3">
            <Cog6ToothIcon className="w-6 h-6" />
            Edit Category
          </div>
        }
        className="mt-[77px]"
        placement={"left"}
        width={400}
        onClose={drawerAction}
        closable={false}
        open={open}
        key={"left"}
        styles={{ body: { padding: "0 15px" } }}
        extra={
          <div onClick={drawerAction} className="cursor-pointer">
            <XMarkIcon className="w-8 h-8" />
          </div>
        }
      >
        <AdminArticleCategory />
      </Drawer>
      <div className="bg-white pt-6 min-h-full">
        {user?.role === "admin" && (
          <Button
            className="absolute z-10 rounded-full shadow-xl top-[25px] bg-gray-100 right-[25px] justify-center  font-bold flex items-center border-none cursor-pointer w-10 h-10 p-1"
            onClick={drawerAction}
          >
            <Cog6ToothIcon className="w-16 h-16" />
          </Button>
        )}
        <ArticleCat />
      </div>
    </>
  );
}

export default Article;
