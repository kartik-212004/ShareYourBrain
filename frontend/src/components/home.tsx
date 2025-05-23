import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Share2Icon, Trash2, Copy } from "lucide-react";
import { Toaster } from "sonner";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const apiFrontend = import.meta.env.VITE_API_URL_FRONTEND;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface TokenPayload {
  id: string;
}
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

export default function Home() {
  const navigate = useNavigate();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const [content, setContent] = useState<Content[] | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [increment, setIncrement] = useState(0);
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
  }, [isAuthenticated, increment, token]);

  async function getContent(userId: string) {
    try {
      const tokens = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/api/v1/content/${userId}`, {
        headers: { Authorization: `Bearer ${tokens}` },
      });
      setContent(response.data.data);
      if (response.data.status === 200) {
        if (response.data.data.length === 0) {
          toast.error("Nothing to show", {
            description: "Add some content to your second brain",
          });
        } else {
          toast.success("Content fetched successfully");
        }
      } else {
        toast.error("Error fetching content");
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      toast.error("Error fetching content");
    }
  }

  async function deleteContent(id: string) {
    try {
      const tokens = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/v1/content/${id}`, {
        headers: { Authorization: `Bearer ${tokens}` },
      });
      toast.success("Content deleted successfully");
      setIncrement((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Error deleting content");
    }
  }

  async function postContent() {
    try {
      const tokens = localStorage.getItem("token");
      const { data } = await axios.post(
        `${apiUrl}/api/v1/content`,
        { title: title, link: link, tags: tags },
        {
          headers: { Authorization: `Bearer ${tokens}` },
        }
      );
      setOpen((e) => !e);

      setIncrement((prev) => prev + 1);
      await handleShare(data.data._id, data.data.userId);
      toast.success("Content added successfully");
    } catch (err) {
      console.error("Error adding content:", err);
      toast.error("Error adding content");
    }
  }

  async function handleShare(id: string, userId: string) {
    try {
      const tokens = localStorage.getItem("token");

      const response = await axios.post(
        `${apiUrl}/api/v1/content/share/`,
        {
          id: id,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${tokens}` },
        }
      );
      if (
        response.data &&
        response.data.response &&
        response.data.response.hash
      ) {
        setShareLink(response.data.response.hash);
      } else {
        console.error("Invalid response format:", response.data);
        toast.error("Could not generate share link");
      }
    } catch (error) {
      console.error("Error sharing content:", error);
      toast.error("Error generating share link");
    }
  }

  async function handleCopy(shareLink: string | null) {
    if (!shareLink) {
      toast.error("No share link available");
      return;
    }
    await navigator.clipboard.writeText(`${apiFrontend}/shared/${shareLink}`);
    toast.success("Link copied to clipboard");
  }
  return (
    <>
      <div className="flex">
        <Sidebar />
        <main className="px-10 py-5 bg-gray-50 flex-1">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-t1 font-semibold">All Notes</h1>
            <div className="flex flex-row space-x-4 font-semibold">
              <Button
                onClick={() => {
                  setOpen((e) => !e);
                }}
                className="bg-button hover:bg-[#352f91]"
              >
                Add Content
              </Button>
            </div>
          </div>
          <div className="mt-10">
            {content && content.length === 0 ? (
              <p className="text-2xl font-medium">No Brains yet</p>
            ) : (
              <div className="grid gap-y-3 grid-cols-3 ">
                {content &&
                  content.map((cont) => (
                    <div
                      key={cont._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden  max-w-md"
                    >
                      <h1 className="text-xl font-bold p-4  max-h-28 text-gray-800">
                        {cont.title}
                      </h1>
                      <div className="w-full">
                        <iframe
                          src={cont.link}
                          className="w-full p-2 h-56"
                        ></iframe>
                      </div>
                      <div className="p-4 flex justify-between">
                        <div className="flex flex-row space-x-2">
                          {cont.tags.map((e, i) => (
                            <span
                              key={i}
                              className="text-sm px-2 py-1 rounded-md bg-button2 text-white"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                        <div className="space-x-4 flex flex-row">
                          <Trash2
                            onClick={() => {
                              deleteContent(cont._id);
                            }}
                            className="size-5 blue-color cursor-pointer"
                          />
                          <Share2Icon
                            onClick={() => {
                              handleShare(cont._id, cont.userId._id);
                              setShareOpen((e) => !e);
                            }}
                            className="size-5 cursor-pointer blue-color"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Content</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right text-md">
                    Title
                  </Label>
                  <Input
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    id="title"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4 ">
                  <Label htmlFor="link" className="text-right text-md">
                    Link
                  </Label>
                  <Input
                    onChange={(e) => {
                      setLink(e.target.value);
                    }}
                    id="link"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right text-md">
                    Tags
                  </Label>
                  <Input
                    onChange={(e) => {
                      if (e.target.value.length > 0) {
                        setTags(e.target.value.split(" "));
                      }
                    }}
                    id="tags"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={postContent} type="submit">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={shareOpen} onOpenChange={setShareOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share link</DialogTitle>
                <DialogDescription>
                  Anyone who has this link will be able to view this.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input
                    id="link"
                    className="selection:bg-[#5048db]"
                    value={
                      shareLink
                        ? `${apiFrontend}/shared/${shareLink}`
                        : "Loading share link..."
                    }
                    readOnly
                  />
                </div>
                <Button
                  onClick={() => {
                    handleCopy(shareLink);
                  }}
                  type="submit"
                  size="sm"
                  className="px-3"
                >
                  <span className="sr-only">Copy</span>
                  <Copy />
                </Button>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
        <Toaster position="top-center" />
      </div>
    </>
  );
}
