import React from "react";

export const Tools = () => {
  const TagCloud = require("TagCloud");

  const container = ".tagcloud";
  const texts = [
    "3D",
    "TagCloud",
    "JavaScript",
    "CSS3",
    "Animation",
    "Interactive",
    "Mouse",
    "Rolling",
    "Sphere",
    "6KB",
    "v2.x",
  ];
  const options = {};

  TagCloud(container, texts, options);

  return <div>{TagCloud(container, texts, options)}</div>;
};
