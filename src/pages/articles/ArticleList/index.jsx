import { memo, useEffect, useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  TreeSelect,
  Upload,
} from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../../redux/headerSlice";
import EditorComponent from "./Editor";
import { useLocation, useNavigate } from "react-router-dom";
import { pathQuerySearch, pathSearchQuery } from "../../../library/path";
import ArticleItem from "./ArticleItem";
import { FaFilter, FaNewspaper, FaUser } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";
import { NotificationManager } from "react-notifications";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ArticleList() {
  const { search } = useLocation();
  const [searchArticle, setSearchArticle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [articles, setArticles] = useState([]);
  const [editorValue, setEditorValue] = useState("");
  const [total, setTotal] = useState(0);
  const [flag, setFlag] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const showSide = useSelector((store) => store.side.showSide);
  const { articleCategories } = useSelector((store) => store.articleCat);
  const { user } = useSelector((store) => store.user);

  const query = pathSearchQuery(search);
  const [form] = Form.useForm();
  const selectRef = useRef(null);
  const titleRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTextChange = (value) => {
    setEditorValue(value);
  };

  const onsubmit = async (e) => {
    e.preventDefault();

    const sendData = await form.validateFields();
    let fileIdList = [];
    if (fileList.length > 0) {
      const data = await imageUpload();
      fileIdList = data.uploaded.map((item) => {
        return item?._id;
      });
    }

    const t = editorValue?.replace(/<.>/g, "").replace(/<..>/g, ""); //remove html tags with regexp

    if (t?.length === 0) {
      dispatch(showNotification({ message: "Input Description", status: 0 }));
      return;
    }
    if (!sendData.title) {
      dispatch(showNotification({ message: "Input Title", status: 0 }));
      titleRef.current.focus();
    }
    if (!sendData.category) {
      dispatch(showNotification({ message: "Select Category", status: 0 }));
      descRef.current.focus();
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/article`, {
        ...sendData,
        files: fileIdList,
        description: editorValue,
      });
      setIsOpen(false);
      setFlag(true);
      form.resetFields();
      setFileList([]);

      NotificationManager.success("Article created successfully", "", 2000);
    } catch (e) {
      NotificationManager.error("Server is not running correctly", "", 2000);
    }
  };

  const imageUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file, index) => {
      formData.append("file_" + index, file.originFileObj);
    });
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (e) {
      NotificationManager.error(
        "File server is not running correctly",
        "",
        2000
      );
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = file.getBase64(originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const getArticles = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/article`
    );
    setArticles(res?.data?.articles);
  };

  const cutArticleCategory = (data) => {
    //following select category, get it and it's child categories
    let selectedCat = data;
    if (!selectedCat) selectedCat = articleCategories[0]?._id;
    let mainCategory = [];
    let flag = false;
    let finishFlag = true;
    const cutTree = (tempCategory) => {
      tempCategory.map((item) => {
        if (item?._id === selectedCat) {
          flag = true;
          mainCategory.push(item?._id);
          if (item?.children) {
            cutTree(item?.children);
          }
          finishFlag = false;
        }
        if (flag && finishFlag) mainCategory.push(item?._id);
        if (item?.children && finishFlag) cutTree(item?.children);
      });
    };
    cutTree(articleCategories);
    return mainCategory;
  };

  let searchedData = viewData;
  if (viewData?.length > 0) {
    searchedData = viewData?.filter(
      (article) =>
        article.title?.toLowerCase().indexOf(searchArticle?.toLowerCase()) !==
          -1 ||
        article.description
          .toLowerCase()
          .indexOf(searchArticle?.toLowerCase()) !== -1
    );
  } else {
    searchedData = viewData;
  }

  const setData = (data) => {
    let filterData = [];
    //My Articles or when select categories
    if (query.mine) {
      filterData = articles?.filter(
        (article) =>
          article?.user?._id === user?._id &&
          article?.ancestorId === article?._id
      );
    } else {
      filterData = articles?.filter((article) =>
        data.includes(article?.categoryId)
      );
    }
    //new articles
    if (query.new) {
      filterData = articles.filter(article => article._id === article.ancestorId).filter(
        (article) =>
          article?.user._id !== user._id &&
          !article?.view.filter((item) => item === user._id).length
      );
    }

    //pagination
    setTotal(filterData?.length);
    if (
      filterData?.length &&
      !filterData?.slice(
        ((Number(query?.PN) || 1) - 1) * (Number(query?.PS) || 10),
        (Number(query?.PN) || 1) * (Number(query?.PS) || 10)
      ).length
    )
      navigate(
        pathQuerySearch({ ...query, PN: Number(query?.PN) - 1, PS: query?.PS })
      );
    //when delete last article of last page, go to prev page because there is no article on that page
    const lastList = filterData?.slice(
      ((Number(query?.PN) || 1) - 1) * (Number(query?.PS) || 10),
      (Number(query?.PN) || 1) * (Number(query?.PS) || 10)
    );
    setViewData(lastList);
  };
  useEffect(() => {
    setFlag(false);
    getArticles();
  }, [flag]);

  useEffect(() => {
    if (articleCategories?.length && articles?.length) {
      setData(cutArticleCategory(query?.Cat));
    }
  }, [articles, search]);
  return (
    <>
      <div
        className={`sticky top-0 right-0 ${
          showSide === true ? "w-[calc(100%)]" : "w-full"
        }  h-[60px] bg-slate-200 duration-500 flex items-center justify-end z-50`}
      >
        <div>
          <button
            className="absolute flex items-center justify-center float-right gap-2 top-4 px-2 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md text-white bg-minionBlue duration-300 left-[100px] overflow-hidden"
            onClick={() => navigate(pathQuerySearch({ new: true }))}
          >
            <FaNewspaper className=" w-4 h-4" /> UnReads
          </button>
        </div>
        <div className="absolute items-end flex justify-end right-[350px] top-[13px] ">
          <input
            type="search"
            placeholder="...filter"
            className="top-3  font-sans w-6/12 text-minionBlue rounded-tl-lg rounded-bl-lg border-[1px] text-lg border-stroke bg-transparent py-1 px-4 text-md outline-none transition border-minionBlue active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            onChange={(e) => {
              setSearchArticle(e.target.value);
            }}
          />
          <span className=" rounded-tr-lg rounded-br-lg bg-minionBlue px-2 py-2 text-white text-xl border-[1.5px] border-stroke border-minionBlue">
            <FaFilter />
          </span>
        </div>
        <div>
          <button
            className="absolute flex items-center justify-center right-4 float-right gap-2 top-4 px-2 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md text-white bg-minionBlue duration-300"
            onClick={() => setIsOpen(true)}
          >
            <PencilIcon className=" w-4 h-4" /> Create
          </button>
        </div>
        <div>
          <button
            className="absolute flex items-center justify-center right-[150px] float-right gap-2 top-4 px-2 py-1  hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md text-white bg-minionBlue duration-300"
            onClick={() => navigate(pathQuerySearch({ mine: `${user?._id}` }))}
          >
            <FaUser className=" w-4 h-4" /> My Articles
          </button>
        </div>
      </div>
      <div className="w-full  px-4 h-[calc(100%)] bg-slate-200">
        {searchedData.length > 0 ? (
          searchedData?.map((article, index) => {
            return <ArticleItem article={article} key={index} />;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        <div className="fixed bottom-0 bg-slate-200 mt-[-15px] w-full pr-[300px] flex justify-center py-2">
          <Pagination
            pageSize={Number(query?.PS) || 10}
            current={Number(query?.PN) || 1}
            total={total}
            showQuickJumper
            showLessItems
            responsive
            onChange={(page, pageSize) => {
              navigate(pathQuerySearch({ ...query, PN: page, PS: pageSize }));
            }}
            showSizeChanger
            showTotal={(total) => `${total} articles`}
          />
        </div>
      </div>
      <Modal
        width={800}
        open={isOpen}
        footer={false}
        onCancel={() => setIsOpen(false)}
        destroyOnClose
      >
        <Form form={form}>
          <label
            htmlFor="newArticle"
            className="block text-xl text-gray-700 pt-5 pb-2"
          >
            Select Category
          </label>
          <Form.Item name={"category"}>
            <TreeSelect
              notFoundContent={""}
              ref={selectRef}
              defaultValue={"Select Category"}
              treeLine
              treeDefaultExpandAll
              treeData={articleCategories}
              fieldNames={{ label: "title", value: "_id" }}
              className="h-8"
            />
          </Form.Item>

          <label htmlFor="newArticle" className="block text-xl text-gray-700">
            Title
          </label>
          <Form.Item name={"title"}>
            <Input
              ref={titleRef}
              placeholder="Input Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={"mt-2 h-[35px] p-[10px]"}
            />
          </Form.Item>
          <label htmlFor="newArticle" className="block text-xl text-gray-700">
            Description
          </label>
          <Form.Item name={"description"}>
            <EditorComponent
              editorValue={editorValue}
              onEditorChange={onTextChange}
              mode={"add"}
            />
          </Form.Item>
          <Form.Item>
            <Upload
              action={process.env.REACT_APP_API_BASE_URL + "/api/file/upload"}
              listType="picture-circle"
              onPreview={handlePreview}
              onChange={handleChange}
            >
              <button
                style={{
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="submit"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-end float-right gap-2 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md mx-2 my-4 text-white bg-minionBlue duration-300"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              onClick={onsubmit}
              className="flex items-center justify-end float-right gap-2 px-4 py-2 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md mx-2 my-4 text-white bg-minionBlue duration-300"
            >
              CREATE
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default memo(ArticleList);
