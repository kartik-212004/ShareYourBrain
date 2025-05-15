import { Link2, Twitter, FileVideo, File, Tags, Brain } from "lucide-react";

function Sidebar() {
  const menuItems = [
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
    { icon: <FileVideo className="w-5 h-5" />, label: "Videos" },
    { icon: <File className="w-5 h-5" />, label: "Documents" },
    { icon: <Tags className="w-5 h-5" />, label: "Tags" },
    { icon: <Link2 className="w-5 h-5" />, label: "Links" },
  ];

  return (
    <nav className="w-64 h-screen border-r border-gray-200 flex flex-col bg-white shadow-sm">
      <div className="p-5">
        <h1 className="text-2xl font-bold flex flex-row space-x-3 items-center text-gray-800 text-center">
          <Brain className="mr-3" />
          Second Brain
        </h1>
      </div>

      <ul className="flex-1 py-6 px-4 space-y-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150 group">
              <span className="mr-3 text-gray-600 group-hover:text-blue-600">
                {item.icon}
              </span>
              <span className="font-medium hover">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
