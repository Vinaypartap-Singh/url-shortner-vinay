import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { logOut } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

export default function Header() {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();

  const { loading, fn: fnLogOut } = useFetch(logOut);

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link to={"/"}>
          <h5 className="font-bold">Url Shortner</h5>
        </Link>

        <div>
          {!user ? (
            <Button onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={`${user?.user_metadata?.profile_pic}`}
                    className="object-contain"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={"/dashboard"} className="flex gap-2 items-center">
                    <LinkIcon className="size-4" /> <span>My Links</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400">
                  <LogOut className="size-4" />
                  <span
                    onClick={() => {
                      fnLogOut().then(() => {
                        fetchUser();
                        navigate("/");
                      });
                    }}
                  >
                    Log Out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
    </>
  );
}
