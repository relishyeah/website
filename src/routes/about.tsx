import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { ANIMATION_DURATION_S } from "../constants";
import { motion } from "motion/react";

const imgMe = new URL("../assets/images/me.jpeg", import.meta.url).href;

export default function About() {
  return (
    <motion.div
      key="about"
      className="w-full h-auto p-4 text-red-500"
      initial={{ opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ duration: ANIMATION_DURATION_S, ease: "easeInOut" }}
    >
      <div className="flex justify-center items-center space-x-4 mb-6">
        <img src={imgMe} alt="Picture of me2" className="w-auto h-[32vh]" />

        <div className="flex flex-col justify-center items-start text-2xl space-y-1 font-medium">
          <span>web dev</span>
          <span>photographer</span>
          <span>bike enjoyer</span>
        </div>
      </div>

      {/* Bio text with consistent spacing */}
      <div className="space-y-4 text-lg mb-6 text-black">
        <p>
          Quinn is a San Francisco based Front End Software Engineer from
          Bellevue, WA with a degree in Computer Science from Boston University.
        </p>

        <p>
          In his spare time, you can find him climbing up hills, at a music
          venue, or waxing poetic about all things red.
        </p>
      </div>

      {/* Contact line */}
      <p className="text-lg mb-6 text-black">
        Reach out at{" "}
        <a
          href="mailto:contact@quinnrelyea.com"
          className="underline decoration-solid hover:text-red-500 transition"
        >
          contact@quinnrelyea.com
        </a>
        .
      </p>

      <ul className="flex justify-center space-x-8 text-3xl text-red-500">
        <li>
          <a
            href="https://www.linkedin.com/in/quinnrelyea/"
            className="hover:text-blue-600 transition"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </li>

        <li>
          <a
            href="https://instagram.com/ishotthemessengers"
            className="hover:text-pink-500 transition"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </li>

        <li>
          <a
            href="https://github.com/relishyeah"
            className="hover:text-gray-800 transition"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </li>
      </ul>
    </motion.div>
  );
}
