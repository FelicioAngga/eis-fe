import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

function NewsItem({
  id,
  title,
  content,
  thumbnail,
}: {
  id?: number;
  title: string;
  content: string;
  thumbnail: string;
}) {
  const navigate = useNavigate();
  const parsedContent = parse(content);

  return (
    <div className="mt-6 flex flex-col gap-2 w-full md:w-1/3 xl:w-1/4">
      <div className="cursor-pointer" onClick={() => navigate(`/news/${id}`)}>
        <img
          src={thumbnail}
          alt=""
          className="rounded-lg w-56 max-h-42 object-cover"
          loading="lazy"
        />
        <p className="text-lg md:text-xl font-bold">{title}</p>
        <div className="text-xs text-[#878787] w-56 text-justify">
          {parsedContent}
        </div>
      </div>
    </div>
  );
}

export default NewsItem;
