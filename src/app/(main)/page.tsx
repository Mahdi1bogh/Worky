import { redirect } from "next/navigation";
import { getUserData } from "../(auth)/auth/actions";

export default async function Home() {
  const userData = await getUserData();
  if (!userData) {
    return redirect("/auth");
  }

  const userWorkspaceId = userData?.workspaces?.[0];

  if (!userWorkspaceId) {
    return redirect("/create-workspace");
  }

  if (userWorkspaceId) {
    return redirect(`/workspace/${userWorkspaceId}`);
  }
}
