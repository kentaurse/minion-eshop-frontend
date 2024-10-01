import { memo, useEffect, useRef, useState } from "react";
import {
  EyeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ClockIcon,
  ChatBubbleBottomCenterIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  Tooltip,
  Modal,
  Form,
  Input,
  Button,
  Select,
  TreeSelect,
  Image,
  Upload,
} from "antd";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import EditorComponent from "./Editor";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../../redux/headerSlice";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { NotificationManager } from "react-notifications";

function Action({ selectedArticle, addlike, addUnlike, user, getArticles }) {
  const [reviewModal, setReviewModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [flag, setFlag] = useState(false);
  const [editorState, setEditorState] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedArticle?.title);
  const [editedCategory, setEditedCategory] = useState(
    selectedArticle?.categoryId
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editFileList, setEditFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { articleCategories, articleCategoriesForPath } = useSelector(
    (store) => store.articleCat
  );

  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTextChange = (value) => {
    setEditorValue(value);
  };

  const getAarticle = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/article/${selectedArticle?._id}`
    );
    setEditorValue(res?.data?.article?.description);
  };

  const [form] = Form.useForm();

  const getPath = () => {
    const selectCat = selectedArticle?.categoryId;
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

  const onsubmit = async (e) => {
    e.preventDefault();

    const sendData = await form.getFieldsValue();
    let fileIdList = [];
    if (fileList.length > 0) {
      const data = await imageUpload(fileList);
      fileIdList = data.uploaded.map((item) => {
        return item?._id;
      });
    }

    const t = editorValue.replace(/<.>/g, "").replace(/<..>/g, "");
    if (t?.length === 0) {
      dispatch(showNotification({ message: "Input Description", status: 0 }));
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/article/review/${selectedArticle?._id}`,
        {
          ...sendData,
          files: fileIdList,
          description: editorValue,
        }
      );
      getArticles();
      setReviewModal(false);
      setFlag(true);
      form.resetFields();
      setFileList([]);
      NotificationManager.success("Create Successfully", "", 2000);
    } catch (e) {
      NotificationManager.error("Server is not running correctly", "", 2000);
    }
  };

  const imageUpload = async (fileList) => {
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

  useEffect(() => {
    if (editorState) {
      setFileList(selectedArticle?.files);
    }
  }, [editorState]);

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

  const editHandleChange = ({ fileList: newFileList }) => {
    setEditFileList(newFileList);
  };

  const onEdit = async () => {
    let fileIdList = [];
    const t = editorValue.replace(/<.>/g, "").replace(/<..>/g, "");
    if (editFileList.length > 0) {
      const data = await imageUpload(editFileList);
      fileIdList = data.uploaded.map((item) => {
        return item?._id;
      });
    }
    if (t?.length === 0) {
      dispatch(showNotification({ message: "Input Description", status: 0 }));
    }

    if (selectedArticle?._id === selectedArticle?.ancestorId) {
      if (!editedTitle) {
        dispatch(showNotification({ message: "Input Title", status: 0 }));
        titleRef.current.focus();
      }
      if (!editedCategory) {
        dispatch(showNotification({ message: "Select Category", status: 0 }));
        categoryRef.current.focus();
      }
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/article/${selectedArticle?._id}`,
        {
          title: editedTitle,
          category: editedCategory,
          files: [...fileList, ...fileIdList],
          description: editorValue,
        }
      );
      getArticles();
      setEditorState(false);
      setFlag(true);
      NotificationManager.success("Update Successfully", "", 2000);
    } catch (e) {
      NotificationManager.error("Server is not running correctly", "", 2000);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/article/${selectedArticle?._id}`
      );
      if (selectedArticle?._id === selectedArticle?.ancestorId) {
        // window.location.to = -1;
        navigate("/app/article");
      }
      getArticles();
      setFlag(true);
      setDeleteModal(false);
      NotificationManager.success("Delete Successfully", "", 2000);
    } catch (e) {
      NotificationManager.error("Delete Failed", "", 2000);
    }
  };

  useEffect(() => {
    setFlag(false);
    getAarticle();
  }, [flag, editorState]);

  const deletefile = (id) => {
    setFileList(fileList.filter((file) => file !== id));
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="flex items-center justify-between flex-col w-[100px] p-2 flex-shrink-0 h-fit">
          <Tooltip
            overlayInnerStyle={{ width: "400px", padding: "12px" }}
            placement="bottom"
            title={() => {
              return (
                <>
                  <div className="text-white-600 flex justify-between">
                    <span className="text-red-400 w-1/5">Name:</span>
                    <span className="w-4/5">
                      {selectedArticle?.user?.firstName}{" "}
                      {selectedArticle?.user?.lastName}
                    </span>
                  </div>
                  <div className="text-white-600 flex justify-between">
                    <span className="text-red-400 w-1/5">Email:</span>
                    <span className="w-4/5">
                      {selectedArticle?.user?.email}
                    </span>
                  </div>
                </>
              );
            }}
          >
            <img
              src={
                `${process.env.REACT_APP_API_BASE_URL}/api/file/download/${selectedArticle?.user.avatar[0]}` ||
                "/image/avatar.png"
              }
              className="rounded-full w-[80px] aspect-[1/1]"
            />
          </Tooltip>
          <span className="flex justify-center mt-2 font-impact text-black">
            {selectedArticle?.user?.firstName} {selectedArticle?.user?.lastName}
          </span>
        </div>
        <div className=" bg-white flex shadow-md rounded-md px-6 py-2 w-full  text-black mt-3">
          <div className="flex flex-col items-start justify-between w-[calc(100%)] ">
            <div className="flex flex-col w-full ">
              {selectedArticle?.title ? (
                editorState ? (
                  <Input
                    ref={titleRef}
                    defaultValue={selectedArticle?.title}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="mt-4"
                  />
                ) : (
                  <div className="flex flex-row justify-between w-full text-black ">
                    <span className="text-lg mt-4 font-semibold font-impact h-[20px]">
                      {selectedArticle?.title}
                    </span>
                    <span className="text-lg mt-4 font-semibold font-impact bg-slate-200 rounded-lg px-1 ">
                      {getPath()}
                    </span>
                  </div>
                )
              ) : (
                <></>
              )}
              {selectedArticle?.title && editorState ? (
                <TreeSelect
                  ref={categoryRef}
                  notFoundContent={""}
                  defaultValue={selectedArticle?.categoryId}
                  treeLine
                  treeDefaultExpandAll
                  treeData={articleCategories}
                  onChange={(e) => setEditedCategory(e)}
                  fieldNames={{ label: "title", value: "_id" }}
                  className="h-8 my-4"
                />
              ) : (
                <></>
              )}

              {selectedArticle?.description ? (
                editorState ? (
                  <EditorComponent
                    editorValue={editorValue}
                    onEditorChange={onTextChange}
                  />
                ) : (
                  <div
                    className="text-md font-impact mt-3 mb-8 w-[80%] text-black break-all"
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle?.description,
                    }}
                  ></div>
                )
              ) : (
                <></>
              )}
              {selectedArticle?.files ? (
                editorState ? (
                  <>
                    <div className="flex items-center justify-center h-28">
                      {fileList?.map((file, index) => {
                        return (
                          <>
                            <div
                              className="flex flex-col justify-center items-center"
                              key={index}
                            >
                              <Image
                                src={`${process.env.REACT_APP_API_BASE_URL}/api/file/download/${file}`}
                                className=" rounded-full object-cover"
                              />
                              <DeleteOutlined
                                className="mt-1 border-red-600"
                                onClick={() => deletefile(file)}
                              />
                            </div>
                          </>
                        );
                      })}
                      <Upload
                        action={
                          process.env.REACT_APP_API_BASE_URL +
                          "/api/file/upload"
                        }
                        listType="picture-circle"
                        onPreview={handlePreview}
                        onChange={editHandleChange}
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
                    </div>
                  </>
                ) : (
                  <div className="h-16 flex">
                    {selectedArticle.files.map((file) => {
                      return (
                        <Image
                          src={`${process.env.REACT_APP_API_BASE_URL}/api/file/download/${file}`}
                          className=" rounded-full object-cover"
                        />
                      );
                    })}
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
            <div className="flex justify-end items-center gap-x-1 w-full">
              <div className="flex items-center justify-end w-[550px]">
                <div className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer">
                  <EyeIcon className='"w-5 h-5 mr-2' />
                  {selectedArticle?.view?.length}
                </div>
                <div
                  className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer"
                  onClick={() => addlike(selectedArticle?._id)}
                >
                  <HandThumbUpIcon className='"w-5 h-5 mr-2' />
                  {selectedArticle?.like?.length}
                </div>
                <div className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer">
                  <HandThumbDownIcon
                    className='"w-5 h-5 mr-2'
                    onClick={() => addUnlike(selectedArticle?._id)}
                  />
                  {selectedArticle?.unlike?.length}
                </div>
                <Tooltip
                  title={() => {
                    return (
                      <div className="text-white-600">
                        <span className="text-red-400">Create:</span>{" "}
                        {moment(selectedArticle?.createdAt).format(
                          "YYYY-MM-DD HH.MM"
                        )}
                      </div>
                    );
                  }}
                  placement="bottom"
                >
                  <span className="text-sm font-bold py-1 pl-2 pr-3 items-center rounded-full flex basis-5/8 justify-start">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    {moment(selectedArticle?.createdAt).fromNow(false)}
                  </span>
                </Tooltip>
                {(user?._id === selectedArticle?.user?._id ||
                  user?.role === "admin") && (
                  <>
                    <div className="px-2 rounded-full flex basis-1/8 items-center justify-start cursor-pointer">
                      {editorState ? (
                        <>
                          <button
                            className="px-1 py-1 pr-2 mr-2 font-bold text-white bg-minionBlue flex items-center rounded-md hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue duration-200"
                            onClick={onEdit}
                          >
                            <ChatBubbleBottomCenterIcon className="w-5 h-5 mr-1" />
                            Save
                          </button>
                          <button
                            className="px-1 py-1 pr-2 font-bold bg-minionRed text-white flex items-center rounded-md hover:bg-white  border-[1px] hover:text-minionRed duration-200"
                            onClick={() => setEditorState(false)}
                          >
                            <PencilSquareIcon className="w-4 h-4 mr-1" />
                            Cancle
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-1 py-1 pr-2 mr-2 font-bold text-white bg-minionBlue flex items-center rounded-md hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue duration-200"
                            onClick={() => setReviewModal(true)}
                          >
                            <ChatBubbleBottomCenterIcon className="w-5 h-5 mr-1" />
                            Review
                          </button>
                          <button
                            className="px-1 py-1 pr-2 font-bold bg-minionRed text-white flex items-center rounded-md hover:bg-white  border-[1px] hover:text-minionRed duration-200"
                            onClick={() => setDeleteModal(true)}
                          >
                            <TrashIcon className="w-5 h-5 mr-1" />
                            Delete
                          </button>
                          <button
                            className="px-1 py-1 ml-2 pr-2 font-bold text-white bg-minionBlue flex items-center rounded-md hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue duration-200"
                            onClick={() => setEditorState(true)}
                          >
                            <PencilSquareIcon className="w-5 h-5 mr-1" />
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
                {user?._id !== selectedArticle?.user?._id &&
                  user?.role !== "admin" && (
                    <>
                      <div className="px-2 rounded-full flex basis-1/8 items-center justify-end cursor-pointer">
                        <button
                          className="px-1 py-1 pr-2 mr-2 font-bold text-white bg-minionBlue flex items-center rounded-md hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue duration-200"
                          onClick={() => setReviewModal(true)}
                        >
                          <ChatBubbleBottomCenterIcon className="w-5 h-5 mr-1" />
                          Review
                        </button>
                      </div>
                    </>
                  )}
                <Modal
                  width={800}
                  open={reviewModal}
                  onCancel={() => setReviewModal(false)}
                  footer={null}
                >
                  <Form form={form}>
                    <label
                      htmlFor="newArticle"
                      className="block text-xl text-gray-700"
                    >
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
                        action={
                          process.env.REACT_APP_API_BASE_URL +
                          "/api/file/upload"
                        }
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
                            onVisibleChange: (visible) =>
                              setPreviewOpen(visible),
                            afterOpenChange: (visible) =>
                              !visible && setPreviewImage(""),
                          }}
                          src={previewImage}
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="submit"
                        onClick={() => setReviewModal(false)}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        destroyOnClose
        width={300}
        footer={null}
      >
        <div className="h-[100px] flex flex-col justify-between">
          <div className=" flex w-full justify-start font-semibold text-lg">
            Are U Sure?
          </div>
          <div className="flex justify-between float-right w-full pr-[10px] pl-[100px]">
            <button
              className="flex items-center justify-center right-4 float-right gap-2 px-2 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
              hover:border-minionBlue rounded-md my-2 text-white bg-minionBlue duration-300 w-[60px]"
              onClick={onDelete}
            >
              OK
            </button>
            <button
              className="flex items-center justify-center right-4 float-right gap-2 px-2 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md my-2 text-white bg-minionBlue duration-300"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default memo(Action);
