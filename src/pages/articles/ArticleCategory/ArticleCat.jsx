import { useSelector, useDispatch } from "react-redux";
import { ConfigProvider, Tree } from "antd";
import { useState, useEffect } from "react";
import { fetchArticleCategories } from "../../../redux/articleCatSlice";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";

function ArticleCategory() {
  const { articleCategories, articleCategoriesForPath, isUpdated } =
    useSelector((state) => state.articleCat);
  const [articleList, setArticleList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [view, setView] = useState(null);

  const { search } = useLocation();

  // useEffect(() => {
  //   if (isUpdated) dispatch(fetchArticleCategories(view));
  // }, []);

  useEffect(() => {
    if (isUpdated) dispatch(fetchArticleCategories(view));
  }, [isUpdated]);

  const parseSearchQuery = (q) => {
    if (q.length) {
      const a = q.slice(1);
      const qs = a.split("&");
      return qs.reduce((t, e) => {
        const b = e.split("=");
        return { ...t, [b[0]]: b[1] };
      }, {});
    } else return "";
  };

  const parseQuerySearch = (q) => {
    let s = "?";
    let k = false;
    for (let i in q) {
      if (k) s += "&";
      else k = true;
      s += i + "=";
      s += q[i];
    }
    return s;
  };

  const query = parseSearchQuery(search);

  const [params] = useSearchParams();
  let cat = params.get("Cat");

  const cutArticleCategory = (data) => {
    //following select category, get it and it's child categories
    let mainAndchild = [data];
    const cutTree = (main) => {
      articleCategoriesForPath.map((item) => {
        if (item?.parentId === main) {
          mainAndchild.push(item?._id);
          cutTree(item?._id);
        }
      });
    };

    cutTree(data);
    return mainAndchild;
  };

  const getArticles = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/article`
    );
    setArticleList(
      res?.data?.articles.filter(
        (article) => article._id === article.ancestorId
      )
    );
  };

  useEffect(() => {
    getArticles();
  }, []);

  return (
    <>
      <div className="z-10">
        <div className="p-4 h-full w-full">
          <div className="h-full w-full  px-2">
            {articleCategories.length ? (
              <ConfigProvider
                theme={{
                  components: {
                    Tree: {
                      fontSize: "16px",
                      paddingXXS: 4,
                      fontFamily: "inherit",
                      borderRadius: 99,
                      nodeSelectedBg: "hsl(var(--bc) / 0.2)",
                      nodeHoverBg: "hsl(var(--bc) / 0.2)",
                      titleHeight: 28,
                    },
                  },
                }}
              >
                <Tree
                  className="w-full pt-4 px-2 overflow-scroll overflow-y-hidden"
                  defaultExpandAll
                  defaultExpandParent
                  // selectedKeys={[query?.Cat]}
                  selectedKeys={cat}
                  showLine={true}
                  titleRender={(e) => (
                    <div className="rounded-full px-2 flex gap-x-2 items-center">
                      <div>{e?.title}</div>
                      <div className="text-base flex items-center gap-x-1">
                        <span className="text-blue-400">
                          (
                          {articleList &&
                            articleList.filter((item) =>
                              cutArticleCategory(e._id).includes(
                                item?.categoryId
                              )
                            ).length}
                          )
                        </span>
                        {articleList &&
                          articleList
                            .filter((item) =>
                              cutArticleCategory(e._id).includes(
                                item?.categoryId
                              )
                            )
                            .filter(
                              (item) =>
                                !item?.view.includes(user._id) &&
                                item?.user._id !== user._id
                            ).length > 0 && (
                            <div className="rounded-xl bg-red-500 text-white px-1 text-sm">
                              +
                              {articleList &&
                                articleList
                                  .filter((item) =>
                                    cutArticleCategory(e._id).includes(
                                      item?.categoryId
                                    )
                                  )
                                  .filter(
                                    (item) =>
                                      !item?.view.includes(user._id) &&
                                      item?.user._id !== user._id
                                  ).length}
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                  fieldNames={{ key: "_id" }}
                  onSelect={(e, v) => {
                    navigate(
                      parseQuerySearch({
                        Cat: v.node._id,
                        PS: query?.PS || 10,
                      })
                    );
                  }}
                  // blockNode
                  treeData={articleCategories}
                />
              </ConfigProvider>
            ) : (
              <div className="h-full w-full flex justify-center items-center">
                No Category.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ArticleCategory;
