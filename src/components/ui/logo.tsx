import { Link } from "react-router-dom";
import menualLogo from "@/images/home/menual.svg";

export default function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center"
    >
      <img src={menualLogo} alt="MENUAL" className="h-[18px] w-[98px]" />
    </Link>
  );
}
