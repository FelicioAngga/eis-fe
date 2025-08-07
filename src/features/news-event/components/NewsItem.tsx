import { useNavigate } from "react-router-dom";
import parse, { domToReact } from "html-react-parser";
import { formatDateTime } from "../../../utils/formatDate";

function NewsItem({
  id,
  title,
  content,
  thumbnail,
  created_at
}: {
  id?: number;
  title: string;
  content: string;
  thumbnail: string;
  created_at?: string;
}) {
  const navigate = useNavigate();

  const options = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag') {
        const newProps = {
          ...domNode.attribs,
          className: 'inline',
        };
        return <span {...newProps}>{domToReact(domNode.children, options)}</span>;
      }
    },
  };

  return (
    <div className="flex flex-col w-full gap-2 mt-6 md:w-1/3 xl:w-1/4">
      <div className="cursor-pointer" onClick={() => navigate(`/news-event/${id}`)}>
        <img
          src={thumbnail}
          alt=""
          className="object-cover w-56 rounded-lg h-42"
          loading="lazy"
        />
        <p className="text-lg font-bold md:text-xl">{title}</p>
        <div className="text-xs text-[#878787] w-56 truncate">
          {parse(content, options)}
        </div>
        <div className="text-xs">Diposting, {formatDateTime(created_at || "")}</div>
      </div>
    </div>
  );
}

export default NewsItem;
