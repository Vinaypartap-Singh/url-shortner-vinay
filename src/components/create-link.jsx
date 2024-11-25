import { UrlState } from "@/context";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Error } from "./error";
import { Card } from "./ui/card";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

export default function CreateLink() {
  const websiteURL = import.meta.env.VITE_WEBSITE_URL;
  const { user } = UrlState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longUrl = searchParams.get("createNew");
  const ref = useRef();

  const [errors, setErrors] = useState({});

  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longUrl ? longUrl : "",
    customUrl: "",
  });

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    longUrl: Yup.string()
      .url("Must be a valid url")
      .required("Long Url Is requuired"),
    customUrl: Yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  const createNewLink = async () => {
    setErrors([]);

    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate QR code blob"));
        });
      });
      console.log(blob);
      await fnCreateUrl(blob);
    } catch (error) {
      const newErrors = [];

      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);

  return (
    <div>
      <Dialog
        defaultOpen={longUrl}
        onOpenChange={(result) => {
          if (!result) setSearchParams({});
        }}
      >
        <DialogTrigger>
          <Button variant={"destructive"}>Create Link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New</DialogTitle>
          </DialogHeader>

          {formValues?.longUrl && (
            <QRCode
              value={formValues?.longUrl}
              className={"w-full"}
              ref={ref}
            />
          )}

          <Input
            id="title"
            placeholder="Short Link's Title"
            value={formValues.title}
            onChange={handleChange}
          />
          {errors.title && <Error message={errors.title} />}

          <Input
            id="longUrl"
            placeholder="Your Long Url"
            value={formValues.longUrl}
            onChange={handleChange}
          />
          {errors.longUrl && <Error message={errors.longUrl} />}

          <div className="flex items-center gap-2">
            <Card className="p-2">{websiteURL}</Card> /
            <Input
              id="customUrl"
              placeholder="Custom Link (optional)"
              value={formValues.customUrl}
              onChange={handleChange}
            />
          </div>
          {error && <Error message={error.message} />}

          <DialogFooter>
            <Button
              disabled={loading}
              variant={"destructive"}
              className={"w-full"}
              onClick={createNewLink}
            >
              {loading ? <BeatLoader size={5} color="white" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
