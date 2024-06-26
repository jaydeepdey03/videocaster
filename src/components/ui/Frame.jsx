"use client";
import React, {useEffect, useState} from "react";
import {scrapeMetaData} from "@/utils/scrape";
import axios from "axios";
import {Button} from "./button";
import {SquareArrowOutUpRight} from "lucide-react";
import {Switch} from "./switch";

function Frame({frameUrl, refresh}) {
  const [responseFrames, setResponseFrames] = useState(null);
  const [mainURL, setMainURL] = useState("");

  console.log("framee ", frameUrl);

  const postFrame = async (post_url) => {
    console.log("post frame", post_url);

    try {
      const res = await axios.post("/api/postFrame", {
        framesUrl: post_url,
      });
      console.log(res.data, "res");
      setResponseFrames(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postRedirectFrame = async (post_url) => {
    linkFrame(frameUrl);
    console.log("post redirect frame");
    try {
      const res = await axios.post("/api/postRedirect", {
        framesUrl: post_url,
      });
      console.log(res.data, "res post redirect url");

      window.open(res.data.redirectUrl, "_blank");
      // using something redirect to the url
    } catch (error) {
      console.log(error);
    }
  };

  const linkFrame = (link_url) => {
    try {
      if (link_url) {
        // warning before leaving the page
        window.open(link_url, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async function () {
      const res = await axios.post("/api/scrape", {
        framesUrl: frameUrl,
      });
      console.log(res.data, "data.video");
      setResponseFrames(res.data);

      // console.log(data, "res");
    })();

    const urlString = frameUrl;
    const url = new URL(urlString);
    const mainUrl = `${url.protocol}//${url.host}`;

    setMainURL(mainUrl);
  }, [frameUrl, refresh]);

  // console.log(frameUrl, "res");

  const [toggleMedia, setToggleMedia] = useState(false); // true - video, false - image
  console.log(responseFrames, "responseFrames1");
  return (
    <div
      className={`h-fit w-full flex flex-col gap-5 ${
        responseFrames &&
        !toggleMedia &&
        responseFrames.fallbackImage &&
        "border-2 border-slate-100 rounded-lg"
      } p-4 relative pt-7`}
    >
      {console.log(responseFrames, toggleMedia, "responseFrames")}
      {responseFrames &&
        responseFrames.fallbackImage &&
        responseFrames.video && (
          <Switch
            className="absolute right-3 top-3 shadow-none"
            checked={toggleMedia}
            onCheckedChange={setToggleMedia}
          />
        )}
      <div className="flex justify-center ">
        {responseFrames && toggleMedia && responseFrames.video && (
          <iframe
            src={responseFrames?.video}
            className="aspect-video rounded mt-6"
            width="100%" // Set width to 100% to fill the container
            height="100%" // Set height to 100% to fill the container
            allowfullscreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            frameborder="0" // Add frameborder attribute
            scrolling="no" // Add scrolling attribute to prevent scrolling bars
            // onLoad={(event) => {
            //   // Access the iframe's content window
            //   const iframe = event.target;
            //   const iframeContent = iframe.contentWindow;

            //   // Check if the iframe content is accessible and contains a video element
            //   if (
            //     iframeContent &&
            //     iframeContent.document.querySelector("video")
            //   ) {
            //     // Pause the video
            //     iframeContent.document.querySelector("video").pause();
            //   }
            // }}
          />
        )}
      </div>
      {responseFrames && !toggleMedia && responseFrames.fallbackImage && (
        <img src={responseFrames?.fallbackImage} width="100%" alt="" />
      )}

      <p className="text-sm text-right">{mainURL}</p>

      <div className="grid grid-cols-2 gap-4 h-[30%] w-full">
        {responseFrames &&
          responseFrames.buttonProperties &&
          responseFrames.buttonProperties.map((buttonItem, index) => (
            <Button
              key={index}
              className="col-span-1"
              variant="outline"
              onClick={() => {
                console.log("buttonItem", buttonItem);
                if (buttonItem.action === "link") {
                  linkFrame(
                    responseFrames.metaTags[
                      `fc:frame:button:${index + 1}:target`
                    ]
                  );
                } else if (buttonItem.action === "post") {
                  postFrame(responseFrames.metaTags["fc:frame:post_url"]);
                } else if (buttonItem.action === "post_redirect") {
                  postRedirectFrame(
                    responseFrames.metaTags["fc:frame:post_url"]
                  );
                } else if (
                  buttonItem.action === "mint" ||
                  buttonItem.action === "tnx"
                ) {
                  linkFrame(frameUrl);
                  // alert("Mint or tnx: responseFrames.metaTags[`fc:frame:button:${index + 1}:target`]")
                } else {
                  // default
                  postFrame(responseFrames.metaTags["fc:frame:post_url"]);
                }
              }}
            >
              {(buttonItem.action === "link" ||
                buttonItem.action === "post_redirect") && (
                <SquareArrowOutUpRight className="mr-1 h-3 w-3" />
              )}
              <span
              // className={
              //   (buttonItem.action === "link" ||
              //     buttonItem.action === "post_redirect") &&
              //   "ml-2"
              // }
              >
                {buttonItem && buttonItem.buttonContent}
              </span>
            </Button>
          ))}
      </div>
    </div>
  );
}

export default Frame;
