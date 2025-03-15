//import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

const HeaderDisplay = () => {
  const imagesData = [
    "https://images.pexels.com/photos/1309766/pexels-photo-1309766.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/1486294/pexels-photo-1486294.jpeg?auto=compress&cs=tinysrgb&w=600",
    "https://images.pexels.com/photos/414917/pexels-photo-414917.jpeg?auto=compress&cs=tinysrgb&w=600",
  ];
  return (
    <Carousel className="my-10 mx-auto w-[93vw] overflow-x-clip sm:overflow-visible">
      <CarouselContent>
        {imagesData.map((image) => (
          <CarouselItem key={image}>
            <img
              src={image}
              loading="lazy"
              className="object-cover w-full h-[60vh] rounded-3xl"
            />
          </CarouselItem>
        ))}
        <CarouselItem></CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HeaderDisplay;
