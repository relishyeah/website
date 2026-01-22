export default function About() {
  return (
    <div className="p-4 text-red-500">
      <div className="flex justify-center items-center ">
        <img
          src="public/assets/images/me.jpeg"
          alt="Picture of me"
          className="w-auto h-[32vh]  mb-4"
        />
        <div className="flex flex-col h-full w-full  items-center">
          <span>Web Dev</span>
          <span>Photographer</span>
          <span>Bike Enjoyer</span>
        </div>
      </div>
    </div>
  );
}
