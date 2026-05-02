"use client";

import classNames from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useState, useEffect, useCallback } from "react";
import Stack from "@/app/components/ui/Stack";
import CardSwap, { Card } from "@/app/components/ui/CardSwap";

const heroSectionImgs = [
  {
    url: "https://i.pinimg.com/736x/33/6c/64/336c64739c3b264d56549c9b784b445d.jpg",
    alt: "anya",
    rotate: -16,
    horizontal: 30,
    class: "z-0 max-md:translate-x-10",
  },
  {
    url: "https://i.pinimg.com/736x/7d/e0/ca/7de0ca17ed9fd367a96f2de92c62263c.jpg",
    alt: "anya",
    rotate: -8,
    horizontal: 20,
    class: "z-10 max-md:translate-x-5",
  },
  {
    url: "https://i.pinimg.com/736x/58/ab/fe/58abfe63e2c7a0838833cd6909ec69a0.jpg",
    alt: "anya",
    rotate: -4,
    horizontal: 0,
    class: " z-20 max-md:translate-x-5",
  },
  {
    url: "https://i.pinimg.com/736x/60/76/15/607615ae1b07c6bd3f265ac38578d1bc.jpg",
    alt: "anya",
    rotate: 4,
    horizontal: -10,
    class: "z-30 max-md:translate-x-0",
  },
  {
    url: "https://i.pinimg.com/736x/80/ee/92/80ee921a17d28db3b19b7d6c106cf8c2.jpg",
    alt: "anya",
    rotate: 8,
    horizontal: -30,
    class: " z-40 max-md:-translate-x-5",
  },
  {
    url: "https://i.pinimg.com/736x/80/6a/25/806a25cb58cb0ee9bd536c88b817af24.jpg",
    alt: "anya",
    rotate: 16,
    horizontal: -40,
    class: "z-50 max-md:-translate-x-10",
  },
];

const secondSectionImg = [
  {
    url: "https://i.pinimg.com/736x/80/6a/25/806a25cb58cb0ee9bd536c88b817af24.jpg",
    alt: "anya",
    x: 160, // corresponds to translate-x-40 (40 * 4px)
    y: -200, // corresponds to -translate-y-50
    class: "z-0 top-10 ",
  },
  {
    url: "https://i.pinimg.com/736x/7d/e0/ca/7de0ca17ed9fd367a96f2de92c62263c.jpg",
    alt: "anya",
    x: 40, // translate-x-10
    y: -160, // -translate-y-40
    class: "z-10 top-10",
  },
  {
    url: "https://i.pinimg.com/736x/58/ab/fe/58abfe63e2c7a0838833cd6909ec69a0.jpg",
    alt: "anya",
    x: -60, // -translate-x-15
    y: -80, // -translate-y-20
    class: "z-20 -top-20",
  },
  {
    url: "https://i.pinimg.com/736x/80/ee/92/80ee921a17d28db3b19b7d6c106cf8c2.jpg",
    alt: "anya",
    x: -140, // -translate-x-35
    y: 0, // -translate-y-0
    class: "z-30 max-md:!translate-x-[-]",
  },
  {
    url: "https://i.pinimg.com/736x/80/6a/25/806a25cb58cb0ee9bd536c88b817af24.jpg",
    alt: "anya",
    x: -220, // -translate-x-55
    y: 80,
    class: "z-40 max-md:!translate-x-[-]",
  },
];

