import HomeFocused from "@/components/home/HomeFocused";
import SmoothScroll from "@/components/SmoothScroll";
import { getClients } from "@/lib/public-content";

export default async function FocusedPage() {
  const clients = await getClients();
  return (
    <>
      <SmoothScroll />
      <HomeFocused clients={clients} />
    </>
  );
}
