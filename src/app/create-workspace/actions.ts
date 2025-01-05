/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { createClient } from '@/supabase/supabaseServer';
import { getUserData } from '../(auth)/auth/actions';

export const updateUserWorkspace = async (
    userId: string,
    workspaceId: string
  ) => {
    const supabase = await createClient();
  
    // Update the user record
    const { data: updateWorkspaceData, error: updateWorkspaceError } =
      await supabase.rpc('add_workspace_to_user', {
        user_id: userId,
        new_workspace: workspaceId,
      });
  
    return [updateWorkspaceData, updateWorkspaceError];
  };

export const addMemberToWorkspace = async (
    userId: string,
    workspaceId: number
  ) => {
    const supabase = await createClient();
  
    //   Update the workspace members
    const { data: addMemberToWorkspaceData, error: addMemberToWorkspaceError } =
      await supabase.rpc('add_member_to_workspace', {
        user_id: userId,
        workspace_id: workspaceId,
      });
  
    return [addMemberToWorkspaceData, addMemberToWorkspaceError];
  };

export const createWorkspace = async ({
  imageUrl,
  name,
  slug,
  invite_code,
}: {
  imageUrl?: string;
  name: string;
  slug: string;
  invite_code: string;
}) => {
  const supabase = await createClient();
  const userData = await getUserData();

  if (!userData) {
    return { error: 'No user data' };
  }

  const { error, data: workspaceRecord } = await supabase
    .from('workspaces')
    .insert({
      image_url: imageUrl,
      name,
      super_admin: userData.id,
      slug,
      invite_code,
    })
    .select('*');

  if (error) {
    return { error };
  }

  const [updateWorkspaceData, updateWorkspaceError] = await updateUserWorkspace(
    userData.id,
    workspaceRecord[0].id
  );

  if (updateWorkspaceError) {
    return { error: updateWorkspaceError };
  }

  //   Add user to workspace members
  const [addMemberToWorkspaceData, addMemberToWorkspaceError] =
    await addMemberToWorkspace(userData.id, workspaceRecord[0].id);

  if (addMemberToWorkspaceError) {
    return { error: addMemberToWorkspaceError };
  }
};