const featuredArt = [
  "https://i.pinimg.com/736x/a7/41/00/a741006fd0920cb4bc007f81adf759ca.jpg",
  "https://i.pinimg.com/736x/f0/47/e9/f047e91f0dcf6d96f47b7aecff485a3d.jpg",
  "https://i.pinimg.com/736x/91/c8/87/91c8878fb89f3674b068ada54035d693.jpg",
  "https://i.pinimg.com/736x/f1/ec/e1/f1ece12f046904a76553c73020e45b0b.jpg",
  "https://i.pinimg.com/736x/51/8a/57/518a57d3e2a605de0e2bdd9b4d670634.jpg",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const fadeTransition = {
  duration: 0.8,
  ease: "easeInOut",
};

const page = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev === featuredArt.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer); // Cleanup on unmount or index change
  }, [index, nextSlide]);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? featuredArt.length - 1 : prev - 1));
  };
  return (
    <main className="max-w-[1580px] w-full mx-auto overflow-hidden flex flex-col gap-0 px-4 md:px-10">
      {/* First section banner. Hero section */}
      <section className="h-[100dvh]  justify-center flex flex-col text-center items-center gap-14 -mt-20">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl text-4xl font-bold md:text-6xl"
        >
          A place to display your masterpiece.
        </motion.h1>

        <div className="flex">
          {heroSectionImgs.map((i, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, rotate: 0, x: 0 }}
              animate={{ opacity: 1, y: 0, rotate: i.rotate, x: i.horizontal }}
              transition={{ duration: 1 }}
              className={`${i.class} flex justify-center gap-2 h-21 w-21 md:h-50 md:w-50 rounded-md overflow-hidden shadow-xl`}
            >
              <Image
                height={200}
                width={200}
                alt={i.alt}
                src={i.url}
                className={`h-full w-full object-cover`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-4 flex gap-8 font-semibold flex-col"
        >
          <p>
            Artist can display their masterpieces, and buyer can discover and
            buy your art
          </p>

          <div className="flex max-sm:text-sm gap-4 justify-center">
            <Link
              href="/login"
              className="bg-foreground text-background rounded-full px-8 py-2 cursor-pointer hover:opacity-80 transition"
            >
              Join Now
            </Link>
            <Link
              href="#second-banner"
              className="rounded-full px-8 py-2 cursor-pointer hover:opacity-80 transition"
            >
              Read More
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Second Section Banner */}
      <section
        id="second-banner"
        className="h-[100dvh] relative flex justify-between items-center gap-14 -mt-20 w-full"
      >
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={fadeTransition}
          className="md:w-[35%] max-md:w-[75%] text-start flex-col space-y-8 bg"
        >
          <h1 className="text-xl font-bold md:text-5xl">
            Showcase, Sell, <span className="text-red-500">& acquire arts</span>{" "}
            to our marketplace.
          </h1>
          <p>
            Dynamic community where artists and buyers seamlessly merge.
            ArtFusion brings together creation and enthusiast to share
            creativity
          </p>
          <div className="mt-4 flex gap-8 font-semibold flex-col">
            <div className="flex max-sm:text-sm gap-4 ">
              <Link
                href="/register"
                className="bg-foreground text-background rounded-full px-8 py-2 cursor-pointer hover:opacity-80 transition"
              >
                Join Now
              </Link>
              <Link
                href="#third-banner"
                className="rounded-full px-8 py-2 cursor-pointer hover:opacity-80 transition"
              >
                Read More
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="max-md:w-[20%] relative  md:flex-grow flex translate-y-20">
          {secondSectionImg.map((i, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: i.y + 20, x: i.x + 80 }}
              whileInView={{ opacity: 1, y: i.y, x: i.x }}
              transition={{ duration: 1, delay: 0, ease: "easeIn" }}
              className={`${i.class} flex justify-center max-md:absolute gap-2 h-30 w-30 md:h-50 md:w-50 rounded-md overflow-hidden shadow-xl`}
            >
              <Image
                height={200}
                width={200}
                alt={i.alt}
                src={i.url}
                className={`h-full w-full object-cover`}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Third Section banner */}
      <section
        id="third-banner"
        className="h-[100dvh] flex flex-col gap-4 w-full justify-center "
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={fadeTransition}
          className=" text-start flex-col space-y-4 "
        >
          <p className="font-semibold max-md:text-sm ">
            ARTWORK BY JEAVEN A. PARAS
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            Featured Artwork <br /> of the{" "}
            <span className="text-red-500">month</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full relative group"
          id="third-section"
        >
          <div className="w-full relative h-[500px] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  fill
                  alt="artwork"
                  src={featuredArt[index]}
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay Controls */}
            <div className="flex justify-between items-end absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent">
              <Link
                href="/register"
                className="bg-white text-black rounded-full px-8 py-2 cursor-pointer hover:scale-105 transition text-sm font-bold shadow-lg"
              >
                Buy now for ₱322
              </Link>

              <div className="flex gap-3 text-3xl items-center text-white">
                <button
                  onClick={prevSlide}
                  className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-white hover:text-black transition border border-white/20"
                >
                  <IoIosArrowBack />
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-black/50 backdrop-blur-sm rounded-full p-2 hover:bg-white hover:text-black transition border border-white/20"
                >
                  <IoIosArrowForward />
                </button>
              </div>
            </div>

            <ul className="absolute top-5 right-5 flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <li
                  key={i}
                  className={classNames("h-2 w-2 rounded-full bg-slate-400", {
                    "bg-white": i == index,
                  })}
                ></li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Fourth Banner */}
      <section
        id="third-banner"
        className="h-[90dvh] relative flex flex-col gap-4 justify-center max-w-[1080px] w-full mx-auto "
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={fadeTransition}
          className="flex-col space-y-4 text-center"
        >
          <h1 className="text-xl font-bold md:text-5xl">
            Whether you’re an artist trying to sell your work / or buyer seeking{" "}
            <span className="text-green-500">unique</span> pieces connects you
            to world of creativity commerce
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={fadeTransition}
          style={{ width: 208, height: 208 }}
          className="absolute top-[15%]  -translate-y-1/2 -ml-30  -translate-x-1/2 left-1/2"
        >
          <Stack
            randomRotation
            sensitivity={300}
            autoplay
            autoplayDelay={2000}
            pauseOnHover
          />
        </motion.div>
      </section>

      {/* Sixth Banner */}
      <section
        id="third-banner"
        className="h-[100dvh] md:flex gap-4 justify-center md:justify-between items-center md:flex-row-reverse max-md:flex-col-reverse max-w-[1280px] w-full mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={fadeTransition}
          className="text max-md:flex justify-center max-md:translate-x-10 items-center w-full md:w-1/2 text-black md:-mt-30 mb-30"
        >
          <div style={{ height: "600px", position: "relative" }}>
            <CardSwap cardDistance={50}>
              <Card style={{ backgroundColor: "#FE8A8C" }}>
                <div className="flex flex-col justify-center items-center text-2xl font-bold">
                  <Image
                    height={700}
                    width={700}
                    alt="sell_art_png"
                    src="/sell-art.png"
                    className="h-70 object-contain"
                  />
                  <h3>Sell Art</h3>
                </div>
              </Card>

              <Card style={{ backgroundColor: "#8F9EFF" }}>
                <div className="flex flex-col justify-center items-center text-2xl font-bold">
                  <Image
                    height={700}
                    width={700}
                    alt="sell_art_png"
                    src="/sell-art.png"
                    className="h-70 object-contain"
                  />
                  <h3>Buy Art</h3>
                </div>
              </Card>

              <Card style={{ backgroundColor: "#8AFEB1" }}>
                <div className="flex flex-col justify-center items-center text-2xl font-bold">
                  <Image
                    height={700}
                    width={700}
                    alt="sell_art_png"
                    src="/buy-art.png"
                    className="h-70 object-contain"
                  />
                  <h3>Explore Art</h3>
                </div>
              </Card>

              <Card style={{ backgroundColor: "#FFE681" }}>
                <div className="flex flex-col justify-center items-center text-2xl font-bold">
                  <Image
                    height={700}
                    width={700}
                    alt="sell_art_png"
                    src="/request-commission.png"
                    className="h-70 object-contain"
                  />
                  <h3>Request Art</h3>
                </div>
              </Card>
            </CardSwap>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={fadeTransition}
          className="flex flex-col space-y-4 md:w-1/2"
        >
          <p className="font-semibold">
            GET MORE <span className="text-green-500">CLOSER</span>
          </p>
          <h3 className="text-2xl md:text-6xl font-bold">
            Marketplace <br /> for Creativity
          </h3>
          <p className="w-full lg:w-80">
            In the realm of ArtistryHub, creativity knows no bounds, eternal
            marketplace celebrates the timeless nature of art.
          </p>

          <Link
            href="/login"
            className="bg-foreground w-fit text-background rounded-full px-8 py-2 cursor-pointer hover:opacity-80 transition"
          >
            Join Now
          </Link>
        </motion.div>
      </section>
    </main>
  );
};

export default page;
