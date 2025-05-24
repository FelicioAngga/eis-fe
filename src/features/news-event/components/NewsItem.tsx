import { useNavigate } from "react-router-dom";

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
        <p className="text-xs text-[#878787] w-56 text-justify">
          {content.length > 140 ? content.slice(0, 140) + "..." : content}
        </p>
      </div>
    </div>
  );
}

export default NewsItem;
