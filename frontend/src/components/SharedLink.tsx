import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Content {
  _id: string;
  title: string;
  tags: string[];
  link: string;
  userId: {
    _id: string;
    email: string;
  };
}
const apiUrl = import.meta.env.VITE_API_URL;

function SharedLink() {
  const { code } = useParams();
  const [content, setContent] = useState<Content[] | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/content/share/${code}`
        );
        setContent(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContent();
  }, [code]);

  return (
    <div className="flex justify-center items-center">
      {content &&
        content.map((cont) => (
          <div
            key={cont._id}
            className="bg-white rounded-lg shadow-md overflow-hidden  w-2xl"
          >
            <h1 className="text-xl font-bold p-4   text-gray-800">
              {cont.title}
            </h1>
            <div className="w-full">
              <iframe src={cont.link} className="w-full p-2 h-96"></iframe>
            </div>
            <div className="p-4 flex justify-between">
              <div className="flex flex-row space-x-2">
                {cont.tags.map((e, i: number) => (
                  <span
                    key={i}
                    className="text-sm px-2 py-1 rounded-md bg-button2 text-white"
                  >
                    {e}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Post By {cont.userId.email}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default SharedLink;
