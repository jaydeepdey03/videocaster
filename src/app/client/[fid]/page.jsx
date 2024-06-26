"use client";

import {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Switch} from "@/components/ui/switch";
import {useExperimentalFarcasterSigner} from "@privy-io/react-auth";
import axios from "axios";
import Frame from "@/components/ui/Frame";
import {useRouter} from "next/navigation";

export default function YourCasts({params}) {
  const [casts, setCasts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const {submitCast} = useExperimentalFarcasterSigner();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/casts", {
          params: {
            fid: params.fid,
          },
        });
        console.log(response, "data");
        console.log(response.data.message.data.casts, "mycasts");
        setCasts(response.data.message.data.casts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const convertDate = (utcTimestamp) => {
    let date = new Date(utcTimestamp);
    let localDate = date.toLocaleString();
    return localDate;
  };

  const addCastToFarcaster = async (values) => {
    try {
      const castBody = {
        text: values.castText,
        embeds: [
          {
            url: values.embedUrl,
          },
        ],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
        // parentUrl: parentUrl,
      };
      const {hash} = await submitCast(castBody);
      console.log(hash, "hash");
    } catch (err) {
      console.log(err);
    }
  };

  const [toggleMedia, setToggleMedia] = useState(false); // true - video, false - image

  const [myFarcasterAcc, setMyFarcasterAcc] = useState({});

  useEffect(() => {
    (async function () {
      try {
        const response = await axios.post("/api/getMyFarcaster", {
          fid: params.fid,
        });
        setMyFarcasterAcc(response.data.data);
        console.log(response.data, "my farcaster");
      } catch (error) {
        console.log(error.message, "error :cry:");
      }
    })();
  }, []);

  return (
    <>
      {/* <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-0 top-[28vh]">
          <DialogHeader className={""}>
            <DialogTitle className="px-4 py-4"></DialogTitle>
            <DialogDescription className="px-5 pt-1 w-full h-full">
              <div className="h-full w-full flex gap-2">
                <Avatar>
                  <AvatarImage src=".png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <Textarea
                  className="border-none outline-none focus-visible:ring-0 focus:placeholder-slate-700 text-md placeholder-slate-300 resize-none"
                  placeholder="Start typing your text here"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={"py-2 pr-2 border-t"}>
            <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
              Casts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      {/* <Card className="h-[20vh] mb-1 z-10 rounded-lg sticky top-[10vh]">
          <CardHeader className="p-0">
            <CardTitle className="text-md border-b px-3 py-3">
              Post Something
            </CardTitle>
          </CardHeader>
          <CardContent
            className="pt-3 grid grid-cols-2 items-center gap-4"
            style={{
              gridTemplateColumns: "auto 1fr auto",
            }}
          >
            <Avatar className="">
              <AvatarImage src=".png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="col-span-2 w-full">
              <Input
                placeholder="What's on your mind?"
                className="rounded-full w-full"
              />
            </div>
            
          </CardContent>
          
        </Card> */}
      {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className="rounded-full h-12 w-12 fixed bottom-5 right-5"
                onClick={() => setModalOpen(true)}
              >
                <Pencil className="h-7 w-7" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="mr-10">
              <p>Create Cast</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      {/*  */}
      <div className="flex flex-col gap-5 w-auto lg:col-span-3 pt-0 relative mx-4">
        <div className="h-full flex flex-col space-y-5 w-full mt-4 relative mb-7">
          <div className="w-full border rounded-lg h-[200px] bg-white grid grid-cols-4 gap-3">
            <div className="col-span-1 h-full w-full flex justify-center items-center">
              <Avatar className="h-20 w-20   rounded-full">
                <AvatarImage src={myFarcasterAcc.pfp_url} className="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="col-span-3 h-full w-full flex flex-col justify-center">
              <p className="font-bold text-lg">
                {myFarcasterAcc.display_name}{" "}
              </p>
              <p className="font-normal text-sm">@{myFarcasterAcc.username}</p>
              <p className="text-lg">{myFarcasterAcc.bio}</p>
              <div className="flex gap-3 items-center mt-3">
                <p>
                  <span className="font-semibold">Followers: </span>
                  {myFarcasterAcc.follower_count}
                </p>
                <p>
                  <span className="font-semibold">Following: </span>
                  {myFarcasterAcc.following_count}
                </p>
              </div>
            </div>
          </div>
          {casts &&
            casts.map((item, idx) => (
              <Card
                key={idx}
                className="cursor-pointer"
                onClick={() => router.push(`/client/cast/${item.hash}`)}
              >
                <CardHeader className="p-0">
                  <CardTitle className="text-md px-5 py-5 flex gap-3 items-center">
                    <Avatar className="">
                      <AvatarImage src={item.author.pfp_url} className="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <p className="font-bold">
                        {item.author.display_name}{" "}
                        <span className="font-normal text-sm">
                          @{item.author.username}
                        </span>
                      </p>

                      <p className="text-xs font-normal">
                        {convertDate(item.timestamp)}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 h-fit">
                  <p className="mb-5 ml-2">{item.content}</p>
                  {/* <div className="w-full border-2 h-[100px] rounded-md"> */}
                  {item.embeds.length > 0 && item.embeds[0].url && (
                    <Frame
                      frameUrl={item.embeds[0].url}
                      toggleMedia={toggleMedia}
                    />
                  )}

                  {/* {item.embeds.length > 0 &&
                    item.embeds[0].url &&
                    item.embeds[0].url.match(/\.(jpeg|jpg|gif|png)$/) !==
                      null &&
                    toggleMedia === false && (
                      <img
                        src={item.embeds[0].url}
                        alt="img"
                        className="w-1/2 m-auto"
                      />
                    )}

                  {item.embeds.length > 0 &&
                    item.embeds[0].url &&
                    item.embeds[0].url.match(/\.(jpeg|jpg|gif|png)$/) ===
                      null && <Frame frameUrl={item.embeds[0].url} />} */}
                  {/* </div> */}
                </CardContent>
              </Card>
            ))}
          {!casts && (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-lg">No Casts Found</p>
            </div>
          )}
        </div>
      </div>
      {/* <div className="hidden w-auto col-span-1 lg:flex lg:justify-center h-[70vh] sticky top-[10vh]">
        <div className="border bg-white w-full rounded-lg">
          <div className="border-b p-4">
            <h1 className="font-semibold">Recent Video Frames</h1>
          </div>
        </div>
      </div> */}
    </>
  );
}
