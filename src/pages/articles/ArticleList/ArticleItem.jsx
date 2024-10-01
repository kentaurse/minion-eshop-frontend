import { memo, useState } from "react";
import {
  EyeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Image, Tooltip } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ArticleItem({ article }) {
  const { articleCategoriesForPath } = useSelector((store) => store.articleCat);
  const { user } = useSelector((store) => store.user);


  const getPath = () => {
    const selectCat = article?.categoryId;
    let categoryPath = [];
    const lastPath = articleCategoriesForPath?.find(
      (category) => category._id === selectCat
    );
    categoryPath.push(lastPath?.title);
    const makePath = (path) => {
      articleCategoriesForPath?.map((category) => {
        if (path?.parentId) {
          if (category._id === path?.parentId) {
            categoryPath.push(category?.title);
            makePath(category);
          }
        }
      });
    };
    makePath(lastPath);
    return categoryPath?.reverse().join("/");
  };

  return (
    <>
      <div className=" bg-white flex flrx-row gap-x-8 shadow-md rounded-md px-4 w-full h-[200px] text-black hover:bg-slate-200 mb-3">
        <div className="flex items-center justify-between flex-col w-[180px] p-2 flex-shrink-0">
          <Tooltip
            overlayInnerStyle={{ width: "400px", padding: "12px" }}
            placement="bottom"
            title={() => {
              return (
                <>
                  <div className="text-white-600 flex justify-between">
                    <span className="text-red-400 w-1/5">Name:</span>
                    <span className="w-4/5">
                      {article?.user?.firstName} {article?.user?.lastName}
                    </span>
                  </div>
                  <div className="text-white-600 flex justify-between">
                    <span className="text-red-400 w-1/5">Email:</span>
                    <span className="w-4/5">{article?.user?.email}</span>
                  </div>
                </>
              );
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/api/file/download/${article?.user.avatar[0]}` || "/image/avatar.png"}
              className="rounded-full w-[120px] aspect-[1/1]"
            />
          </Tooltip>
          <span className="flex justify-center mt-2 font-impact">
            {article?.user?.firstName} {article?.user?.lastName}
          </span>
        </div>
        <div className="flex flex-col items-start justify-between w-[calc(100%-220px)]">
          <Link
            to={`/app/article/${article?._id}`}
            className="cursor-pointer w-full inline-block hover:text-minionBlue"
          >
            <div className="flex flex-col w-full ">
              <div className="relative flex flex-row justify-between w-full text-black ">
                {article?.user?._id !== user._id &&
                  !article?.view.filter((item) => item === user._id).length && (
                    <span className="absolute left-[-226px] top-[9px] rounded-md -rotate-[52deg] text-xs items-center text-white bg-red-600 px-1">
                      NEW
                    </span>
                  )}
                <span className="text-lg mt-4 font-semibold font-impact">
                  {article?.title}
                </span>
                <span className="text-lg mt-4 font-semibold font-impact bg-slate-200 rounded-lg px-1 ">
                  {getPath()}
                </span>
              </div>
              <div
                className="text-md font-impact mt-2 truncate w-[80%] text-black inline-block h-[50px]"
                dangerouslySetInnerHTML={{ __html: article?.description }}
              ></div>
              <div className="h-16 flex mt-3">
                {article.files.map((file) => {
                  return (
                    <Image
                      src={`${process.env.REACT_APP_API_BASE_URL}/api/file/download/${file}`}
                      className=" rounded-full object-cover"
                    />
                  );
                })}
              </div>
            </div>
          </Link>
          <div className="flex justify-end items-center gap-x-1 w-full mb-2">
            <div className="flex items-center justify-start w-[350px]">
              <div className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer">
                <EyeIcon className='"w-5 h-5 mr-2' />
                {article?.view?.length}
              </div>
              <div className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer">
                <HandThumbUpIcon className='"w-5 h-5 mr-2' />
                {article?.like?.length}
              </div>
              <div className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer">
                <HandThumbDownIcon className='"w-5 h-5 mr-2' />
                {article?.unlike?.length}
              </div>
              <Tooltip
                title={() => {
                  return (
                    <div className="text-white-600">
                      <span className="text-red-400">Create:</span>{" "}
                      {moment(article?.createdAt).format("YYYY-MM-DD HH.MM")}
                    </div>
                  );
                }}
                placement="bottom"
              >
                <span className="text-sm font-bold py-1 pl-2 pr-3 items-center rounded-full flex basis-5/8 justify-start">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  {moment(article?.createdAt).fromNow(false)}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ArticleItem);
