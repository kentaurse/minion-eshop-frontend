import axios from "axios";
import { memo, useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ViewArticleItem from "./ViewArticleItem";
import { useDispatch, useSelector } from "react-redux";
import {
  ListBulletIcon,
  BookOpenIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { fetchArticleCategories } from "../../../redux/articleCatSlice";
import { Empty } from "antd";

function SelectedArticle() {
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [flag, setFlag] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const params = useParams();
  const navigate = useNavigate();

  const getArticles = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/article/get/${params?.id}`
    );
    setSelectedArticles(res?.data?.articles);
  };
  const getAllArticles = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/article`
    );
    setArticles(res?.data?.articles);
  };

  const addlike = (id) => {
    setFlag(true);
    axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/article/addLike/${id}`
    );
  };

  const addUnlike = (id) => {
    setFlag(true);
    axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/article/unlike/${id}`
    );
  };
  const articleIds = [];
  articles?.filter(item => item._id === item.ancestorId).map((article) => {
    articleIds.push(article?._id);
  });

  const index = articleIds.findIndex((id) => id === params?.id);

  const onNext = () => {
    setSelectedArticles([]);
    setFlag(true);
    if (index < articles?.length - 1) {
      navigate(`/app/article/${articleIds[index + 1]}`);
    }
    if (index === articles?.length - 1) {
      navigate(`/app/article/${articleIds[0]}`);
    }
  };

  const onPrev = () => {
    setFlag(true);
    setSelectedArticles([]);
    if (index > 0) {
      navigate(`/app/article/${articleIds[index - 1]}`);
    }
    if (index === 0) {
      navigate(`/app/article/${articleIds[articles?.length - 1]}`);
    }
  };

  const makeTree = (article, articles) => {
    let childrens = [];
    articles.forEach((item, index) => {
      if (item.parentId === article._id) {
        childrens.push(makeTree(item, articles));
      }
    });
    return (
      <ViewArticleItem
        selectedArticle={article}
        childrens={childrens}
        key={index}
        addlike={addlike}
        addUnlike={addUnlike}
        user={user}
        getArticles={getArticles}
      />
    );
  };
  useEffect(() => {
    setFlag(false);
    getArticles();
    getAllArticles();
  }, [flag]);

  useEffect(() => {
    dispatch(fetchArticleCategories());
  }, []);

  return (
    <>
      <div className="w-full">
        <div className="w-full h-[70px] flex justify-end">
          <button
            className=" flex items-center justify-center px-1 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
            hover:border-minionBlue rounded-md my-2 text-white bg-minionBlue duration-300 h-[30px] mr-1"
            onClick={onPrev}
          >
            <ChevronDoubleLeftIcon className="w-4 h-4 mr-1" />
            Prev
          </button>
          <button
            className=" flex items-center justify-center px-1 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md my-2 text-white bg-minionBlue duration-300 h-[30px] mr-8"
            onClick={onNext}
          >
            Next
            <ChevronDoubleRightIcon className="w-4 h-4 ml-1" />
          </button>
          <Link
            to="/app/article"
            className=" flex items-center justify-center px-1 py-1 hover:text-minionBlue hover:bg-white border-[1px] 
                        hover:border-minionBlue rounded-md my-2 text-white bg-minionBlue duration-300 h-[30px] mr-4"
          >
            <ListBulletIcon className="w-4 h-4 mr-1" />
            Lists
          </Link>
        </div>
        {selectedArticles?.length > 0 ? (
          makeTree(
            selectedArticles?.find((item) => item?._id === item?.ancestorId),
            selectedArticles
          )
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </>
  );
}

export default memo(SelectedArticle);
