import { getUserData } from '@/app/(auth)/auth/actions';
import { createUploadthing, type FileRouter } from 'uploadthing/next';


const f = createUploadthing();

const currUser = async () => {
  const user = await getUserData();
  return { id: user?.id };
};

export const ourFileRouter = {
  workspaceImage: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(() => currUser())
    .onUploadError((err) => console.log("ERROR ON UPLOAD ",err))
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;