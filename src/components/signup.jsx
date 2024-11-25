import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import { Error } from "./error";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/use-fetch";
import { signUp } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const [errors, setErrors] = useState({}); // Changed to an object
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signUp, formData);
  const { fetchUser } = UrlState();

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, loading]);

  const handleSignup = async () => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is Required"),
        email: Yup.string()
          .email("Invalid Email Address")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile_pic: Yup.mixed().required("Profile Pic is Required"),
      });

      await schema.validate(formData, { abortEarly: false });

      setErrors({}); // Clear previous errors if validation succeeds

      // API Call logic here

      await fnSignup();
    } catch (error) {
      const newErrors = {};
      error?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>Create a New Account</CardDescription>
          {error && <Error message={error.message} />}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-2">
              <Input
                name="name"
                type="text"
                placeholder="Enter Your Name"
                onChange={handleInputChange}
              />
              {errors.name && <Error message={errors.name} />}
            </div>
            <Input
              name="email"
              type="email"
              placeholder="Enter Email"
              onChange={handleInputChange}
            />
            {errors.email && <Error message={errors.email} />}
          </div>
          <div className="space-y-2">
            <Input
              name="password"
              type="password"
              placeholder="Enter Password"
              onChange={handleInputChange}
            />
            {errors.password && <Error message={errors.password} />}
          </div>

          <div className="space-y-2">
            <Input
              name="profile_pic"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
            />
            {errors.profile_pic && <Error message={errors.profile_pic} />}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup}>
            {loading ? (
              <BeatLoader size={10} color="black" />
            ) : (
              "Create New Account"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
