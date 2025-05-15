import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
export default function Home() {
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
        </main>
      </div>
    </>
  );
}
