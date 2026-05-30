import HomeFocused from "@/components/home/HomeFocused";
import SmoothScroll from "@/components/SmoothScroll";
import { getClients, getPosts } from "@/lib/public-content";

export default async function FocusedPage() {
  const [clients, posts] = await Promise.all([getClients(), getPosts("en")]);
  return (
    <>
      <SmoothScroll />
      <HomeFocused clients={clients} posts={posts} />
    </>
  );
}
