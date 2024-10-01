import { Button, Input, Tree, Modal } from "antd";
import { useState, useRef, useEffect } from "react";
import {
  createFirstCat,
  actionArticleCategory,
  fetchArticleCategories,
  deleteArticleCategory,
} from "../../../redux/articleCatSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";

const AdminArticleCategory = () => {
  const dispatch = useDispatch();

  const [firstCat, setFirstCat] = useState("");
  const [selectKeys, setSelectKeys] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [group, setGroup] = useState({ title: "" });
  const groupRef = useRef();

  const { articleCategories } = useSelector((state) => state.articleCat);
  useEffect(() => {
    dispatch(fetchArticleCategories());
  }, []);

  const onDelete = (item) => {
    setDeleteModal(true);
    setGroup({ deleteId: item._id });
  };
  const onAdd = (item) => {
    setGroup({ title: "", parentId: item._id });
    setVisible(true);
  };
  const onEdit = (item) => {
    setVisible(true);
    setGroup({ title: item.title, updateId: item._id });
  };

  const onGroupSubmit = async (item) => {
    if (!group.title.length) {
      groupRef.current.focus();
      return;
    }
    await dispatch(actionArticleCategory(group));
    // if (group.updateId) setVisible(false);
    // else setGroup({ ...group, title: "" });
    groupRef.current.focus();
    dispatch(fetchArticleCategories());
    setVisible(false);
  };

  const Delete = async () => {
    setDeleteModal(false);
    await dispatch(deleteArticleCategory({ id: group.deleteId }));
    dispatch(fetchArticleCategories());
    setGroup({});
  };

  const TreeItem = (item) => {
    return (
      <>
        <div className="mb-2" key={item._id}>
          <span className={item.del ? "line-through" : ""}>{item.title}</span>
          <div className="float-right flex gap-x-2 ">
            {!item.del && (
              <button
                className="btn px-1 btn-sm normal-case rounded-full"
                onClick={() => onAdd(item)}
              >
                <FaPlus className="w-5 h-5" />
              </button>
            )}
            {!item.del && (
              <button
                className="btn px-1 btn-sm normal-case rounded-full"
                onClick={() => onEdit(item)}
              >
                <FaEdit className="w-5 h-5" />
              </button>
            )}
            {!item.del && item.parentId && (
              <button
                className="btn px-1 btn-sm normal-case rounded-full"
                onClick={() => onDelete(item)}
              >
                <FaTrashAlt className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Modal
        title={`${group.updateId ? "Edit" : "Add"} Category`}
        width={200}
        open={visible}
        closable={false}
        footer={
          <div className="">
            <button
              className="btn btn-primary btn-sm normal-case mr-2 px-7"
              onClick={onGroupSubmit}
            >
              OK
            </button>
            <button
              className="btn btn-sm normal-case"
              onClick={() => setVisible(false)}
            >
              Cancel
            </button>
          </div>
        }
      >
        <input
          ref={groupRef}
          type="text"
          value={group.title}
          onChange={(e) => setGroup({ ...group, title: e.target.value })}
          className="border-2"
        ></input>
      </Modal>
      <Modal
        width={200}
        open={deleteModal}
        closable={false}
        footer={
          <div className="">
            <button
              className="btn btn-primary btn-sm normal-case mr-2 px-7"
              onClick={Delete}
            >
              OK
            </button>
            <button
              className="btn btn-sm normal-case"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="text-xl mb-3">Delete?</div>
      </Modal>

      <div className="h-full w-full flex flex-col p-4">
        {articleCategories.length === 0 && (
          <div className="flex flex-col items-center p-8 gap-y-3">
            <Input
              placeholder="First Category"
              onChange={(e) => setFirstCat(e.target.value)}
              className="w-[70%]"
            ></Input>

            <Button
              className="px-3 w-[70%]"
              onClick={() => dispatch(createFirstCat(firstCat))}
            >
              Add First Category
            </Button>
          </div>
        )}

        <Tree
          className="w-full text-lg"
          showLine
          defaultExpandAll
          defaultExpandParent
          onSelect={(e) => setSelectKeys(e.length ? e : selectKeys)}
          selectedKeys={selectKeys}
          fieldNames={{ key: "_id" }}
          blockNode
          titleRender={TreeItem}
          treeData={articleCategories}
        />
      </div>
    </>
  );
};

export default AdminArticleCategory;
