import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();
  console.log(longUrl);

  const handleShorten = (e) => {
    e.preventDefault();

    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-bold">
        The Only URL Shortner <br /> you'll ever need!
      </h2>

      <form
        onSubmit={handleShorten}
        className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2"
      >
        <Input
          type="url"
          placeholder="Enter Your URL"
          onChange={(e) => setLongUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4"
        />
        <Button className="h-full" type="submit">
          Short Url
        </Button>
      </form>
    </div>
  );
}
