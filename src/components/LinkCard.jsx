import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Copy, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const websiteURL = import.meta.env.VITE_WEBSITE_URL;

export default function LinkCard({ url, fetchUrls }) {
  const downloadImageUrl = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchorTag = document.createElement("a");
    anchorTag.href = imageUrl;
    anchorTag.download = fileName;

    document.body.appendChild(anchorTag);

    anchorTag.click();

    document.body.removeChild(anchorTag);
  };

  const { loading: deleteLoading, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  return (
    <div className="flex flex-col justify-between md:flex-row gap-5 border p-4 bg-black rounded-md">
      <img
        src={url?.qr}
        alt="Qr Code"
        className="h-32 object-contain self-start"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-2">
        <span className="text-md font-bold hover:underline cursor-pointer">
          {url?.title}
        </span>{" "}
        <span className="text-lg text-red-400 font-bold underline cursor-pointer">{`${websiteURL}/${
          url?.custom_url ? url?.custom_url : url?.short_url
        }`}</span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          {url?.original_url}
        </span>
        <span>{new Date(url?.created_at).toLocaleDateString()}</span>
      </Link>

      <div className="flex gap-2">
        <Button
          variant={"icon"}
          onClick={() =>
            navigator.clipboard.writeText(
              `${websiteURL}/${
                url?.custom_url ? url?.custom_url : url?.short_url
              }`
            )
          }
        >
          <Copy className="size-4" />
        </Button>

        <Button variant={"icon"} onClick={downloadImageUrl}>
          <Download className="size-4" />
        </Button>

        <Button
          variant={"icon"}
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {deleteLoading ? (
            <BeatLoader size={5} color="white" />
          ) : (
            <Trash className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
