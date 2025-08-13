import HomeClient from "@/components/HomeClient";
import { BOSSES } from "@/constants";
import { loadWeaponDataSync } from "@/utils/loadWeaponData";

export default function Home() {
  const weapons = loadWeaponDataSync();

  return <HomeClient bosses={BOSSES} weapons={weapons} />;
}