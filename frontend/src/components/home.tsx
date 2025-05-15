import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface TokenPayload {
  id: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const decodedToken = jwtDecode<TokenPayload>(token);

            const userId = decodedToken.id;
            if (userId) {
              await getContent(userId);
            } else {
              console.error("No user ID found in token");
            }
          }
        } catch (err) {
          console.error("Error decoding token:", err);
        }
      }
    };

    fetchContent();
  }, [isAuthenticated, token]);

  async function getContent(userId: string) {
    try {
      const tokens = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/v1/content/${userId}`, {
        headers: { Authorization: `Bearer ${tokens}` },
      });
      setContent(response.data);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Error loading content");
    }
  }
  console.log(content);
  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="px-10 py-5 flex-1">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-t1 font-semibold">All Notes</h1>
            <div className="flex flex-row space-x-4 font-semibold">
              <Button className="bg-[#928fd6] font-medium hover:text-white hover:bg-[#9c97f1]">
                Share Brain
              </Button>
              <Button className="bg-[#5048DB] hover:bg-[#352f91]">
                Add Content
              </Button>
            </div>
          </div>
          <div className="mt-10">
            {error ? <p className="text-red-500">{error}</p> : <div>hello</div>}
          </div>
        </main>
      </div>
    </>
  );
}
